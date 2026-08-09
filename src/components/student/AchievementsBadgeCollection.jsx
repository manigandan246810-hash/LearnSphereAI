import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Lock, 
  Sparkles, 
  Flame, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  Zap, 
  Brain,
  Code
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_ACHIEVEMENTS } from '../../data/mockData';
import { api } from '../../services/api';

export function AchievementsBadgeCollection() {
  const [achievements, setAchievements] = useState(MOCK_ACHIEVEMENTS);

  useEffect(() => {
    let isMounted = true;
    api.getAchievements()
      .then(res => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          setAchievements(res);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, []);

  const simulateUnlock = (id) => {
    confetti({ particleCount: 150, spread: 85, origin: { y: 0.5 } });

    setAchievements(achievements.map(a => 
      a.id === id ? { ...a, unlocked: true, date: 'Just Unlocked!' } : a
    ));

    api.unlockAchievement(id, 'STU-88219').catch(() => {});
  };

  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header Banner */}
      <div className="ls-card animate-fade-up" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        padding: '2rem'
      }}>
        <div>
          <span className="chip chip-amber" style={{ marginBottom: '0.75rem' }}>
            Gamification Trophy Room
          </span>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
            Badges & Mastery Collection
          </h1>
          <p style={{ color: '#a5b4fc', fontSize: '0.9rem', maxWidth: '600px' }}>
            Unlock achievements by maintaining learning streaks, completing lab assignments, and scoring 100% on weekly AI quizzes.
          </p>
        </div>

        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '1.25rem 2rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Unlocked Badges</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fbbf24' }}>
            {unlockedCount} / {achievements.length}
          </div>
        </div>
      </div>

      {/* Badge Cards Grid */}
      <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {achievements.map((badge, idx) => (
          <div 
            key={badge.id}
            className="ls-card ls-card-hover animate-fade-up"
            style={{
              animationDelay: `${idx * 0.06}s`,
              borderColor: badge.unlocked ? '#a7f3d0' : '#e2e8f0',
              opacity: badge.unlocked ? 1 : 0.75,
              display: 'flex',
              flexDirection: 'column',
              justify: 'space-between',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {badge.unlocked && (
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                backgroundColor: '#10b981',
                color: '#ffffff',
                padding: '4px 12px 4px 16px',
                borderRadius: '0 0 0 16px',
                fontSize: '0.7rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <CheckCircle2 style={{ width: '12px', height: '12px' }} /> UNLOCKED
              </div>
            )}

            <div>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '20px',
                backgroundColor: badge.unlocked ? '#ecfdf5' : '#f1f5f9',
                color: badge.unlocked ? '#059669' : '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                marginBottom: '1rem',
                boxShadow: badge.unlocked ? '0 8px 20px rgba(16, 185, 129, 0.2)' : 'none'
              }}>
                {badge.icon}
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                {badge.title}
              </h3>

              <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.4, marginBottom: '1rem' }}>
                {badge.desc}
              </p>
            </div>

            <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                {badge.unlocked ? `Unlocked: ${badge.date}` : badge.requirement}
              </span>

              {!badge.unlocked && (
                <button 
                  onClick={() => simulateUnlock(badge.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    color: '#4f46e5',
                    cursor: 'pointer'
                  }}
                >
                  Simulate Unlock
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
