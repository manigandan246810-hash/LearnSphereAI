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
  RotateCcw
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_QUIZZES } from '../../data/mockData';

export function QuizSection() {
  const [quizzes, setQuizzes] = useState(MOCK_QUIZZES);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900); // 15 mins
  const [quizFinished, setQuizFinished] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);

  // Timer effect when quiz is active
  useEffect(() => {
    let timer;
    if (activeQuiz && !quizFinished && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, quizFinished, timeLeft]);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIdx(0);
    setSelectedAnswers({});
    setTimeLeft(quiz.durationMinutes * 60);
    setQuizFinished(false);
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
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Interactive Quizzes & Practice Tests
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Test your neural network understanding, earn XP points, and boost your leaderboard rank.
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span className={`chip ${quiz.status === 'completed' ? 'chip-emerald' : 'chip-indigo'}`}>
                  {quiz.courseName}
                </span>
                <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock style={{ width: '14px', height: '14px' }} /> {quiz.durationMinutes} mins
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {quiz.title}
              </h3>

              <div style={{ fontSize: '0.825rem', color: '#475569', marginBottom: '1.25rem' }}>
                • Questions: <strong>{quiz.questionsCount} MCQs</strong><br/>
                • Leaderboard Average: <strong>{quiz.avgScore}</strong>
              </div>
            </div>

            <div>
              {quiz.status === 'completed' ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669' }}>Last Score: {quiz.lastScore}</span>
                  <button className="btn-secondary" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }} onClick={() => startQuiz(quiz)}>
                    <RotateCcw style={{ width: '14px', height: '14px' }} /> Retake
                  </button>
                </div>
              ) : (
                <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => startQuiz(quiz)}>
                  <Sparkles style={{ width: '16px', height: '16px' }} /> Start Quiz Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quiz Runner Modal */}
      {activeQuiz && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="animate-fade-up" style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '680px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.35)'
          }}>
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#a5b4fc', fontWeight: 700 }}>Interactive Test Runner</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{activeQuiz.title}</div>
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
                <button onClick={() => setActiveQuiz(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                  <X style={{ width: '20px', height: '20px' }} />
                </button>
              </div>
            </div>

            {/* Quiz Body */}
            <div style={{ padding: '1.75rem' }}>
              {!quizFinished ? (
                <div>
                  {/* Question Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem', fontWeight: 600 }}>
                    <span>Question {currentQuestionIdx + 1} of {activeQuiz.questions.length}</span>
                    <span>10 XP Per Question</span>
                  </div>

                  {/* Question Text */}
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                    {activeQuiz.questions[currentQuestionIdx].question}
                  </h3>

                  {/* Options List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
                    {activeQuiz.questions[currentQuestionIdx].options.map((option, optIdx) => {
                      const isSelected = selectedAnswers[activeQuiz.questions[currentQuestionIdx].id] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(activeQuiz.questions[currentQuestionIdx].id, optIdx)}
                          style={{
                            textAlign: 'left',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: isSelected ? '2px solid #4f46e5' : '1px solid #cbd5e1',
                            backgroundColor: isSelected ? '#e0e7ff' : '#ffffff',
                            color: isSelected ? '#3730a3' : '#0f172a',
                            fontWeight: isSelected ? 700 : 500,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}
                        >
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: isSelected ? '2px solid #4f46e5' : '2px solid #cbd5e1',
                            backgroundColor: isSelected ? '#4f46e5' : 'transparent',
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
                      <button className="btn-accent" onClick={finishQuiz}>
                        Submit Quiz Answers
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Results Summary */
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    backgroundColor: calculatedScore >= 80 ? '#d1fae5' : '#fef3c7',
                    color: calculatedScore >= 80 ? '#059669' : '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto'
                  }}>
                    <Trophy style={{ width: '42px', height: '42px' }} />
                  </div>

                  <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Quiz Completed! 🎉
                  </h2>

                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#4f46e5', marginBottom: '0.5rem' }}>
                    {calculatedScore}% Score
                  </div>

                  <p style={{ color: '#64748b', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                    You earned <strong style={{ color: '#f97316' }}>+250 XP</strong> and climbed to <strong>#2 on the Leaderboard</strong>!
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
