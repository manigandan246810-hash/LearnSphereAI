import React, { useState } from 'react';
import { CheckSquare, Sparkles, CheckCircle2, FileText, Send, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

export function EvaluationDesk() {
  const [givenScore, setGivenScore] = useState(96);
  const [feedback, setFeedback] = useState("Excellent PyTorch CNN implementation! Clean modular layers and comprehensive loss graphs.");
  const [published, setPublished] = useState(false);

  const handlePublishGrade = () => {
    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
    setPublished(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Faculty Evaluation & Grading Desk
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Review student code & lab submissions with AI-assisted rubric criteria suggestions.
        </p>
      </div>

      {/* Dual Pane Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Left Pane: Student Submission Code Viewer */}
        <div className="ls-card animate-fade-up" style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #334155', paddingBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Submission by: Alex Morgan (STU-88219)</div>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: '#ffffff' }}>CNN_PyTorch_Model.ipynb</div>
            </div>
            <span className="chip chip-indigo">CIFAR-10 Model</span>
          </div>

          <pre style={{
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            lineHeight: 1.5,
            color: '#a5b4fc',
            overflowX: 'auto',
            maxHeight: '340px'
          }}>
{`import torch
import torch.nn as nn

class ConvNet(nn.Module):
    def __init__(self):
        super(ConvNet, self).__init__()
        self.conv1 = nn.Conv2d(3, 32, kernel_size=3, padding=1)
        self.relu = nn.ReLU()
        self.pool = nn.MaxPool2d(2, 2)
        self.fc1 = nn.Linear(32 * 16 * 16, 10)

    def forward(self, x):
        x = self.pool(self.relu(self.conv1(x)))
        x = x.view(-1, 32 * 16 * 16)
        return self.fc1(x)

# Training Accuracy: 94.2% (Passed criteria!)`}
          </pre>
        </div>

        {/* Right Pane: AI Rubric & Grade Editor */}
        <div className="ls-card animate-fade-up" style={{ animationDelay: '0.1s', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Rubric Evaluation</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#e0e7ff', color: '#3730a3', padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 700 }}>
                <Sparkles style={{ width: '14px', height: '14px' }} /> AI Suggested Score: 95/100
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#475569', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                <span>✓ Model Setup & Layers</span>
                <strong style={{ color: '#059669' }}>30/30 pts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#475569', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                <span>✓ Training Loop & Optimizer</span>
                <strong style={{ color: '#059669' }}>28/30 pts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#475569', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                <span>✓ Metrics & Visualizations</span>
                <strong style={{ color: '#059669' }}>20/20 pts</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', color: '#475569', backgroundColor: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                <span>✓ Code Quality & Comments</span>
                <strong style={{ color: '#059669' }}>18/20 pts</strong>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>Final Grade Marks</label>
              <input type="number" value={givenScore} onChange={(e) => setGivenScore(Number(e.target.value))} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '1rem', fontWeight: 800, color: '#4f46e5' }} />
            </div>

            <div style={{ marginTop: '0.85rem' }}>
              <label style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>Faculty Feedback Comments</label>
              <textarea rows={3} value={feedback} onChange={(e) => setFeedback(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.85rem' }} />
            </div>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '0.85rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn-primary" onClick={handlePublishGrade} disabled={published}>
              <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              {published ? 'Grade Published! ✅' : 'Publish Grade to Student'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
