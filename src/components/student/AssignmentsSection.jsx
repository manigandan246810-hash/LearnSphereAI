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
  FileCheck,
  ChevronDown,
  ChevronUp,
  History,
  MessageSquare,
  Paperclip,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export function AssignmentsSection({ assignments = [], setAssignments, studentProfile, onRefreshData }) {
  const [activeTabFilter, setActiveTabFilter] = useState('all');
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submittedFile, setSubmittedFile] = useState(null);
  const [expandedAttempts, setExpandedAttempts] = useState({}); // { [assignmentId]: boolean }
  const [attemptsHistory, setAttemptsHistory] = useState({}); // { [assignmentId]: [attempts] }

  const filteredAssignments = assignments.filter(a => {
    if (activeTabFilter === 'pending') return a.status !== 'completed' && a.status !== 'accepted';
    if (activeTabFilter === 'completed') return a.status === 'completed' || a.status === 'accepted';
    return true;
  });

  const getStatusBadgeStyle = (status) => {
    const s = (status || '').toLowerCase();
    let bg = '#e2e8f0';
    let color = '#475569';
    if (s === 'accepted' || s === 'completed') {
      bg = '#e6f4ea';
      color = '#137333';
    } else if (s === 'rejected' || s === 'needs resubmission') {
      bg = '#fce8e6';
      color = '#c5221f';
    } else if (s === 'submitted' || s === 'resubmitted' || s === 'pending') {
      bg = '#fff0e1';
      color = '#b06000';
    } else if (s === 'under review') {
      bg = '#e8f0fe';
      color = '#1a73e8';
    }
    return {
      backgroundColor: bg,
      color: color,
      padding: '4px 10px',
      borderRadius: '9999px',
      fontSize: '0.7rem',
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.03em',
      display: 'inline-block'
    };
  };

  const handleToggleHistory = async (assignmentId) => {
    const code = studentProfile?.id || 'STU-88219';
    if (expandedAttempts[assignmentId]) {
      setExpandedAttempts({ ...expandedAttempts, [assignmentId]: false });
    } else {
      try {
        const history = await api.getAssignmentHistory(assignmentId, code);
        setAttemptsHistory(prev => ({ ...prev, [assignmentId]: history }));
        setExpandedAttempts(prev => ({ ...prev, [assignmentId]: true }));
      } catch (err) {
        console.error("Error fetching assignment history:", err);
      }
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file) => {
    if (!file) return;
    setSubmittedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      rawFile: file
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleSubmitAssignment = async () => {
    if (!selectedAssignment) return;

    if (!submittedFile) {
      alert("Please select or drag-and-drop your solution file before submitting.");
      return;
    }

    try {
      const code = studentProfile?.id || 'STU-88219';
      const fileNameStr = typeof submittedFile === 'string' ? submittedFile : submittedFile.name;

      await api.submitAssignment(
        selectedAssignment.id,
        code,
        fileNameStr
      );

      // Synchronously update local assignments state
      if (setAssignments) {
        setAssignments(prev => prev.map(asn => {
          if (asn.id === selectedAssignment.id) {
            return {
              ...asn,
              status: 'submitted',
              fileName: fileNameStr,
              submittedAt: new Date().toISOString()
            };
          }
          return asn;
        }));
      }

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      alert(`🎉 Assignment "${selectedAssignment.title}" submitted successfully with file: ${fileNameStr}`);

      setShowSubmitModal(false);
      setSelectedAssignment(null);
      setSubmittedFile(null);

      // Refresh overall course and assignment statuses
      if (onRefreshData) {
        await onRefreshData();
      }

      // Automatically refresh attempts history list
      const history = await api.getAssignmentHistory(selectedAssignment.id, code);
      setAttemptsHistory(prev => ({ ...prev, [selectedAssignment.id]: history }));
      setExpandedAttempts(prev => ({ ...prev, [selectedAssignment.id]: true }));
    } catch (err) {
      console.error("Error submitting assignment:", err);
      alert("Failed to submit assignment: " + err.message);
    }
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
          const isCompleted = assignment.status === 'completed' || assignment.status === 'accepted';
          const isHistoryExpanded = !!expandedAttempts[assignment.id];
          const historyList = attemptsHistory[assignment.id] || [];

          return (
            <div 
              key={assignment.id} 
              className="ls-card animate-fade-up"
              style={{
                animationDelay: `${idx * 0.08}s`,
                borderColor: isCompleted ? '#a7f3d0' : '#e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1.25rem'
              }}
            >
              {/* Main Details Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '4px', flexWrap: 'wrap' }}>
                      <span style={getStatusBadgeStyle(assignment.status)}>
                        {assignment.status}
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
                    {assignment.attachedFile && (
                      <div style={{
                        marginTop: '8px',
                        padding: '6px 12px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '8px',
                        border: '1px solid #bfdbfe',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        flexWrap: 'wrap'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.775rem', color: '#1e40af', fontWeight: 700 }}>
                          <Paperclip style={{ width: '14px', height: '14px', color: '#2563eb' }} />
                          <span>Reference Attachment: <strong>{assignment.attachedFile.name}</strong> ({assignment.attachedFile.size})</span>
                        </div>
                        {assignment.attachedFile.dataUrl && (
                          <a 
                            href={assignment.attachedFile.dataUrl} 
                            download={assignment.attachedFile.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: '0.7rem',
                              fontWeight: 800,
                              color: '#ffffff',
                              backgroundColor: '#2563eb',
                              padding: '3px 8px',
                              borderRadius: '6px',
                              textDecoration: 'none',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Download style={{ width: '12px', height: '12px' }} /> Download File
                          </a>
                        )}
                      </div>
                    )}
                    {assignment.fileName && (
                      <div style={{ fontSize: '0.775rem', color: '#4f46e5', fontWeight: 600, marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <FileCheck style={{ width: '14px', height: '14px' }} /> Submitted File: <span style={{ textDecoration: 'underline' }}>{assignment.fileName}</span>
                      </div>
                    )}
                    {assignment.feedback && (
                      <div style={{ fontSize: '0.775rem', color: '#c5221f', fontWeight: 600, marginTop: '6px', backgroundColor: '#fce8e6', padding: '6px 10px', borderRadius: '6px', borderLeft: '3px solid #ea4335' }}>
                        <strong>Faculty Feedback:</strong> "{assignment.feedback}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Status / Grade & Submission Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {assignment.earnedMarks !== null ? (
                    <div style={{ textAlign: 'right', marginRight: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Grade Earned</div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#059669' }}>
                        {assignment.earnedMarks} / {assignment.maxMarks}
                      </div>
                    </div>
                  ) : assignment.status === 'submitted' || assignment.status === 'resubmitted' || assignment.status === 'under review' ? (
                    <div style={{ textAlign: 'right', marginRight: '0.5rem' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Status</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1a73e8' }}>
                        Under Review
                      </div>
                    </div>
                  ) : null}

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {assignment.status === 'accepted' ? (
                      <span style={{ fontSize: '0.8rem', color: '#137333', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 style={{ width: '16px', height: '16px' }} /> Accepted
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowSubmitModal(true);
                        }}
                        className={assignment.status === 'rejected' || assignment.status === 'needs resubmission' ? "btn-accent" : "btn-primary"}
                        style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                      >
                        <UploadCloud style={{ width: '16px', height: '16px' }} />
                        {assignment.status === 'rejected' || assignment.status === 'needs resubmission' ? 'Resubmit Solution' : 'Submit Work'}
                      </button>
                    )}

                    <button
                      onClick={() => handleToggleHistory(assignment.id)}
                      className="btn-secondary"
                      style={{ padding: '0.5rem 0.75rem', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem' }}
                    >
                      <History style={{ width: '15px', height: '15px' }} />
                      {isHistoryExpanded ? <ChevronUp style={{ width: '14px', height: '14px' }} /> : <ChevronDown style={{ width: '14px', height: '14px' }} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expandable Attempts History & Grade Reviews */}
              {isHistoryExpanded && (
                <div style={{
                  marginTop: '0.75rem',
                  paddingTop: '1rem',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem'
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <History style={{ width: '16px', height: '16px', color: '#4f46e5' }} />
                    Submission & Attempt History
                  </div>

                  {historyList.length === 0 ? (
                    <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '0.8rem', color: '#64748b', textAlign: 'center' }}>
                      No attempts recorded yet.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {historyList.map((att, idx) => (
                        <div 
                          key={idx} 
                          style={{
                            padding: '1rem',
                            backgroundColor: '#f8fafc',
                            borderRadius: '12px',
                            border: '1px solid #cbd5e1',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                          }}
                        >
                          {/* Attempt Header */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: '24px',
                                height: '24px',
                                borderRadius: '50%',
                                backgroundColor: '#4f46e5',
                                color: '#ffffff',
                                fontSize: '0.75rem',
                                fontWeight: 800
                              }}>
                                {att.attempt}
                              </span>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                                Solution File: <span style={{ color: '#4f46e5', textDecoration: 'underline' }}>{att.fileName}</span>
                              </span>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                              Submitted: {new Date(att.submittedAt).toLocaleString()}
                            </div>
                          </div>

                          {/* Grade Review Details */}
                          <div style={{
                            padding: '0.75rem',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.35rem'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                                <Award style={{ width: '15px', height: '15px', color: '#10b981' }} />
                                Score: {att.earnedMarks !== null ? `${att.earnedMarks} / ${assignment.maxMarks}` : 'Awaiting Grading'}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                Evaluated By: <strong>{att.gradedBy || 'Faculty'}</strong>
                              </div>
                            </div>

                            {att.feedback && (
                              <div style={{
                                display: 'flex',
                                gap: '6px',
                                fontSize: '0.8rem',
                                color: '#475569',
                                borderTop: '1px dashed #e2e8f0',
                                paddingTop: '4px',
                                marginTop: '4px'
                              }}>
                                <MessageSquare style={{ width: '14px', height: '14px', color: '#4f46e5', marginTop: '2px', flexShrink: 0 }} />
                                <div>
                                  <strong>Faculty Feedback:</strong> "{att.feedback}"
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filteredAssignments.length === 0 && (
          <div className="animate-fade-up" style={{
            padding: '3.5rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px dashed #cbd5e1'
          }}>
            <FileText style={{ width: '48px', height: '48px', color: '#94a3b8', margin: '0 auto 1rem auto', display: 'block' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              No assessments available for this course.
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto' }}>
              Staff has not posted any assignments or assessments for this course yet.
            </p>
          </div>
        )}
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
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
                  Select or Drag & Drop Solution File
                </label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('assignment-file-input').click()}
                  style={{
                    border: `2px dashed ${isDragging ? '#2563eb' : '#818cf8'}`,
                    borderRadius: '16px',
                    padding: '1.75rem 1.25rem',
                    textAlign: 'center',
                    backgroundColor: isDragging ? '#eff6ff' : '#f5f3ff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    position: 'relative'
                  }}
                >
                  <input 
                    id="assignment-file-input"
                    type="file"
                    accept=".ipynb,.py,.zip,.rar,.pdf,.docx,.txt"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileSelect(e.target.files[0]);
                      }
                    }}
                  />

                  {submittedFile ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #c7d2fe', maxWidth: '450px', margin: '0 auto' }}>
                      <FileCheck style={{ width: '22px', height: '22px', color: '#4f46e5' }} />
                      <div style={{ textAlign: 'left', flex: 1 }}>
                        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {typeof submittedFile === 'string' ? submittedFile : submittedFile.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                          {typeof submittedFile === 'object' ? `${submittedFile.size} • ` : ''}Ready for submission
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSubmittedFile(null);
                        }}
                        style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                      >
                        <X style={{ width: '18px', height: '18px' }} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <UploadCloud style={{ width: '42px', height: '42px', color: '#4f46e5' }} />
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                        Click to select solution file or drag & drop here
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Supports .ipynb, .py, .zip, .rar, .pdf, .docx (Max: 50MB)
                      </div>
                    </div>
                  )}
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
