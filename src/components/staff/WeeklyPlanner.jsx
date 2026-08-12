import React, { useState } from 'react';
import { Clock, Plus, Upload, Link, Check, Sparkles, FileText, Video } from 'lucide-react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

export function WeeklyPlanner({ courses = [], onRefreshData }) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || courses[0]?.uuid || '');
  const [weekNumber, setWeekNumber] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [notesPdfUrl, setNotesPdfUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedCourse = courses.find(c => c.id === selectedCourseId || c.uuid === selectedCourseId) || courses[0];
  const weeks = selectedCourse?.weeklyTimeline || [];

  const handleAddWeek = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      alert("Please select a course catalog entry.");
      return;
    }
    if (!weekNumber) {
      alert("Please specify the syllabus week number.");
      return;
    }
    if (!newTopic.trim()) {
      alert("Please input a valid lecture topic title.");
      return;
    }

    setLoading(true);
    try {
      // Find course uuid
      const targetCourse = courses.find(c => c.id === selectedCourseId || c.uuid === selectedCourseId);
      const targetCourseId = targetCourse ? (targetCourse.uuid || targetCourse.id) : selectedCourseId;

      await api.publishWeeklySyllabus(
        targetCourseId,
        Number(weekNumber),
        newTopic,
        videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
        notesPdfUrl || 'https://storage.learnsphere.edu/syllabus/notes.pdf'
      );

      // Trigger Confetti!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      alert(`✨ Week ${weekNumber} Curriculum published successfully!`);

      // Clear input states
      setWeekNumber('');
      setNewTopic('');
      setVideoUrl('');
      setNotesPdfUrl('');

      // Refresh local page context
      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (err) {
      console.error("Error publishing syllabus:", err);
      alert("Failed to publish syllabus: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Weekly Syllabus & Content Planner
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Structure topics, upload video lecture URLs, attach reading PDFs, and publish weekly modules.
          </p>
        </div>

        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          style={{ 
            padding: '0.6rem 1rem', 
            borderRadius: '12px', 
            border: '1px solid #cbd5e1', 
            backgroundColor: '#ffffff', 
            fontWeight: 700, 
            fontSize: '0.875rem', 
            color: '#4f46e5',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {courses.map(c => (
            <option key={c.id || c.uuid} value={c.id || c.uuid}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Add New Week Module Builder */}
      <div className="ls-card animate-fade-up">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles style={{ width: '18px', height: '18px', color: '#4f46e5' }} />
          Publish Syllabus Week & Lecture Assets
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Syllabus Week Number</label>
            <input 
              type="number" 
              placeholder="e.g. 6" 
              value={weekNumber} 
              onChange={(e) => setWeekNumber(e.target.value)} 
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem', outline: 'none' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Topic / Lesson Title</label>
            <input 
              type="text" 
              placeholder="e.g. Deep Residual Learning (ResNets)" 
              value={newTopic} 
              onChange={(e) => setNewTopic(e.target.value)} 
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem', outline: 'none' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Video Lecture Link (YouTube/MP4)</label>
            <input 
              type="text" 
              placeholder="https://youtube.com/watch?v=..." 
              value={videoUrl} 
              onChange={(e) => setVideoUrl(e.target.value)} 
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem', outline: 'none' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Lecture Notes PDF URL</label>
            <input 
              type="text" 
              placeholder="https://storage.edu/notes.pdf" 
              value={notesPdfUrl} 
              onChange={(e) => setNotesPdfUrl(e.target.value)} 
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem', outline: 'none' }} 
            />
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleAddWeek}
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Plus style={{ width: '16px', height: '16px' }} /> 
          {loading ? 'Publishing Syllabus Assets...' : 'Publish Weekly Module Details'}
        </button>
      </div>

      {/* Current Weekly Curriculum List */}
      <div className="ls-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock style={{ width: '18px', height: '18px', color: '#64748b' }} />
          Active Curriculum Schedule for Selected Course ({weeks.length} Weeks)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {weeks.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.9rem' }}>
              No syllabus weeks published for this course yet.
            </div>
          ) : (
            weeks.map((item) => (
              <div 
                key={item.week} 
                style={{ 
                  padding: '1rem 1.25rem', 
                  borderRadius: '12px', 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #cbd5e1', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  flexWrap: 'wrap', 
                  gap: '1rem' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="chip chip-indigo" style={{ fontWeight: 800, padding: '0.35rem 0.75rem', borderRadius: '8px' }}>
                    Week {item.week}
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.975rem', color: '#0f172a' }}>{item.topic}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '0.75rem', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Video style={{ width: '13px', height: '13px' }} /> Video Link Attached</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><FileText style={{ width: '13px', height: '13px' }} /> Lecture Slides (PDF)</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`chip ${item.status === 'completed' ? 'chip-emerald' : 'chip-sky'}`}>
                    {item.status || 'Active'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
