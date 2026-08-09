import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Zap, 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Sparkles,
  Users,
  Building2,
  Crown
} from 'lucide-react';
import { MOCK_LEADERBOARD } from '../../data/mockData';

export function Leaderboard({ currentStudentName }) {
  const [filter, setFilter] = useState('Weekly');
  const [department, setDepartment] = useState('All');

  const topThree = MOCK_LEADERBOARD.slice(0, 3);
  const remainingStudents = MOCK_LEADERBOARD.slice(3);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Academic Leaderboard & XP Standings
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Compete with peers, complete quizzes, submit assignments early, and climb the podium ranks!
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#ffffff',
          padding: '4px',
          borderRadius: '12px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
        }}>
          {['Weekly', 'Overall', 'Department', 'Friends'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '0.45rem 1rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: filter === tab ? '#4f46e5' : 'transparent',
                color: filter === tab ? '#ffffff' : '#64748b',
                fontWeight: 700,
                fontSize: '0.825rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Animated Podium for Top 3 Students */}
      <div className="ls-card animate-fade-up" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        borderRadius: '24px',
        padding: '2.5rem 1.5rem',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: '1.5rem',
        minHeight: '340px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Podium Rank #2 (Left) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '180px' }}>
          <img 
            src={topThree[1].avatar} 
            alt={topThree[1].name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid #cbd5e1', marginBottom: '0.5rem', objectFit: 'cover' }}
          />
          <div style={{ fontWeight: 800, fontSize: '0.95rem', textAlign: 'center', color: '#ffffff' }}>
            {topThree[1].name}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#a5b4fc', marginBottom: '0.75rem' }}>
            {topThree[1].xp.toLocaleString()} XP
          </div>
          {/* Podium Pillar */}
          <div style={{
            width: '100%',
            height: '140px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.75rem',
            color: '#cbd5e1',
            borderTop: '2px solid rgba(255,255,255,0.3)'
          }}>
            🥈 2nd
          </div>
        </div>

        {/* Podium Rank #1 (Center - Tallest) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '200px', zIndex: 2 }}>
          <Crown style={{ width: '32px', height: '32px', color: '#fbbf24', marginBottom: '0.25rem' }} />
          <img 
            src={topThree[0].avatar} 
            alt={topThree[0].name}
            style={{ width: '80px', height: '80px', borderRadius: '50%', border: '4px solid #fbbf24', marginBottom: '0.5rem', objectFit: 'cover', boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}
          />
          <div style={{ fontWeight: 800, fontSize: '1.05rem', textAlign: 'center', color: '#ffffff' }}>
            {topThree[0].name}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#fef08a', fontWeight: 700, marginBottom: '0.75rem' }}>
            {topThree[0].xp.toLocaleString()} XP
          </div>
          {/* Podium Pillar */}
          <div style={{
            width: '100%',
            height: '180px',
            background: 'linear-gradient(180deg, rgba(251, 191, 36, 0.3) 0%, rgba(251, 191, 36, 0.08) 100%)',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '2.25rem',
            color: '#fbbf24',
            borderTop: '3px solid #fbbf24'
          }}>
            🥇 1st
          </div>
        </div>

        {/* Podium Rank #3 (Right) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: '180px' }}>
          <img 
            src={topThree[2].avatar} 
            alt={topThree[2].name}
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid #b45309', marginBottom: '0.5rem', objectFit: 'cover' }}
          />
          <div style={{ fontWeight: 800, fontSize: '0.95rem', textAlign: 'center', color: '#ffffff' }}>
            {topThree[2].name}
          </div>
          <div style={{ fontSize: '0.775rem', color: '#a5b4fc', marginBottom: '0.75rem' }}>
            {topThree[2].xp.toLocaleString()} XP
          </div>
          {/* Podium Pillar */}
          <div style={{
            width: '100%',
            height: '110px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.03) 100%)',
            borderRadius: '16px 16px 0 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.5rem',
            color: '#f59e0b',
            borderTop: '2px solid rgba(255,255,255,0.2)'
          }}>
            🥉 3rd
          </div>
        </div>
      </div>

      {/* Roster Table of Ranks 4+ */}
      <div className="ls-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>
          Full Leaderboard Rankings
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.775rem', color: '#64748b', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1.5rem' }}>Rank</th>
                <th style={{ padding: '0.85rem 1.5rem' }}>Student</th>
                <th style={{ padding: '0.85rem 1.5rem' }}>Department</th>
                <th style={{ padding: '0.85rem 1.5rem' }}>Learning Streak</th>
                <th style={{ padding: '0.85rem 1.5rem', textAlign: 'right' }}>Total XP</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADERBOARD.map((s) => {
                const isUser = s.name.includes("You");
                return (
                  <tr 
                    key={s.rank} 
                    style={{
                      borderBottom: '1px solid #f1f5f9',
                      backgroundColor: isUser ? '#e0e7ff' : '#ffffff',
                      fontWeight: isUser ? 700 : 400
                    }}
                  >
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 800, color: s.rank <= 3 ? '#4f46e5' : '#0f172a' }}>
                      #{s.rank}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img src={s.avatar} alt={s.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontWeight: 700, color: '#0f172a' }}>{s.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#475569' }}>
                      {s.department}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className="chip chip-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Flame style={{ width: '14px', height: '14px' }} /> {s.streak} Days
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 800, color: '#4f46e5' }}>
                      {s.xp.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
