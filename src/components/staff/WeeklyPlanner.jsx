import React, { useState } from 'react';
import { Clock, Plus, Upload, Link, Check, Sparkles, FileText, Video } from 'lucide-react';
import { MOCK_COURSES } from '../../data/mockData';

export function WeeklyPlanner() {
  const [selectedCourse, setSelectedCourse] = useState(MOCK_COURSES[0]);
  const [weeks, setWeeks] = useState(selectedCourse.weeklyTimeline);
  const [newTopic, setNewTopic] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleAddWeek = () => {
    if (!newTopic.trim()) return;
    const nextWeekNum = weeks.length + 1;
    const newEntry = {
      week: nextWeekNum,
      topic: newTopic,
      status: 'upcoming',
      videoUrl: videoUrl || '#',
      notesPdf: '#',
      quizScore: 'Locked'
    };
    setWeeks([...weeks, newEntry]);
    setNewTopic('');
    setVideoUrl('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Weekly Syllabus & Content Planner
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Structure topics, upload video lecture URLs, attach reading PDFs, and publish weekly modules.
          </p>
        </div>

        <select
          value={selectedCourse.id}
          onChange={(e) => {
            const c = MOCK_COURSES.find(c => c.id === e.target.value);
            setSelectedCourse(c);
            setWeeks(c.weeklyTimeline || []);
          }}
          style={{ padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontWeight: 700, fontSize: '0.875rem', color: '#7c3aed' }}
        >
          {MOCK_COURSES.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {/* Add New Week Module Builder */}
      <div className="ls-card animate-fade-up">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          ➕ Add New Week Topic & Resource Module
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Topic Title</label>
            <input type="text" placeholder="e.g. Generative Adversarial Networks (GANs)" value={newTopic} onChange={(e) => setNewTopic(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Video Lecture Link (YouTube/MP4)</label>
            <input type="text" placeholder="https://youtube.com/watch?v=..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>
        </div>

        <button className="btn-primary" onClick={handleAddWeek}>
          <Plus style={{ width: '16px', height: '16px' }} /> Append Week {weeks.length + 1} Module
        </button>
      </div>

      {/* Current Weekly Curriculum List */}
      <div className="ls-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Active Curriculum Schedule ({weeks.length} Weeks)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {weeks.map((item) => (
            <div key={item.week} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="chip chip-indigo" style={{ fontWeight: 800 }}>Week {item.week}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>{item.topic}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '1rem', marginTop: '2px' }}>
                    <span>📹 Video Attached</span>
                    <span>📄 Lecture Notes PDF</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}>Edit Resources</button>
                <span className={`chip ${item.status === 'completed' ? 'chip-emerald' : 'chip-sky'}`}>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
