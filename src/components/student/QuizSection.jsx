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
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';

export function QuizSection({ quizzes, setQuizzes, malpracticeLogs, setMalpracticeLogs }) {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [quizFinished, setQuizFinished] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);
  
  // Proctoring Violations state
  const [violations, setViolations] = useState([]);
  const [warningMessage, setWarningMessage] = useState('');

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

  const triggerProctorViolation = (reason) => {
    const updatedViolations = [...violations, reason];
    setViolations(updatedViolations);
    
    // Set warning banner toast
    setWarningMessage(`🚨 PROCTOR WARNING: "${reason}" detected! (${updatedViolations.length}/3)`);
    setTimeout(() => setWarningMessage(''), 4500);

    // Auto submit quiz on 3 warnings
    if (updatedViolations.length >= 3) {
      setCalculatedScore(0);
      setQuizFinished(true);

      const log = {
        id: Date.now(),
        studentName: 'Alex Morgan',
        studentId: 'STU-88219',
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
        studentName: 'Alex Morgan',
        studentId: 'STU-88219',
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
    setTimeLeft(quiz.duration * 60 || 900);
    setQuizFinished(false);
    setViolations([]);
    setWarningMessage('');
  };

  const handleSelectOption = (questionId, optionIdx) => {
    setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIdx }));
  };

  const finishQuiz = () => {
    if (!activeQuiz) return;
    let correctCount = 0;
    activeQuiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const scorePct = Math.round((correctCount / activeQuiz.questions.length) * 100);
    setCalculatedScore(scorePct);
    setQuizFinished(true);

    if (scorePct >= 80) {
      confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
    }

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(e => console.log("Exit fullscreen failed."));
    }

    // Sync score to active student's courses syllabus completion
    // Mark quiz completed in main quizzes view
    setQuizzes(prev => prev.map(q => 
      q.id === activeQuiz.id 
        ? { ...q, status: 'completed', lastScore: `${scorePct}%` }
        : q
    ));
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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
              <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', marginBottom: '0.75rem', width: '100%' }}>
                <span className="chip chip-sky">
                  {quiz.courseName}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '0.775rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock style={{ width: '14px', height: '14px' }} /> {quiz.duration} mins
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {quiz.title}
              </h3>

              <div style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '1.25rem' }}>
                • Questions: <strong>{quiz.questionsCount} MCQs</strong><br/>
                • Total Marks: <strong>{quiz.totalMarks || 100} Marks</strong>
              </div>
            </div>

            <div>
              {quiz.status === 'completed' ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>Last Score: {quiz.lastScore}</span>
                  <button className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', color: '#2563eb', borderColor: '#bfdbfe' }} onClick={() => startQuiz(quiz)}>
                    <RotateCcw style={{ width: '14px', height: '14px' }} /> Retake Test
                  </button>
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
                        Submit Exam Answers
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Results Summary */
                <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: calculatedScore >= 80 ? '#d1fae5' : (calculatedScore === 0 && violations.length >= 3 ? '#ffe4e6' : '#fef3c7'),
                    color: calculatedScore >= 80 ? '#059669' : (calculatedScore === 0 && violations.length >= 3 ? '#ef4444' : '#d97706'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto'
                  }}>
                    <Trophy style={{ width: '42px', height: '42px' }} />
                  </div>

                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    {violations.length >= 3 ? "Exam Voided / Suspended" : "Quiz Completed! 🎉"}
                  </h2>

                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: calculatedScore >= 80 ? '#059669' : (violations.length >= 3 ? '#ef4444' : '#2563eb'), marginBottom: '0.5rem' }}>
                    {calculatedScore}% Score
                  </div>

                  <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.4 }}>
                    {violations.length >= 3 ? (
                      <span style={{ color: '#b91c1c', fontWeight: 700 }}>
                        This exam was auto-submitted due to 3 proctoring failures. A security report has been sent to faculty review desk.
                      </span>
                    ) : (
                      <span>
                        You completed the test with <strong>{violations.length} warnings</strong>. Score recorded in student file.
                      </span>
                    )}
                  </p>

                  <button className="btn-primary" style={{ margin: '0 auto' }} onClick={() => setActiveQuiz(null)}>
                    Return to Dashboard
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
