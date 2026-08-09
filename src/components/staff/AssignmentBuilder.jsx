import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2, Sparkles, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

export function AssignmentBuilder() {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [instructions, setInstructions] = useState('');
  const [rubrics, setRubrics] = useState([
    { criteria: 'Model Architecture & Core Setup', points: 40 },
    { criteria: 'Validation Metrics & Training Accuracy', points: 40 },
    { criteria: 'Code Quality & Documentation', points: 20 }
  ]);

  const addRubricRow = () => {
    setRubrics([...rubrics, { criteria: '', points: 10 }]);
  };

  const removeRubricRow = (idx) => {
    setRubrics(rubrics.filter((_, i) => i !== idx));
  };

  const handlePublish = (e) => {
    e.preventDefault();
    confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
    alert(`Assignment "${title || 'Untitled'}" published to Student Portals!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Assignment Builder & Rubric Creator
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Design structured assignments, specify submission formats, set deadlines, and build automated rubric evaluation matrices.
        </p>
      </div>

      <form onSubmit={handlePublish} className="ls-card animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Assignment Title</label>
            <input type="text" required placeholder="e.g. Fine-Tuning Llama-3 with LoRA Adapters" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Due Date & Time</label>
            <input type="datetime-local" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Maximum Marks</label>
            <input type="number" value={maxMarks} onChange={(e) => setMaxMarks(Number(e.target.value))} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Submission Instructions</label>
          <textarea rows={3} placeholder="Explain expectations, datasets to use, required output format (.ipynb / .pdf)..." value={instructions} onChange={(e) => setInstructions(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
        </div>

        {/* Rubrics Builder */}
        <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#3730a3' }}>Grading Rubric Matrix</h4>
            <button type="button" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={addRubricRow}>
              <Plus style={{ width: '14px', height: '14px' }} /> Add Criterion Row
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {rubrics.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input type="text" placeholder="Criterion description..." value={r.criteria} onChange={(e) => {
                  const copy = [...rubrics]; copy[i].criteria = e.target.value; setRubrics(copy);
                }} style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />

                <input type="number" placeholder="Points" value={r.points} onChange={(e) => {
                  const copy = [...rubrics]; copy[i].points = Number(e.target.value); setRubrics(copy);
                }} style={{ width: '90px', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />

                <button type="button" onClick={() => removeRubricRow(i)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="submit" className="btn-accent">
            <Sparkles style={{ width: '18px', height: '18px' }} /> Broadcast & Publish Assignment
          </button>
        </div>
      </form>
    </div>
  );
}
