import React, { useState, useEffect } from 'react';
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
import { MOCK_COURSES } from '../../data/mockData';
import { api } from '../../services/api';

export function WeeklyTimeline({ setActiveTab, selectedCourse: initialCourse }) {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [selectedCourse, setSelectedCourse] = useState(initialCourse || MOCK_COURSES[0]);
  const [expandedWeek, setExpandedWeek] = useState(5);
  const [activeVideoModal, setActiveVideoModal] = useState(null);
  const [activePdfModal, setActivePdfModal] = useState(null);

  useEffect(() => {
    let isMounted = true;
    api.getCourses()
      .then(res => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          setCourses(res);
          if (!initialCourse) {
            setSelectedCourse(res[0]);
          }
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [initialCourse]);

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
          value={selectedCourse.id}
          onChange={(e) => setSelectedCourse(courses.find(c => c.id === e.target.value) || courses[0])}
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
            <option key={c.id} value={c.id}>{c.title}</option>
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
            src={selectedCourse.coverImage} 
            alt="Course thumbnail" 
            style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontSize: '0.8rem', color: '#4f46e5', fontWeight: 700 }}>Instructor: {selectedCourse.instructor}</div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{selectedCourse.title}</h2>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Overall Progress</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#3730a3' }}>{selectedCourse.progress}% Completed</div>
          </div>
        </div>
      </div>

      {/* Timeline Accordion */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {(selectedCourse.weeklyTimeline || []).map((item) => {
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`chip ${isCompleted ? 'chip-emerald' : (isInProgress ? 'chip-indigo' : 'chip-sky')}`}>
                        Week {item.week} • {item.status.toUpperCase()}
                      </span>
                      {item.quizScore !== 'Locked' && (
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
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
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '1rem'
                }}>
                  {/* Video Lecture Tile */}
                  <div style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <PlayCircle style={{ width: '24px', height: '24px', color: '#4f46e5' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>Video Lecture</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>45 mins • HD</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveVideoModal(item.topic)}
                      style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#4f46e5', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Watch
                    </button>
                  </div>

                  {/* Reading Notes PDF Tile */}
                  <div style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FileText style={{ width: '24px', height: '24px', color: '#0284c7' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>Lecture Notes</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>PDF • 2.4 MB</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActivePdfModal(item.topic)}
                      style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      View
                    </button>
                  </div>

                  {/* Quiz Action Tile */}
                  <div style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <HelpCircle style={{ width: '24px', height: '24px', color: '#f59e0b' }} />
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>Weekly Quiz</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>5 Questions</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setActiveTab('quizzes')}
                      style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: 'none', backgroundColor: '#f59e0b', color: '#ffffff', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}
                    >
                      Take Quiz
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Video Modal */}
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

      {/* PDF Modal */}
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
