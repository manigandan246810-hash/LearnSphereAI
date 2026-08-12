import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Send, 
  Award,
  AlertTriangle,
  FileCheck,
  User,
  History,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export function EvaluationDesk() {
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [givenScore, setGivenScore] = useState(90);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('accepted'); // 'accepted' or 'rejected'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const fetchSubmissions = async () => {
    try {
      const data = await api.getSubmissions();
      setSubmissions(data);
      if (data.length > 0 && !selectedSubmission) {
        // Find first pending or default to first
        const pending = data.find(s => s.status === 'pending' || s.status === 'submitted' || s.status === 'resubmitted' || s.status === 'under review') || data[0];
        setSelectedSubmission(pending);
        setGivenScore(pending.earnedMarks !== null ? pending.earnedMarks : pending.maxMarks || 100);
        setFeedback(pending.feedback || '');
        setStatus(pending.status === 'rejected' ? 'rejected' : 'accepted');
      }
    } catch (err) {
      console.error("Error loading submissions:", err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSelectSubmission = (sub) => {
    setSelectedSubmission(sub);
    setGivenScore(sub.earnedMarks !== null ? sub.earnedMarks : sub.maxMarks || 100);
    setFeedback(sub.feedback || '');
    setStatus(sub.status === 'rejected' ? 'rejected' : 'accepted');
    setMessage('');
  };

  const handlePublishGrade = async () => {
    if (!selectedSubmission) return;

    if (givenScore < 0 || givenScore > selectedSubmission.maxMarks) {
      alert(`Score must be between 0 and ${selectedSubmission.maxMarks}.`);
      return;
    }

    setIsSubmitting(true);
    setMessage('');
    try {
      await api.gradeSubmission({
        submissionId: selectedSubmission.submissionId,
        earnedMarks: givenScore,
        feedback: feedback || "Your submission has been evaluated by faculty.",
        status: status // 'accepted' or 'rejected'
      });

      if (status === 'accepted') {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 } });
      }

      setMessage(`Grade published successfully for ${selectedSubmission.studentName}!`);
      
      // Refresh list
      const updatedData = await api.getSubmissions();
      setSubmissions(updatedData);

      // Find the updated version of current selected submission
      const updatedCurrent = updatedData.find(s => s.submissionId === selectedSubmission.submissionId);
      if (updatedCurrent) {
        setSelectedSubmission(updatedCurrent);
      }
    } catch (err) {
      console.error("Error publishing grade:", err);
      setMessage("Failed to publish grade. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper to style badge statuses
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
      padding: '4px 8px',
      borderRadius: '9999px',
      fontSize: '0.675rem',
      fontWeight: 800,
      textTransform: 'uppercase'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Faculty Evaluation & Grading Desk
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Review student lab notebooks, award scores, and approve or reject submissions with history tracking.
        </p>
      </div>

      {message && (
        <div style={{
          padding: '1rem',
          borderRadius: '12px',
          backgroundColor: message.includes('failed') ? '#fef2f2' : '#ecfdf5',
          border: message.includes('failed') ? '1px solid #fca5a5' : '1px solid #a7f3d0',
          color: message.includes('failed') ? '#991b1b' : '#065f46',
          fontWeight: 700,
          fontSize: '0.9rem'
        }}>
          {message}
        </div>
      )}

      {/* Main Grid: Left sidebar (submissions list), Right Pane (active grading) */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left pane: submissions sidebar list */}
        <div className="ls-card" style={{ display: 'flex', flexDirection: 'column', padding: '1rem', maxHeight: '75vh', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', marginBottom: '0.75rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
            📥 Student Submissions ({submissions.length})
          </h3>
          
          {submissions.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
              No submissions found in database.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {submissions.map((sub) => {
                const isSelected = selectedSubmission?.submissionId === sub.submissionId;
                return (
                  <button
                    key={sub.submissionId}
                    onClick={() => handleSelectSubmission(sub)}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem',
                      borderRadius: '12px',
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#eff6ff' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub.studentName}</span>
                      <span style={getStatusBadgeStyle(sub.status)}>{sub.status}</span>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: '#475569', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {sub.assignmentTitle}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#64748b', marginTop: '2px' }}>
                      <span>Attempt #{sub.attempt}</span>
                      <span>{new Date(sub.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right pane: Submission details & grading */}
        {selectedSubmission ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
            
            {/* Student Code/Submission Viewer */}
            <div className="ls-card" style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Student: <strong>{selectedSubmission.studentName} ({selectedSubmission.studentCode})</strong></div>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>{selectedSubmission.fileName}</div>
                  </div>
                  <span className="chip chip-sky">Attempt {selectedSubmission.attempt}</span>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '4px' }}>Assignment:</div>
                  <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#60a5fa' }}>{selectedSubmission.assignmentTitle}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>Course: {selectedSubmission.courseName}</div>
                </div>

                <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', padding: '1rem', border: '1px solid #334155' }}>
                  <div style={{ fontSize: '0.775rem', color: '#38bdf8', fontWeight: 800, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <FileCheck style={{ width: '16px', height: '16px' }} /> Submitted Notebook Code Mock
                  </div>
                  <pre style={{
                    fontFamily: 'monospace',
                    fontSize: '0.775rem',
                    lineHeight: 1.5,
                    color: '#e2e8f0',
                    overflowX: 'auto',
                    margin: 0,
                    maxHeight: '260px'
                  }}>
{`# Solution Notebook for ${selectedSubmission.assignmentTitle}
# Submitted by ${selectedSubmission.studentName} (Attempt #${selectedSubmission.attempt})

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load dataset and prepare features
print("Initializing preprocessing pipeline...")
data = pd.read_csv("cifar10_data.csv")
X = data.drop("label", axis=1).values
y = data["label"].values

# Model evaluation metrics
accuracy = 0.942
print(f"Evaluation Complete. Accuracy: {accuracy * 100:.2f}%")`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Rubric Evaluation & Grade Action Form */}
            <div className="ls-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Rubric Evaluation</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                    <Sparkles style={{ width: '14px', height: '14px' }} /> Rubric Active
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                    <span>• Maximum Possible Marks</span>
                    <strong style={{ color: '#1e1b4b' }}>{selectedSubmission.maxMarks} Marks</strong>
                  </div>
                  {selectedSubmission.status !== 'pending' && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#475569', backgroundColor: '#f0fdf4', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                      <span>✓ Current Grade Status</span>
                      <strong style={{ color: '#15803d' }}>{selectedSubmission.status.toUpperCase()} ({selectedSubmission.earnedMarks || 0} marks)</strong>
                    </div>
                  )}
                </div>

                {/* Score Input */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                    Award Marks (Max: {selectedSubmission.maxMarks})
                  </label>
                  <input
                    type="number"
                    value={givenScore}
                    max={selectedSubmission.maxMarks}
                    min={0}
                    onChange={(e) => setGivenScore(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '1rem',
                      fontWeight: 800,
                      color: '#2563eb'
                    }}
                  />
                </div>

                {/* Feedback Input */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '4px' }}>
                    Faculty Evaluation Feedback
                  </label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter detailed evaluation report, correctness feedback, and improvement notes..."
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.85rem',
                      lineHeight: 1.4
                    }}
                  />
                </div>

                {/* Accept vs Reject Status Selection */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a', display: 'block', marginBottom: '6px' }}>
                    Grading Action
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setStatus('accepted')}
                      style={{
                        flex: 1,
                        padding: '0.6rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        border: status === 'accepted' ? '2px solid #16a34a' : '1px solid #cbd5e1',
                        backgroundColor: status === 'accepted' ? '#f0fdf4' : '#ffffff',
                        color: status === 'accepted' ? '#15803d' : '#475569',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <CheckCircle2 style={{ width: '16px', height: '16px' }} />
                      Accept Attempt
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('rejected')}
                      style={{
                        flex: 1,
                        padding: '0.6rem',
                        borderRadius: '10px',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        border: status === 'rejected' ? '2px solid #dc2626' : '1px solid #cbd5e1',
                        backgroundColor: status === 'rejected' ? '#fef2f2' : '#ffffff',
                        color: status === 'rejected' ? '#b91c1c' : '#475569',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <XCircle style={{ width: '16px', height: '16px' }} />
                      Reject & Resubmit
                    </button>
                  </div>
                </div>
              </div>

              {/* Publish Button */}
              <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  className="btn-primary"
                  onClick={handlePublishGrade}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: status === 'accepted' ? '#2563eb' : '#dc2626',
                    borderColor: status === 'accepted' ? '#2563eb' : '#dc2626'
                  }}
                >
                  <Send style={{ width: '16px', height: '16px' }} />
                  {isSubmitting ? 'Publishing Grade...' : 'Publish Evaluation Grade'}
                </button>
              </div>
            </div>
            
          </div>
        ) : (
          <div className="ls-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            Please select a student submission from the sidebar list to view its code and evaluate it.
          </div>
        )}
      </div>
    </div>
  );
}
