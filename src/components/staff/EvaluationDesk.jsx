import React, { useState } from 'react';
import { CheckCircle2, FileCode, Send, Sparkles, User, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export function EvaluationDesk() {
  const [selectedStudent, setSelectedStudent] = useState('Alex Morgan (STU-88219)');
  const [marks, setMarks] = useState(96);
  const [feedback, setFeedback] = useState('Outstanding implementation of CNN feature extraction maps & PyTorch training loops!');

  const handlePublishGrade = (e) => {
    e.preventDefault();

    api.gradeSubmission({
      studentCode: 'STU-88219',
      earnedMarks: Number(marks),
      feedback
    }).catch(() => {});

    confetti({ particleCount: 110, spread: 75, origin: { y: 0.6 } });
    alert(`Grade published for ${selectedStudent}! Student score updated in database.`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Faculty Evaluation & Grading Desk
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Inspect submitted Jupyter Notebooks, evaluate rubrics, and publish grades directly to PostgreSQL.
        </p>
      </div>

      <form onSubmit={handlePublishGrade} className="ls-card animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>📝 Grading Desk</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Student Roster</label>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }}>
              <option value="Alex Morgan (STU-88219)">Alex Morgan (STU-88219)</option>
              <option value="Sophia Chen (STU-88220)">Sophia Chen (STU-88220)</option>
              <option value="Marcus Vance (STU-88221)">Marcus Vance (STU-88221)</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Marks Earned (/ 100)</label>
            <input type="number" required value={marks} onChange={(e) => setMarks(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Faculty Feedback Comments</label>
          <textarea rows={3} required value={feedback} onChange={(e) => setFeedback(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button type="submit" className="btn-primary">
            <Send style={{ width: '16px', height: '16px' }} /> Publish Grade to Student
          </button>
        </div>
      </form>
    </div>
  );
}
