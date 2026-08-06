import React, { useState } from 'react';
import { 
  FileText, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  UploadCloud, 
  X, 
  Sparkles, 
  Award,
  ChevronRight,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_ASSIGNMENTS } from '../../data/mockData';

export function AssignmentsSection() {
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [activeTabFilter, setActiveTabFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedFile, setSubmittedFile] = useState(null);

  const filteredAssignments = assignments.filter(a => {
    if (activeTabFilter === 'pending') return a.status === 'pending';
    if (activeTabFilter === 'completed') return a.status === 'completed';
    return true;
  });

  const handleSubmitAssignment = () => {
    if (!selectedAssignment) return;

    // Trigger Confetti Celebration!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Update assignment status to completed
    setAssignments(assignments.map(a => 
      a.id === selectedAssignment.id 
        ? { ...a, status: 'completed', earnedMarks: null, feedback: "Submitted! Pending faculty evaluation." } 
        : a
    ));

    setShowSubmitModal(false);
    setSelectedAssignment(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Assignments & Submissions
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Track upcoming deadlines, submit lab notebooks, and review rubric scores.
          </p>
        </div>

        {/* Tab Filters */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {['all', 'pending', 'completed'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTabFilter(tab)}
              style={{
                padding: '0.4rem 0.9rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: activeTabFilter === tab ? '#4f46e5' : 'transparent',
                color: activeTabFilter === tab ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.825rem',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s ease'
              }}
            >
              {tab === 'all' ? 'All Assignments' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Assignment List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {filteredAssignments.map((assignment, idx) => {
          const isCompleted = assignment.status === 'completed';

          return (
            <div 
              key={assignment.id} 
              className="ls-card animate-fade-up"
              style={{
                animationDelay: `${idx * 0.08}s`,
                borderColor: isCompleted ? '#a7f3d0' : '#e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, minWidth: '300px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  backgroundColor: isCompleted ? '#d1fae5' : '#fef3c7',
                  color: isCompleted ? '#059669' : '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isCompleted ? <CheckCircle2 style={{ width: '28px', height: '28px' }} /> : <FileText style={{ width: '28px', height: '28px' }} />}
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '4px' }}>
                    <span className={`chip ${isCompleted ? 'chip-emerald' : 'chip-amber'}`}>
                      {assignment.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 600 }}>
                      {assignment.courseName}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                    {assignment.title}
                  </h3>

                  <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span>Faculty: <strong>{assignment.faculty}</strong></span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar style={{ width: '14px', height: '14px' }} /> Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status / Grade & Submission Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {isCompleted ? (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Grade Earned</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                      {assignment.earnedMarks !== null ? `${assignment.earnedMarks} / ${assignment.maxMarks}` : 'Grading in Progress'}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setShowSubmitModal(true);
                    }}
                    className="btn-primary"
                  >
                    <UploadCloud style={{ width: '18px', height: '18px' }} />
                    Submit Work
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Submission Modal */}
      {showSubmitModal && selectedAssignment && (
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
            maxWidth: '640px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}>
            <div style={{ padding: '1.25rem 1.75rem', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 700 }}>Submit Assignment</div>
                <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{selectedAssignment.title}</div>
              </div>
              <button onClick={() => setShowSubmitModal(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Instructions */}
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>Instructions</div>
                <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.5 }}>
                  {selectedAssignment.instructions}
                </p>
              </div>

              {/* Rubric Breakdown */}
              {selectedAssignment.rubric && (
                <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#3730a3', marginBottom: '0.5rem' }}>Grading Rubric Criteria</div>
                  {selectedAssignment.rubric.map((r, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', padding: '3px 0' }}>
                      <span>• {r.criteria}</span>
                      <strong style={{ color: '#0f172a' }}>{r.points} pts</strong>
                    </div>
                  ))}
                </div>
              )}

              {/* File Upload Dropzone */}
              <div 
                style={{
                  border: '2px dashed #818cf8',
                  borderRadius: '16px',
                  padding: '2rem',
                  textAlign: 'center',
                  backgroundColor: '#f5f3ff',
                  cursor: 'pointer'
                }}
                onClick={() => setSubmittedFile('CNN_PyTorch_Model_AlexMorgan.ipynb')}
              >
                <UploadCloud style={{ width: '42px', height: '42px', color: '#4f46e5', margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 700, fontSize: '0.925rem', color: '#0f172a' }}>
                  {submittedFile ? `Attached: ${submittedFile}` : 'Click to Upload Solution Notebook (.ipynb / .zip)'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                  Maximum file size: 50MB
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button className="btn-secondary" onClick={() => setShowSubmitModal(false)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={handleSubmitAssignment}>
                  <Sparkles style={{ width: '16px', height: '16px' }} />
                  Submit Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
