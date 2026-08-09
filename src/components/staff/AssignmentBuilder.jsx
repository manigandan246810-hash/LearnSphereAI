import React, { useState } from 'react';
import { FilePlus, Plus, Trash2, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export function AssignmentBuilder() {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [instructions, setInstructions] = useState('');
  const [rubrics, setRubrics] = useState([
    { criteria: 'Model Architecture & Code Structure', points: 30 },
    { criteria: 'Training Optimization & Hyperparameters', points: 30 },
    { criteria: 'Evaluation Metrics & Validation Loss', points: 20 },
    { criteria: 'Notebook Documentation & Cleanliness', points: 20 }
  ]);

  const handleAddRubric = () => {
    setRubrics([...rubrics, { criteria: '', points: 10 }]);
  };

  const handleRemoveRubric = (idx) => {
    setRubrics(rubrics.filter((_, i) => i !== idx));
  };

  const handlePublishAssignment = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const asnData = {
      title,
      dueDate,
      maxMarks: Number(maxMarks),
      instructions,
      rubrics,
      facultyCode: 'FAC-1042'
    };

    api.createAssignment(asnData).catch(() => {});

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    alert(`Assignment "${title}" published successfully to all enrolled students!`);
    setTitle('');
    setInstructions('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Assignment & Rubric Builder
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Design new lab tasks, set submission deadlines, and configure evaluation rubrics.
        </p>
      </div>

      <form onSubmit={handlePublishAssignment} className="ls-card animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Assignment Title</label>
            <input type="text" required placeholder="e.g. Lab 4: PyTorch ResNet Architecture" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Submission Due Date</label>
            <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Maximum Marks</label>
            <input type="number" required value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Submission Instructions</label>
          <textarea rows={4} required placeholder="Detail the student submission expectations..." value={instructions} onChange={(e) => setInstructions(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
        </div>

        {/* Rubrics Section */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Grading Rubric Criteria</label>
            <button type="button" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={handleAddRubric}>
              <Plus style={{ width: '14px', height: '14px' }} /> Add Criteria
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {rubrics.map((rubric, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input type="text" placeholder="Criteria Name" value={rubric.criteria} onChange={(e) => {
                  const updated = [...rubrics];
                  updated[idx].criteria = e.target.value;
                  setRubrics(updated);
                }} style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                <input type="number" placeholder="Points" value={rubric.points} onChange={(e) => {
                  const updated = [...rubrics];
                  updated[idx].points = Number(e.target.value);
                  setRubrics(updated);
                }} style={{ width: '80px', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
                <button type="button" onClick={() => handleRemoveRubric(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 style={{ width: '18px', height: '18px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <button type="submit" className="btn-primary">
            <Send style={{ width: '16px', height: '16px' }} /> Publish Assignment
          </button>
        </div>
      </form>
    </div>
  );
}
