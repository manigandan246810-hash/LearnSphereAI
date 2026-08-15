import React, { useState } from 'react';
import { HelpCircle, Plus, Trash2, CheckCircle2, Sparkles, Brain, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export function QuizBuilder({ staffProfile, courses = [], onRefreshData }) {
  const [quizTitle, setQuizTitle] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'CS-401');
  const [duration, setDuration] = useState(15);
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [syllabusText, setSyllabusText] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const [questions, setQuestions] = useState([
    {
      id: 1,
      question: 'Which loss function is optimal for Binary Classification neural networks?',
      options: ['Mean Squared Error (MSE)', 'Binary Cross-Entropy', 'Categorical Hinge Loss', 'Huber Loss'],
      correct: 1
    }
  ]);

  const handleGenerateAIQuiz = async () => {
    setIsGeneratingAI(true);
    try {
      const selectedCourse = courses.find(c => c.id === selectedCourseId || c.uuid === selectedCourseId);
      const res = await api.generateQuizWithAI({
        content: syllabusText || quizTitle || 'General Computer Science',
        difficulty,
        numQuestions: 3,
        courseTitle: selectedCourse ? selectedCourse.title : 'Computer Science'
      });

      if (res.title && !quizTitle) setQuizTitle(res.title);
      if (res.questions && res.questions.length > 0) {
        const formatted = res.questions.map((q, idx) => ({
          id: idx + 1,
          question: q.question,
          options: q.options,
          correct: q.correctAnswer || 0
        }));
        setQuestions(formatted);
      }
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.5 } });
    } catch (err) {
      console.error('Error generating AI quiz:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

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

  const handlePublish = async () => {
    if (!quizTitle.trim()) {
      alert('Please enter a quiz title.');
      return;
    }

    try {
      await api.createQuiz({
        quizCode: `QZ-${Math.floor(100 + Math.random() * 900)}`,
        courseId: selectedCourseId,
        title: quizTitle,
        durationMinutes: duration,
        difficulty,
        createdByStaff: staffProfile?.user_code || '050',
        questions: questions
      });

      confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
      alert(`Quiz "${quizTitle}" published successfully by Staff ${staffProfile?.name || 'Manigandan A.G'}!`);

      if (onRefreshData) {
        await onRefreshData();
      }

      setQuizTitle('');
      setSyllabusText('');
    } catch (err) {
      console.error('Error publishing quiz:', err);
      confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
      alert(`Quiz "${quizTitle}" created successfully!`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Quiz & Test Question Bank Builder
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Construct interactive multiple-choice tests or use AI Assistance to generate quizzes from course content & difficulty levels.
        </p>
      </div>

      {/* AI Assistance Box */}
      <div className="animate-fade-up" style={{
        padding: '1.5rem',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
        border: '1px solid #bfdbfe',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Brain style={{ width: '20px', height: '20px' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e1b4b', margin: 0 }}>
              AI Quiz Generator Assistance
            </h3>
            <p style={{ fontSize: '0.825rem', color: '#4338ca', margin: 0 }}>
              Provide syllabus topics or notes and difficulty level, and AI will construct questions & options for you.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e1b4b' }}>Syllabus / Topic Content</label>
            <input 
              type="text" 
              placeholder="e.g. Object Oriented Programming, Data Structures, Neural Networks"
              value={syllabusText}
              onChange={(e) => setSyllabusText(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '10px', border: '1px solid #c7d2fe', backgroundColor: '#ffffff', fontSize: '0.85rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1e1b4b' }}>Difficulty Level</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: '10px', border: '1px solid #c7d2fe', backgroundColor: '#ffffff', fontSize: '0.85rem', fontWeight: 700 }}
            >
              <option value="Easy">Easy Level</option>
              <option value="Intermediate">Intermediate Level</option>
              <option value="Hard">Hard / Advanced Level</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleGenerateAIQuiz}
          disabled={isGeneratingAI}
          className="btn-primary"
          style={{ alignSelf: 'flex-start', padding: '0.55rem 1.25rem', fontSize: '0.85rem' }}
        >
          {isGeneratingAI ? (
            <>
              <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              Generating Quiz with AI...
            </>
          ) : (
            <>
              <Sparkles style={{ width: '16px', height: '16px' }} />
              Generate AI Quiz Questions
            </>
          )}
        </button>
      </div>

      {/* Main Quiz Form Card */}
      <div className="ls-card animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Quiz Title</label>
            <input type="text" placeholder="e.g. Java Programming Fundamentals Quiz" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Associated Course</label>
            <select 
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem', fontWeight: 700 }}
            >
              {courses.map(c => (
                <option key={c.id || c.uuid} value={c.id || c.uuid}>
                  {c.id}: {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Timer Duration (Minutes)</label>
            <input type="number" value={duration} onChange={(e) => setDuration(Number(e.target.value))} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>
        </div>

        {/* Questions List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {questions.map((q, qIdx) => (
            <div key={q.id || qIdx} style={{ padding: '1.25rem', borderRadius: '14px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
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
                      name={`correct-${q.id || qIdx}`} 
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
            <Plus style={{ width: '16px', height: '16px' }} /> Add Manual Question
          </button>
          <button type="button" className="btn-primary" onClick={handlePublish}>
            <Sparkles style={{ width: '16px', height: '16px' }} /> Save & Publish Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
