import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  PlayCircle, 
  FileText, 
  HelpCircle, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  X,
  Download
} from 'lucide-react';
import { api } from '../../services/api';

export function WeeklyTimeline({ setActiveTab, selectedCourse, setSelectedCourse, courses = [], studentProfile, onRefreshData }) {
  const course = selectedCourse || courses[0];
  const [expandedWeek, setExpandedWeek] = useState(5); // Week 5 default expanded
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activePdfModal, setActivePdfModal] = useState(null);
  
  // Review Modal States
  const [reviewQuizId, setReviewQuizId] = useState(null);
  const [quizReviewData, setQuizReviewData] = useState(null);
  const [isLoadingReview, setIsLoadingReview] = useState(false);

  if (!course) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        No courses loaded. Please enroll in a course or check back later.
      </div>
    );
  }

  const timeline = course.weeklyTimeline || [];

  const handleToggleActivity = async (lessonId, activityType) => {
    try {
      await api.completeLesson(lessonId, studentProfile?.id || 'STU-88219', activityType);
      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (err) {
      console.error("Error completing lesson activity:", err);
    }
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
      {/* Header & Course Selector */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Weekly Learning Timeline
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Structured week-by-week curriculum with video lectures, reading notes, and quizzes.
          </p>
        </div>

        <select
          value={course.id || course.uuid}
          onChange={(e) => {
            const found = courses.find(c => (c.id === e.target.value || c.uuid === e.target.value));
            if (found && setSelectedCourse) setSelectedCourse(found);
          }}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '12px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            fontWeight: 700,
            fontSize: '0.875rem',
            color: '#3730a3',
            outline: 'none',
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
          }}
        >
          {courses.map(c => (
            <option key={c.id || c.uuid} value={c.id || c.uuid}>{c.title}</option>
          ))}
        </select>
      </div>

      {/* Course Banner */}
      <div className="ls-card" style={{
        background: 'linear-gradient(135deg, #e0e7ff 0%, #ffffff 100%)',
        borderColor: '#c7d2fe',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src={course.coverImage} 
            alt="Course thumbnail" 
            style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 700 }}>Instructor: {course.instructor}</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{course.title}</h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Overall Progress</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#3730a3' }}>{course.progress}% Completed</div>
          </div>
        </div>
      </div>

      {/* Timeline Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {timeline.map((item) => {
          const isExpanded = expandedWeek === item.week;
          const isCompleted = item.status === 'completed';
          const isInProgress = item.status === 'in-progress';
          const isLocked = item.status === 'upcoming';

          return (
            <div 
              key={item.week}
              className="ls-card animate-fade-up"
              style={{
                borderColor: isInProgress ? '#818cf8' : (isCompleted ? '#a7f3d0' : '#e2e8f0'),
                boxShadow: isInProgress ? '0 8px 24px rgba(79, 70, 229, 0.12)' : 'var(--shadow-sm)'
              }}
            >
              {/* Timeline Header Row */}
              <div 
                onClick={() => !isLocked && setExpandedWeek(isExpanded ? null : item.week)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: isLocked ? 'not-allowed' : 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {/* Status Indicator Icon */}
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: isCompleted ? '#d1fae5' : (isInProgress ? '#e0e7ff' : '#f1f5f9'),
                    color: isCompleted ? '#059669' : (isInProgress ? '#4f46e5' : '#94a3b8'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    {isCompleted ? <CheckCircle2 style={{ width: '22px', height: '22px' }} /> : (isLocked ? <Lock style={{ width: '18px', height: '18px' }} /> : `W${item.week}`)}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span className={`chip ${isCompleted ? 'chip-emerald' : (isInProgress ? 'chip-indigo' : 'chip-sky')}`}>
                        Week {item.week} • {item.status.toUpperCase()}
                      </span>
                      {item.quizScore !== 'Locked' && item.quizScore !== 'Pending' && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', backgroundColor: '#e6f4ea', padding: '2px 8px', borderRadius: '4px' }}>
                          Quiz Score: {item.quizScore}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isLocked ? '#94a3b8' : '#0f172a', marginTop: '4px' }}>
                      {item.topic}
                    </div>
                  </div>
                </div>

                <div>
                  {isExpanded ? <ChevronUp style={{ color: '#64748b' }} /> : <ChevronDown style={{ color: '#64748b' }} />}
                </div>
              </div>

              {/* Expanded Syllabus Content */}
              {isExpanded && (
                <div style={{
                  marginTop: '1.25rem',
                  paddingTop: '1.25rem',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {/* Lessons list */}
                  {item.lessons && item.lessons.map((lesson) => (
                    <div key={lesson.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {/* Video lecture row */}
                      <div style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                          <input 
                            type="checkbox"
                            checked={!!lesson.videoCompleted}
                            onChange={() => handleToggleActivity(lesson.id, 'video')}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#4f46e5' }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <PlayCircle style={{ width: '20px', height: '20px', color: '#4f46e5', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>Video Lecture: {lesson.title}</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Check off after watching the video</div>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={async () => {
                            await handleToggleActivity(lesson.id, 'video');
                            setActiveVideoModal(lesson.title);
                          }}
                          style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#4f46e5', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Watch
                        </button>
                      </div>

                      {/* Reading notes row */}
                      <div style={{
                        padding: '1rem',
                        borderRadius: '12px',
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                          <input 
                            type="checkbox"
                            checked={!!lesson.notesCompleted}
                            onChange={() => handleToggleActivity(lesson.id, 'notes')}
                            style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#0284c7' }}
                          />
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText style={{ width: '20px', height: '20px', color: '#0284c7', flexShrink: 0 }} />
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>Lecture Notes: {lesson.title} PDF</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Check off after viewing the pdf notes</div>
                            </div>
                          </div>
                        </div>
                        <button 
                          onClick={async () => {
                            await handleToggleActivity(lesson.id, 'notes');
                            setActivePdfModal(lesson.title);
                          }}
                          style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Assignment row */}
                  {item.assignment && (
                    <div style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                        <input 
                          type="checkbox"
                          disabled
                          checked={item.assignment.status === 'completed' || item.assignment.status === 'accepted'}
                          style={{ width: '18px', height: '18px', cursor: 'not-allowed', accentColor: '#10b981' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <FileText style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>Assignment: {item.assignment.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Status: <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{item.assignment.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {item.assignment.status !== 'completed' && item.assignment.status !== 'accepted' && item.assignment.status !== 'pending' ? (
                        <button 
                          onClick={() => setActiveTab('assignments')}
                          style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#10b981', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Submit
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {item.assignment.status === 'pending' && (
                            <button 
                              onClick={() => setActiveTab('assignments')}
                              style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #10b981', backgroundColor: '#ffffff', color: '#10b981', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                            >
                              Resubmit
                            </button>
                          )}
                          <span className="chip chip-emerald" style={{ textTransform: 'capitalize' }}>
                            {item.assignment.status === 'accepted' ? 'Accepted' : 'Under Review'}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quiz row */}
                  {item.quiz && (
                    <div style={{
                      padding: '1rem',
                      borderRadius: '12px',
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                        <input 
                          type="checkbox"
                          disabled
                          checked={item.quiz.status === 'completed'}
                          style={{ width: '18px', height: '18px', cursor: 'not-allowed', accentColor: '#f59e0b' }}
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <HelpCircle style={{ width: '20px', height: '20px', color: '#f59e0b', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>Quiz: {item.quiz.title}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Status: <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>{item.quiz.status}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {item.quiz.status !== 'completed' ? (
                        <button 
                          onClick={() => setActiveTab('quizzes')}
                          style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                        >
                          Take Quiz
                        </button>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <button 
                            onClick={() => handleViewAnswers(item.quiz.id || item.quiz.uuid)}
                            style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #4f46e5', backgroundColor: '#ffffff', color: '#4f46e5', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                          >
                            View Answers
                          </button>
                          <span className="chip chip-amber" style={{ opacity: 0.6 }}>Completed</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

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

      {/* Video Modal Simulation */}
      {activeVideoModal && (
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
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#0f172a', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>📹 Video Lecture: {activeVideoModal}</div>
              <button onClick={() => setActiveVideoModal(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            <div style={{ height: '360px', backgroundColor: '#000000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#ffffff', gap: '1rem' }}>
              <PlayCircle style={{ width: '64px', height: '64px', color: '#6366f1', cursor: 'pointer' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>Simulated HD Video Streaming Player</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Press Play to begin watching lecture stream...</div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Modal Simulation */}
      {activePdfModal && (
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
            maxWidth: '680px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#3730a3', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>📄 PDF Notes: {activePdfModal}</div>
              <button onClick={() => setActivePdfModal(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>
            <div style={{ padding: '2rem', minHeight: '300px', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#0f172a' }}>Lecture Summary & Formula Sheet</div>
              <p style={{ color: '#475569', lineHeight: 1.6 }}>
                1. Feedforward Architecture: Input Layer → Hidden Layer(s) → Output Layer.<br/>
                2. Weight Matrix Updates: W_new = W_old - (learning_rate * dLoss/dW).<br/>
                3. Activation functions introduce non-linearity enabling complex feature representations.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn-primary" onClick={() => setActivePdfModal(null)}>
                  <Download style={{ width: '16px', height: '16px' }} /> Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
