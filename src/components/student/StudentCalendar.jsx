import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Tag, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export function StudentCalendar() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const events = [
    { date: 'Aug 10', title: 'CNN PyTorch Assignment Deadline', time: '11:59 PM', category: 'Assignment', color: '#ef4444' },
    { date: 'Aug 12', title: 'Live Faculty Q&A: Deep Learning', time: '2:00 PM - 3:30 PM', category: 'Session', color: '#4f46e5' },
    { date: 'Aug 15', title: 'LearnSphere National AI Hackathon', time: 'All Day', category: 'Hackathon', color: '#f59e0b' },
    { date: 'Aug 18', title: 'React 18 & Next.js Mid-Term Exam', time: '10:00 AM - 12:00 PM', category: 'Exam', color: '#7c3aed' },
    { date: 'Aug 22', title: 'AWS Cloud Architecture Lab Submission', time: '5:00 PM', category: 'Assignment', color: '#0ea5e9' }
  ];

  const filteredEvents = events.filter(e => selectedCategory === 'All' || e.category === selectedCategory);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Academic Calendar & Events
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Schedule of assignment deadlines, live faculty sessions, exams, and national hackathons.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['All', 'Assignment', 'Session', 'Exam', 'Hackathon'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: selectedCategory === cat ? '#4f46e5' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Month View Mock */}
        <div className="ls-card animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>August 2026</h3>
            <div style={{ display: 'flex', gap: '4px' }}>
              <button className="btn-secondary" style={{ padding: '0.35rem' }}><ChevronLeft style={{ width: '16px', height: '16px' }} /></button>
              <button className="btn-secondary" style={{ padding: '0.35rem' }}><ChevronRight style={{ width: '16px', height: '16px' }} /></button>
            </div>
          </div>

          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 700, fontSize: '0.75rem', color: '#64748b', marginBottom: '0.5rem' }}>
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          {/* Calendar Grid Days */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', textAlign: 'center' }}>
            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const hasEvent = [10, 12, 15, 18, 22].includes(dayNum);
              return (
                <div key={dayNum} style={{
                  padding: '0.6rem 0.2rem',
                  borderRadius: '8px',
                  backgroundColor: dayNum === 6 ? '#4f46e5' : (hasEvent ? '#e0e7ff' : '#f8fafc'),
                  color: dayNum === 6 ? '#ffffff' : (hasEvent ? '#3730a3' : '#334155'),
                  fontWeight: hasEvent || dayNum === 6 ? 800 : 500,
                  fontSize: '0.85rem',
                  position: 'relative'
                }}>
                  {dayNum}
                  {hasEvent && <span style={{ position: 'absolute', bottom: '3px', left: '50%', transform: 'translateX(-50%)', width: '4px', height: '4px', backgroundColor: '#f97316', borderRadius: '50%' }} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming Events List */}
        <div className="ls-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Upcoming Academic Events
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredEvents.map((evt, idx) => (
              <div key={idx} style={{
                padding: '1rem',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                borderLeft: `4px solid ${evt.color}`,
                border: '1px solid #e2e8f0',
                borderLeftWidth: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: evt.color }}>{evt.category.toUpperCase()}</span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{evt.date}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>
                  {evt.title}
                </div>
                <div style={{ fontSize: '0.775rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock style={{ width: '12px', height: '12px' }} /> {evt.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
