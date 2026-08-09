import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Tag
} from 'lucide-react';
import { MOCK_CALENDAR_EVENTS } from '../../data/mockData';
import { api } from '../../services/api';

export function StudentCalendar() {
  const [events, setEvents] = useState(MOCK_CALENDAR_EVENTS);

  useEffect(() => {
    let isMounted = true;
    api.getEvents()
      .then(res => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          setEvents(res);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Academic Calendar & Schedule
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Never miss an exam, assignment deadline, or guest AI symposium lecture.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="chip chip-indigo">August 2026</span>
        </div>
      </div>

      {/* Events List */}
      <div className="grid-responsive">
        {events.map((evt, idx) => (
          <div 
            key={evt.id || idx}
            className="ls-card ls-card-hover animate-fade-up"
            style={{
              animationDelay: `${idx * 0.08}s`,
              borderLeft: `5px solid ${evt.color || '#4f46e5'}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: evt.color || '#4f46e5' }}>
                {evt.date}
              </span>
              <span className="chip chip-sky">{evt.category}</span>
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              {evt.title}
            </h3>

            <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.4, marginBottom: '1rem' }}>
              {evt.description}
            </p>

            <div style={{ fontSize: '0.775rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
              <Clock style={{ width: '14px', height: '14px' }} /> {evt.time}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
