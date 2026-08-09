import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export function QuizBuilder() {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(15);
  const [questions, setQuestions] = useState([
    {
      question: 'Which activation function avoids vanishing gradients in Deep Learning?',
      options: ['Sigmoid', 'ReLU', 'Softmax', 'Tanh'],
      correct: 1
    }
  ]);

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: '',
        options: ['', '', '', ''],
        correct: 0
      }
    ]);
  };

  const handlePublishQuiz = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const quizData = {
      title,
      duration: Number(duration),
      questions
    };

    api.createQuiz(quizData).catch(() => {});

    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    alert(`Quiz "${title}" published to student portal!`);
    setTitle('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Interactive MCQ Quiz Builder
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Formulate test question banks, assign option choices, and set practice timers.
        </p>
      </div>

      <form onSubmit={handlePublishQuiz} className="ls-card animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Quiz Title</label>
            <input type="text" required placeholder="e.g. Quiz 3: Convolutional Operations" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Duration (Minutes)</label>
            <input type="number" required value={duration} onChange={(e) => setDuration(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>
        </div>

        {/* Questions Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Question Bank Items ({questions.length})</h3>
          <button type="button" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={handleAddQuestion}>
            <Plus style={{ width: '14px', height: '14px' }} /> Add Question
          </button>
        </div>

        {/* Question Cards */}
        {questions.map((q, qIdx) => (
          <div key={qIdx} style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#3730a3' }}>Question #{qIdx + 1}</div>
            <input type="text" required placeholder="Enter Question text..." value={q.question} onChange={(e) => {
              const updated = [...questions];
              updated[qIdx].question = e.target.value;
              setQuestions(updated);
            }} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }} />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
              {q.options.map((opt, optIdx) => (
                <div key={optIdx} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="radio" name={`correct-${qIdx}`} checked={q.correct === optIdx} onChange={() => {
                    const updated = [...questions];
                    updated[qIdx].correct = optIdx;
                    setQuestions(updated);
                  }} />
                  <input type="text" required placeholder={`Option ${String.fromCharCode(65 + optIdx)}`} value={opt} onChange={(e) => {
                    const updated = [...questions];
                    updated[qIdx].options[optIdx] = e.target.value;
                    setQuestions(updated);
                  }} style={{ flex: 1, padding: '0.45rem 0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }} />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
          <button type="submit" className="btn-primary">
            <Send style={{ width: '16px', height: '16px' }} /> Publish Quiz
          </button>
        </div>
      </form>
    </div>
  );
}
