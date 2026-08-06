import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  LineChart, 
  Line 
} from 'recharts';
import { BarChart3, TrendingUp, Clock, Zap, Calendar, Sparkles } from 'lucide-react';

const WEEKLY_HOURS_DATA = [
  { day: 'Mon', hours: 4.5, target: 4 },
  { day: 'Tue', hours: 6.0, target: 4 },
  { day: 'Wed', hours: 5.2, target: 4 },
  { day: 'Thu', hours: 3.8, target: 4 },
  { day: 'Fri', hours: 7.1, target: 4 },
  { day: 'Sat', hours: 8.4, target: 4 },
  { day: 'Sun', hours: 3.5, target: 4 }
];

const XP_GROWTH_DATA = [
  { week: 'W1', xp: 8200 },
  { week: 'W2', xp: 9800 },
  { week: 'W3', xp: 11400 },
  { week: 'W4', xp: 13200 },
  { week: 'W5', xp: 14850 }
];

export function AnalyticsDashboard() {
  // Generate mock GitHub-style heatmap data for the past 60 days
  const heatmapDays = Array.from({ length: 60 }, (_, i) => ({
    day: i + 1,
    level: Math.floor(Math.random() * 5) // 0 to 4 intensity level
  }));

  const getHeatmapColor = (level) => {
    switch (level) {
      case 1: return '#c7d2fe';
      case 2: return '#818cf8';
      case 3: return '#4f46e5';
      case 4: return '#312e81';
      default: return '#e2e8f0';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Learning Analytics & Performance Heatmap
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Detailed visualization of your study velocity, quiz accuracy, XP growth, and daily streak.
        </p>
      </div>

      {/* Top 2 Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Weekly Hours Bar Chart */}
        <div className="ls-card animate-fade-up">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Weekly Study Hours</h3>
              <span style={{ fontSize: '0.775rem', color: '#64748b' }}>Target: 28 hrs/week • Actual: 38.5 hrs</span>
            </div>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
              <Clock style={{ width: '18px', height: '18px' }} />
            </div>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={WEEKLY_HOURS_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="hours" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* XP Growth Area Chart */}
        <div className="ls-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>XP Velocity Curve</h3>
              <span style={{ fontSize: '0.775rem', color: '#059669', fontWeight: 700 }}>+1,650 XP gained this week</span>
            </div>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#ffedd5', color: '#f97316' }}>
              <Zap style={{ width: '18px', height: '18px' }} />
            </div>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={XP_GROWTH_DATA}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="xp" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#xpGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* GitHub-Style Learning Heatmap Calendar */}
      <div className="ls-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>60-Day Learning Commitment Heatmap</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Every block represents lectures watched, code written, or quizzes completed.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Less</span>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '3px' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: '#c7d2fe', borderRadius: '3px' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: '#818cf8', borderRadius: '3px' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: '#4f46e5', borderRadius: '3px' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: '#312e81', borderRadius: '3px' }} />
            <span>More</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(20, 1fr)', gap: '6px', paddingTop: '0.5rem' }}>
          {heatmapDays.map((d) => (
            <div 
              key={d.day}
              title={`Day ${d.day}: ${d.level * 2} learning sessions`}
              style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '4px',
                backgroundColor: getHeatmapColor(d.level),
                cursor: 'pointer',
                transition: 'transform 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
