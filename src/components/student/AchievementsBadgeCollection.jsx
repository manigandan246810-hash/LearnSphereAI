import React, { useState } from 'react';
import { Award, Lock, Sparkles, Trophy, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_ACHIEVEMENTS } from '../../data/mockData';

export function AchievementsBadgeCollection() {
  const [achievements, setAchievements] = useState(MOCK_ACHIEVEMENTS);

  const simulateUnlock = (id) => {
    confetti({ particleCount: 100, spread: 60, origin: { y: 0.6 } });
    setAchievements(achievements.map(a => 
      a.id === id ? { ...a, unlocked: true, date: "Unlocked Just Now!" } : a
    ));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Achievements & Badge Showcase
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Unlock milestone badges as you complete courses, maintain learning streaks, and score high on quizzes.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid-responsive">
        {achievements.map((badge, idx) => (
          <div 
            key={badge.id}
            className="ls-card animate-fade-up"
            style={{
              animationDelay: `${idx * 0.06}s`,
              borderColor: badge.unlocked ? '#a7f3d0' : '#e2e8f0',
              backgroundColor: badge.unlocked ? '#ffffff' : '#f8fafc',
              opacity: badge.unlocked ? 1 : 0.85,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{
                  fontSize: '2.25rem',
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  backgroundColor: badge.unlocked ? '#fef3c7' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: badge.unlocked ? '0 4px 12px rgba(245, 158, 11, 0.25)' : 'none'
                }}>
                  {badge.icon}
                </div>

                <span className={`chip ${badge.unlocked ? 'chip-emerald' : 'chip-amber'}`}>
                  {badge.unlocked ? 'Unlocked' : 'Locked'}
                </span>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                {badge.title}
              </h3>

              <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.45, marginBottom: '1rem' }}>
                {badge.desc}
              </p>
            </div>

            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.775rem', color: '#64748b' }}>
              {badge.unlocked ? (
                <span style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle2 style={{ width: '14px', height: '14px' }} /> {badge.date}
                </span>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock style={{ width: '13px', height: '13px' }} /> {badge.requirement}
                  </span>
                  <button 
                    onClick={() => simulateUnlock(badge.id)}
                    style={{ fontSize: '0.7rem', fontWeight: 700, color: '#4f46e5', border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    Test Unlock
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
