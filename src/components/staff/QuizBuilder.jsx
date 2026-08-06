import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, CheckCircle2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export function QuizBuilder() {
  const [quizTitle, setQuizTitle] = useState('');
  const [duration, setDuration] = useState(15);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'Which loss function is optimal for Binary Classification neural networks?',
      options: ['Mean Squared Error (MSE)', 'Binary Cross-Entropy', 'Categorical Hinge Loss', 'Huber Loss'],
      correct: 1
    }
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: questions.length + 1,
        question: '',
        options: ['', '', '', ''],
        correct: 0
      }
    ]);
  };

  const handlePublish = () => {
    confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
    alert(`Quiz "${quizTitle || 'New Quiz'}" published!`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Quiz & Test Question Bank Builder
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Construct interactive multiple-choice tests, set timers, and enable automated AI grading.
        </p>
      </div>

      <div className="ls-card animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Quiz Title</label>
            <input type="text" placeholder="e.g. Convolutional Filters & Stride Mechanics" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Timer Duration (Minutes)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>
        </div>

        {/* Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {questions.map((q, qIdx) => (
            <div key={q.id} style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#3730a3', marginBottom: '0.75rem' }}>
                Question #{qIdx + 1}
              </div>

              <input 
                type="text" 
                placeholder="Enter question text..." 
                value={q.question} 
                onChange={(e) => {
                  const copy = [...questions]; copy[qIdx].question = e.target.value; setQuestions(copy);
                }} 
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '0.85rem', fontSize: '0.875rem' }} 
              />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="radio" 
                      name={`correct-${q.id}`} 
                      checked={q.correct === optIdx} 
                      onChange={() => {
                        const copy = [...questions]; copy[qIdx].correct = optIdx; setQuestions(copy);
                      }} 
                    />
                    <input 
                      type="text" 
                      placeholder={`Option ${String.fromCharCode(65 + optIdx)}`} 
                      value={opt} 
                      onChange={(e) => {
                        const copy = [...questions]; copy[qIdx].options[optIdx] = e.target.value; setQuestions(copy);
                      }} 
                      style={{ flex: 1, padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }} 
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <button type="button" className="btn-secondary" onClick={addQuestion}>
            <Plus style={{ width: '16px', height: '16px' }} /> Add Question
          </button>
          <button type="button" className="btn-primary" onClick={handlePublish}>
            <Sparkles style={{ width: '16px', height: '16px' }} /> Save & Publish Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
