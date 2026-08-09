import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Tag, ChevronLeft, ChevronRight, Plus, X, Bell } from 'lucide-react';
import confetti from 'canvas-confetti';

export function StudentCalendar({ reminders = [], setReminders, setActiveNotification }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [dateStr, setDateStr] = useState('Aug 12');
  const [timeStr, setTimeStr] = useState('02:00 PM');
  const [category, setCategory] = useState('Session');
  const [triggerLive, setTriggerLive] = useState(true);

  const filteredEvents = reminders.filter(e => selectedCategory === 'All' || e.category === selectedCategory);

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Assignment': return '#ef4444'; // Red
      case 'Session': return '#2563eb'; // Cobalt blue
      case 'Hackathon': return '#f59e0b'; // Amber
      case 'Exam': return '#0ea5e9'; // Sky blue
      default: return '#64748b'; // Gray
    }
  };

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a title for the reminder.");
      return;
    }

    const color = getCategoryColor(category);
    const newRem = {
      id: Date.now(),
      date: dateStr,
      title: title,
      time: timeStr,
      category: category,
      color: color
    };

    setReminders(prev => [newRem, ...prev]);

    if (triggerLive) {
      // Trigger a real alarm in 4 seconds to demonstrate live notification alerts
      setTimeout(() => {
        setActiveNotification({
          id: Date.now(),
          title: `⏰ Live Reminder Alert: ${category}`,
          text: `Event Starting Now: "${title}" (${timeStr})`,
          color: color
        });
      }, 4000);
      alert("📅 Reminder scheduled! (Since you checked 'Trigger simulated alarm', a live pop-up alert will trigger on your screen in 4 seconds.)");
    } else {
      alert("📅 Reminder successfully saved in your academic agenda calendar.");
    }

    // Reset Form
    setTitle('');
    setShowAddModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Academic Calendar & Daily Reminders
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Schedule and configure alerts for project submission deadlines, quizzes, live faculty Q&As, and study alarms.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button 
            className="btn-primary" 
            onClick={() => setShowAddModal(true)}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <Plus style={{ width: '16px', height: '16px' }} /> Schedule Reminder
          </button>
          
          <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            {['All', 'Assignment', 'Session', 'Exam', 'Hackathon'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: selectedCategory === cat ? '#2563eb' : 'transparent',
                  color: selectedCategory === cat ? '#ffffff' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Layout Grid */}
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
                  backgroundColor: dayNum === 6 ? '#2563eb' : (hasEvent ? '#dbeafe' : '#f8fafc'),
                  color: dayNum === 6 ? '#ffffff' : (hasEvent ? '#1e40af' : '#334155'),
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
            Academic Reminders & Alerts Agenda
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '4px' }}>
            {filteredEvents.length === 0 ? (
              <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b', fontSize: '0.875rem' }}>
                No scheduled reminders matching this filter.
              </div>
            ) : (
              filteredEvents.map((evt) => (
                <div key={evt.id} style={{
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
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add Reminder Modal Overlay */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="animate-fade-up" style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #cbd5e1',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bell style={{ width: '18px', height: '18px', color: '#fbbf24' }} />
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>Schedule Daily Alert</span>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddReminder} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Reminder / Task Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. Revise CNN Backpropagation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Target Date</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. Aug 15"
                    value={dateStr}
                    onChange={(e) => setDateStr(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Alarms Time</label>
                  <input 
                    type="text"
                    required
                    placeholder="e.g. 10:00 AM"
                    value={timeStr}
                    onChange={(e) => setTimeStr(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Event Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.85rem' }}
                >
                  <option value="Session">Live Class / Session</option>
                  <option value="Assignment">Assignment Deadline</option>
                  <option value="Exam">Academic Exam</option>
                  <option value="Hackathon">Coding Hackathon</option>
                </select>
              </div>

              <div style={{ padding: '0.5rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <input 
                  type="checkbox" 
                  id="chkTrigger" 
                  checked={triggerLive} 
                  onChange={(e) => setTriggerLive(e.target.checked)} 
                />
                <label htmlFor="chkTrigger" style={{ fontSize: '0.775rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>
                  Trigger simulated live pop-up alert in 4 seconds
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }}>
                  Save Reminder
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
