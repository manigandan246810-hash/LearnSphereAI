import React, { useState, useEffect } from 'react';
import { Megaphone, Plus, Pin, Trash2, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';
import { api } from '../../services/api';

export function AnnouncementsCenter() {
  const [announcements, setAnnouncements] = useState(MOCK_ANNOUNCEMENTS);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Academic');
  const [content, setContent] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  useEffect(() => {
    let isMounted = true;
    api.getAnnouncements()
      .then(res => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          setAnnouncements(res);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newAnno = {
      title,
      category,
      content,
      isPinned,
      authorCode: 'FAC-1042'
    };

    api.createAnnouncement(newAnno)
      .then(created => {
        setAnnouncements([created, ...announcements]);
      })
      .catch(() => {
        setAnnouncements([{
          id: Date.now(),
          title,
          author: "Dr. Evelyn Vance",
          date: "Just Now",
          pinned: isPinned,
          category,
          text: content
        }, ...announcements]);
      });

    setTitle('');
    setContent('');
    confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Announcements & Broadcast Desk
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Broadcast department notices, webinar invitations, and exam alerts to all enrolled students.
        </p>
      </div>

      {/* Broadcast Form */}
      <form onSubmit={handleCreateAnnouncement} className="ls-card animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>📢 Create New Broadcast Announcement</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Headline Title</label>
            <input type="text" required placeholder="e.g. Schedule Change for Deep Learning Lecture" value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }}>
              <option value="Academic">Academic</option>
              <option value="Event">Event</option>
              <option value="Webinar">Webinar</option>
              <option value="Exam">Exam Alert</option>
            </select>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Message Content</label>
          <textarea rows={3} required placeholder="Detail the announcement particulars..." value={content} onChange={(e) => setContent(e.target.value)} style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600, color: '#475569' }}>
            <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} />
            Pin to top of student dashboard feed
          </label>

          <button type="submit" className="btn-primary">
            <Send style={{ width: '16px', height: '16px' }} /> Broadcast Now
          </button>
        </div>
      </form>

      {/* Broadcast History */}
      <div className="ls-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>Active Broadcast Feed</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {announcements.map((a) => (
            <div key={a.id} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: a.pinned ? '#f5f3ff' : '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span className={`chip ${a.pinned ? 'chip-indigo' : 'chip-sky'}`}>{a.category}</span>
                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{a.date}</span>
              </div>
              <h4 style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '4px' }}>{a.title}</h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.4 }}>{a.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
