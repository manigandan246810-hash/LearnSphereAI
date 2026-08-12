import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Clock, 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles,
  X,
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export function QuizSection({ quizzes = [], setQuizzes, malpracticeLogs = [], setMalpracticeLogs, studentProfile, onRefreshData }) {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [quizFinished, setQuizFinished] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);
  const [gradedResults, setGradedResults] = useState(null);
  
  // Proctoring Violations state
  const [violations, setViolations] = useState([]);
  const [warningMessage, setWarningMessage] = useState('');

  // Review Modal States
  const [reviewQuizId, setReviewQuizId] = useState(null);
  const [quizReviewData, setQuizReviewData] = useState(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

  // Timer effect when quiz is active
  useEffect(() => {
    let timer;
    if (activeQuiz && !quizFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            finishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, quizFinished, timeLeft]);

  // Tab change & focus tracking proctoring
  useEffect(() => {
    if (!activeQuiz || quizFinished) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerProctorViolation('Tab switched / backgrounded');
      }
    };

    const handleWindowBlur = () => {
      triggerProctorViolation('Lost window focus (focus blur)');
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [activeQuiz, quizFinished, violations]);

  // Clipboard & Selection Proctor Block
  useEffect(() => {
    if (!activeQuiz || quizFinished) return;

    const handleContextMenu = (e) => {
      e.preventDefault();
      triggerProctorViolation('Right-click / Context Menu blocked');
    };

    const handleKeyDown = (e) => {
      const isCopyKeys = (e.ctrlKey || e.metaKey) && ['c', 'x', 'a', 'v', 'u'].includes(e.key.toLowerCase());
      const isInspectKeys = e.key === 'F12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'i');
      
      if (isCopyKeys || isInspectKeys) {
        e.preventDefault();
        e.stopPropagation();
        triggerProctorViolation(`Blocked keyboard copy shortcut: ${e.key.toUpperCase()}`);
      }
    };

    const handleClipboardEvent = (e) => {
      e.preventDefault();
      triggerProctorViolation('Clipboard action (Copy/Cut/Paste) blocked');
    };

    const handleSelectStart = (e) => {
      e.preventDefault();
    };

    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('copy', handleClipboardEvent);
    document.addEventListener('cut', handleClipboardEvent);
    document.addEventListener('paste', handleClipboardEvent);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('copy', handleClipboardEvent);
      document.removeEventListener('cut', handleClipboardEvent);
      document.removeEventListener('paste', handleClipboardEvent);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, [activeQuiz, quizFinished, violations]);

  const triggerProctorViolation = async (reason) => {
    const updatedViolations = [...violations, reason];
    setViolations(updatedViolations);
    
    // Set warning banner toast
    setWarningMessage(`🚨 PROCTOR WARNING: "${reason}" detected! (${updatedViolations.length}/3)`);
    setTimeout(() => setWarningMessage(''), 4500);

    // Auto submit quiz on 3 warnings
    if (updatedViolations.length >= 3) {
      setCalculatedScore(0);
      
      const answersMap = {};
      if (activeQuiz && activeQuiz.questions) {
        activeQuiz.questions.forEach(q => {
          answersMap[q.id] = -1;
        });
      }

      try {
        await api.submitQuizAttempt(activeQuiz.id, studentProfile?.id || 'STU-88219', answersMap);
      } catch (err) {
        console.error("Error logging auto-submission:", err);
      }

      setGradedResults({
        passed: false,
        scorePercentage: 0,
        xpEarned: 0,
        questions: activeQuiz.questions.map(q => ({
          ...q,
          selectedOption: -1,
          correctOption: q.correct !== undefined ? q.correct : 1,
          explanation: 'Exam terminated and score voided due to proctoring protocol violation.'
        }))
      });

      setQuizFinished(true);

      const log = {
        id: Date.now(),
        studentName: studentProfile?.name || 'Alex Morgan',
        studentId: studentProfile?.id || 'STU-88219',
        quizTitle: activeQuiz.title,
        time: new Date().toLocaleTimeString(),
        infractionsCount: updatedViolations.length,
        infractions: updatedViolations,
        severity: 'High',
        status: 'Pending'
      };
      setMalpracticeLogs(prev => [log, ...prev]);

      alert("🚨 EXAM VOIDED: 3 malpractice infractions detected. Your test has been terminated, scored at 0%, and flagged for faculty administration.");
      
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
    } else {
      // Log minor/medium infraction
      const log = {
        id: Date.now(),
        studentName: studentProfile?.name || 'Alex Morgan',
        studentId: studentProfile?.id || 'STU-88219',
        quizTitle: activeQuiz.title,
        time: new Date().toLocaleTimeString(),
        infractionsCount: updatedViolations.length,
        infractions: updatedViolations,
        severity: updatedViolations.length === 1 ? 'Low' : 'Medium',
        status: 'Pending'
      };
      setMalpracticeLogs(prev => [log, ...prev]);
    }
  };

  const startQuiz = (quiz) => {
    // Request fullscreen on start to lock client screen
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen().catch(e => console.log("Fullscreen request rejected."));
    }

    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTimeLeft(quiz.durationMinutes * 60 || 900);
    setQuizFinished(false);
    setViolations([]);
    setWarningMessage('');
    setGradedResults(null);
  };

  const handleSelectOption = (questionId, optionIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const finishQuiz = async () => {
    if (!activeQuiz) return;
    
    // Map selected options to question codes/orders
    const answersMap = {};
    activeQuiz.questions.forEach(q => {
      answersMap[q.id] = selectedAnswers[q.id] !== undefined ? selectedAnswers[q.id] : -1;
    });

    try {
      const res = await api.submitQuizAttempt(activeQuiz.id, studentProfile?.id || 'STU-88219', answersMap);
      
      setGradedResults({
        passed: res.passed,
        scorePercentage: res.scorePercentage,
        xpEarned: res.xpEarned,
        questions: res.questions
      });
      setCalculatedScore(res.scorePercentage);
      setQuizFinished(true);

      if (res.scorePercentage >= 80) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
      }

      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(e => console.log("Exit fullscreen failed."));
      }

      // Sync dashboard data
      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (err) {
      console.error("Error submitting quiz attempt:", err);
      // Fallback local scoring if server error
      let correctCount = 0;
      activeQuiz.questions.forEach((q) => {
        if (selectedAnswers[q.id] === q.correct) {
          correctCount += 1;
        }
      });
      const scorePct = Math.round((correctCount / activeQuiz.questions.length) * 100);
      setCalculatedScore(scorePct);
      setQuizFinished(true);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleViewAnswers = async (quizId) => {
    setIsLoadingReview(true);
    setReviewQuizId(quizId);
    try {
      const data = await api.getQuizReview(quizId, studentProfile?.id || studentProfile?.user_code || 'STU-88219');
      setQuizReviewData(data);
    } catch (err) {
      console.error('Error loading quiz review:', err);
    } finally {
      setIsLoadingReview(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <ShieldAlert style={{ width: '28px', height: '28px', color: '#2563eb' }} />
          Proctored Exams & Quizzes
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Test your knowledge with client-side proctor lockouts. Fullscreen, focus security, and text-copy blockades are active.
        </p>
      </div>

      {/* Available Quiz Cards Grid */}
      <div className="grid-responsive">
        {quizzes.map((quiz, idx) => (
          <div 
            key={quiz.id} 
            className="ls-card ls-card-hover animate-fade-up"
            style={{ animationDelay: `${idx * 0.08}s`, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', width: '100%' }}>
                <span className="chip chip-sky">
                  {quiz.courseName}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '0.775rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock style={{ width: '14px', height: '14px' }} /> {quiz.durationMinutes} mins
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {quiz.title}
              </h3>

              <div style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '1.25rem' }}>
                • Questions: <strong>{quiz.questionsCount} MCQs</strong><br/>
                • Total Marks: <strong>100 Marks</strong>
              </div>
            </div>

            <div>
              {quiz.status === 'completed' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>Last Score: {quiz.lastScore}</span>
                    <span className="chip chip-amber" style={{ margin: 0 }}>Completed</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <button 
                      className="btn-secondary" 
                      style={{ flex: 1, padding: '0.4rem 0.85rem', fontSize: '0.8rem', color: '#2563eb', borderColor: '#bfdbfe', justifyContent: 'center' }} 
                      onClick={() => {
                        if (window.confirm("Warning: Retaking this quiz will overwrite your previous score. Are you sure you want to proceed?")) {
                          startQuiz(quiz);
                        }
                      }}
                    >
                      <RotateCcw style={{ width: '14px', height: '14px' }} /> Retake
                    </button>
                    <button 
                      className="btn-primary" 
                      style={{ flex: 1, padding: '0.4rem 0.85rem', fontSize: '0.8rem', justifyContent: 'center' }} 
                      onClick={() => handleViewAnswers(quiz.id || quiz.uuid)}
                    >
                      View Review
                    </button>
                  </div>
                </div>
              ) : (
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => startQuiz(quiz)}>
                  <Sparkles style={{ width: '16px', height: '16px' }} /> Launch Exam
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Proctored Quiz Runner View Overlay */}
      {activeQuiz && (
        <div 
          id="quiz-fullscreen-container"
          onContextMenu={(e) => { e.preventDefault(); triggerProctorViolation('Right-click attempt blocked'); }}
          onCopy={(e) => { e.preventDefault(); triggerProctorViolation('Text copy attempt blocked'); }}
          onPaste={(e) => { e.preventDefault(); triggerProctorViolation('Text paste attempt blocked'); }}
          onSelectStart={(e) => e.preventDefault()}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: '#0f172a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            #quiz-fullscreen-container * {
              user-select: none !important;
              -webkit-user-select: none !important;
              -moz-user-select: none !important;
              -ms-user-select: none !important;
            }
          `}} />
          
          {/* Violations Warn Header Banner */}
          {warningMessage && (
            <div style={{
              position: 'fixed',
              top: '16px',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.9rem',
              boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.4)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <AlertTriangle style={{ width: '18px', height: '18px' }} />
              {warningMessage}
            </div>
          )}

          <div className="animate-fade-up" style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '720px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '4px solid #3b82f6'
          }}>
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#93c5fd', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldAlert style={{ width: '14px', height: '14px', color: '#ef4444' }} />
                  PROCTORED TEST ACTIVE
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>{activeQuiz.title}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {!quizFinished && (
                  <div style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    color: '#fca5a5',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '0.875rem',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Clock style={{ width: '16px', height: '16px' }} /> {formatTimer(timeLeft)}
                  </div>
                )}
                <button 
                  onClick={() => {
                    if (window.confirm("Are you sure you want to exit the exam? Your progress will be lost.")) {
                      setActiveQuiz(null);
                      if (document.fullscreenElement) {
                        document.exitFullscreen().catch(e => console.log(e));
                      }
                    }
                  }} 
                  style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                >
                  <X style={{ width: '22px', height: '22px' }} />
                </button>
              </div>
            </div>

            {/* Quiz Body */}
            <div style={{ padding: '2rem' }}>
              {!quizFinished ? (
                <div>
                  {/* Warning Info Bar */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem', fontWeight: 700, backgroundColor: '#f1f5f9', padding: '8px 12px', borderRadius: '8px' }}>
                    <span>Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}</span>
                    <span style={{ color: '#ef4444' }}>Warnings: {violations.length} / 3 Max</span>
                  </div>

                  {/* Question Text */}
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                    {activeQuiz.questions[currentQuestionIdx].question}
                  </h3>

                  {/* Options List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {activeQuiz.questions[currentQuestionIdx].options.map((option, optIdx) => {
                      const isSelected = selectedAnswers[activeQuiz.questions[currentQuestionIdx].id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(activeQuiz.questions[currentQuestionIdx].id, optIdx)}
                          style={{
                            textAlign: 'left',
                            padding: '1.1rem',
                            borderRadius: '12px',
                            border: isSelected ? '2px solid #2563eb' : '1px solid #cbd5e1',
                            backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                            color: isSelected ? '#1e40af' : '#0f172a',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.925rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}
                        >
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: isSelected ? '2px solid #2563eb' : '2px solid #cbd5e1',
                            backgroundColor: isSelected ? '#2563eb' : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: '0.75rem',
                            fontWeight: 800
                          }}>
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {/* Footer Navigation */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                      className="btn-secondary"
                      disabled={currentQuestionIdx === 0}
                      onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                      style={{ opacity: currentQuestionIdx === 0 ? 0.5 : 1 }}
                    >
                      Previous
                    </button>

                    {currentQuestionIdx < activeQuiz.questions.length - 1 ? (
                      <button className="btn-primary" onClick={() => setCurrentQuestionIdx(prev => prev + 1)}>
                        Next Question <ArrowRight style={{ width: '16px', height: '16px' }} />
                      </button>
                    ) : (
                      <button className="btn-accent" style={{ background: '#059669', borderColor: '#059669' }} onClick={finishQuiz}>
                        Submit Answers
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Detailed Quiz Results & Review Screen */
                <div style={{ padding: '0.5rem 0', maxHeight: '72vh', overflowY: 'auto' }}>
                  <div style={{ textAlign: 'center', paddingBottom: '1rem' }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      backgroundColor: calculatedScore >= 70 ? '#d1fae5' : '#ffe4e6',
                      color: calculatedScore >= 70 ? '#059669' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1.25rem auto'
                    }}>
                      <Trophy style={{ width: '42px', height: '42px' }} />
                    </div>

                    <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
                      {violations.length >= 3 ? "Exam Voided" : "Quiz Finished!"}
                    </h2>

                    <div style={{
                      display: 'inline-block',
                      padding: '0.35rem 1rem',
                      borderRadius: '9999px',
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      backgroundColor: calculatedScore >= 70 ? '#d1fae5' : '#ffe4e6',
                      color: calculatedScore >= 70 ? '#065f46' : '#991b1b',
                      marginBottom: '0.75rem'
                    }}>
                      {calculatedScore >= 70 ? 'STATUS: PASSED' : 'STATUS: FAILED'}
                    </div>

                    <div style={{ fontSize: '2.5rem', fontWeight: 800, color: calculatedScore >= 70 ? '#059669' : '#ef4444', marginBottom: '0.5rem' }}>
                      {calculatedScore}% Score
                    </div>

                    <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                      {violations.length >= 3 ? (
                        <span style={{ color: '#b91c1c', fontWeight: 700 }}>
                          This exam was voided due to 3 malpractice warnings. A report has been filed.
                        </span>
                      ) : (
                        <span>
                          Passed with <strong>{violations.length} warnings</strong>. Score saved to database.
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Question Review List */}
                  {gradedResults && gradedResults.questions && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left', marginTop: '1.5rem', padding: '0 1rem' }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Award style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
                        Explanations & Correct Option Highlights
                      </h4>

                      {gradedResults.questions.map((q, idx) => {
                        return (
                          <div key={q.id || idx} style={{
                            padding: '1.25rem',
                            borderRadius: '16px',
                            backgroundColor: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem'
                          }}>
                            <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                              {idx + 1}. {q.question}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                              {q.options.map((opt, optIdx) => {
                                const isSelected = q.selectedOption === optIdx;
                                const isCorrect = q.correctOption === optIdx;

                                let borderStyle = '1px solid #cbd5e1';
                                let bg = '#ffffff';
                                let color = '#475569';
                                let mark = null;

                                if (isSelected) {
                                  if (isCorrect) {
                                    borderStyle = '2px solid #10b981';
                                    bg = '#ecfdf5';
                                    color = '#065f46';
                                    mark = '✓ Correct Choice';
                                  } else {
                                    borderStyle = '2px solid #ef4444';
                                    bg = '#fef2f2';
                                    color = '#991b1b';
                                    mark = '✗ Incorrect Choice';
                                  }
                                } else if (isCorrect) {
                                  borderStyle = '2px solid #10b981';
                                  bg = '#ecfdf5';
                                  color = '#065f46';
                                  mark = '✓ Correct Answer';
                                }

                                return (
                                  <div 
                                    key={optIdx} 
                                    style={{
                                      padding: '0.75rem 1rem',
                                      borderRadius: '10px',
                                      border: borderStyle,
                                      backgroundColor: bg,
                                      color: color,
                                      fontSize: '0.85rem',
                                      fontWeight: isSelected || isCorrect ? 700 : 500,
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center'
                                    }}
                                  >
                                    <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                                    {mark && <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{mark}</span>}
                                  </div>
                                );
                              })}
                            </div>

                            {/* Explanation Box */}
                            <div style={{
                              padding: '0.75rem 1rem',
                              backgroundColor: '#eff6ff',
                              borderRadius: '10px',
                              borderLeft: '4px solid #2563eb',
                              fontSize: '0.8rem',
                              color: '#1e40af',
                              lineHeight: 1.5,
                              marginTop: '0.25rem'
                            }}>
                              <strong>Explanation:</strong> {q.explanation}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
                    <button className="btn-primary" onClick={() => setActiveQuiz(null)}>
                      Return to Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Quiz Answers Review Modal */}
      {reviewQuizId && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="animate-fade-up" style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '720px',
            width: '100%',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            {/* Header */}
            <div style={{ padding: '1.25rem 1.5rem', backgroundColor: '#1e1b4b', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', margin: 0 }}>📝 Quiz Attempt Review</h3>
                {quizReviewData && (
                  <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: '4px 0 0 0' }}>
                    Score: {quizReviewData.scorePercentage}% | XP Earned: {quizReviewData.xpEarned} XP
                  </p>
                )}
              </div>
              <button onClick={() => { setReviewQuizId(null); setQuizReviewData(null); }} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {isLoadingReview ? (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b', fontWeight: 600 }}>
                  Loading review data from database...
                </div>
              ) : quizReviewData?.questions ? (
                quizReviewData.questions.map((q, idx) => (
                  <div key={q.id || idx} style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '0.75rem' }}>
                      Question {idx + 1}: {q.question}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                      {q.options.map((option, optIdx) => {
                        const isCorrectOption = optIdx === q.correctOption;
                        const isSelectedOption = optIdx === q.selectedOption;
                        
                        let optionBg = '#ffffff';
                        let optionBorder = '#e2e8f0';
                        let optionColor = '#334155';
                        let prefixText = '';

                        if (isCorrectOption) {
                          optionBg = '#e6f4ea';
                          optionBorder = '#34a853';
                          optionColor = '#137333';
                          prefixText = '✓ ';
                        } else if (isSelectedOption) {
                          optionBg = '#fce8e6';
                          optionBorder = '#ea4335';
                          optionColor = '#c5221f';
                          prefixText = '✗ ';
                        }

                        return (
                          <div key={optIdx} style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '10px',
                            border: `1.5px solid ${optionBorder}`,
                            backgroundColor: optionBg,
                            color: optionColor,
                            fontWeight: isSelectedOption || isCorrectOption ? 700 : 500,
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                          }}>
                            <span>{prefixText}{option}</span>
                            {isSelectedOption && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', backgroundColor: isCorrectOption ? '#137333' : '#c5221f', color: '#ffffff' }}>Your Answer</span>}
                            {!isSelectedOption && isCorrectOption && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px', backgroundColor: '#137333', color: '#ffffff' }}>Correct Answer</span>}
                          </div>
                        );
                      })}
                    </div>

                    <div style={{
                      padding: '0.85rem',
                      borderRadius: '10px',
                      backgroundColor: '#eff6ff',
                      borderLeft: '4px solid #3b82f6',
                      fontSize: '0.8rem',
                      color: '#1e40af',
                      lineHeight: 1.5
                    }}>
                      <strong>Explanation:</strong> {q.explanation}
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#ef4444', fontWeight: 600 }}>
                  Could not load quiz review. Make sure you completed the quiz.
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#ffffff' }}>
              <button 
                onClick={() => { setReviewQuizId(null); setQuizReviewData(null); }}
                className="btn-primary"
              >
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
