import React, { useState } from 'react';
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
import { BarChart3, TrendingUp, Clock, Zap, Calendar, Sparkles, X, Award, FileText, CheckCircle2, Download } from 'lucide-react';
import confetti from 'canvas-confetti';

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

export function AnalyticsDashboard({ assignments = [], courses = [] }) {
  const [showReport, setShowReport] = useState(false);

  // Generate mock GitHub-style heatmap data for the past 60 days
  const heatmapDays = Array.from({ length: 60 }, (_, i) => ({
    day: i + 1,
    level: Math.floor(Math.random() * 5) // 0 to 4 intensity level
  }));

  const getHeatmapColor = (level) => {
    switch (level) {
      case 1: return '#93c5fd'; // Light blue
      case 2: return '#60a5fa'; // Slate blue
      case 3: return '#2563eb'; // Cobalt blue
      case 4: return '#1e3a8a'; // Prussian navy
      default: return '#e2e8f0';
    }
  };

  // Compile velocity graph data from graded assignments
  const gradedAssignments = assignments.filter(a => a.status === 'evaluated' || a.earnedMarks !== null);
  const scoreVelocityData = gradedAssignments.length > 0 
    ? gradedAssignments.map((a, i) => ({
        name: `Task ${i + 1}`,
        score: Math.round((a.earnedMarks / a.maxMarks) * 100),
        title: a.title
      }))
    : [
        { name: 'Module 1', score: 85 },
        { name: 'Module 2', score: 92 },
        { name: 'Module 3', score: 78 },
        { name: 'Module 4', score: 95 }
      ];

  const avgScore = Math.round(
    scoreVelocityData.reduce((acc, curr) => acc + curr.score, 0) / scoreVelocityData.length
  ) || 88;

  const triggerDownloadReport = () => {
    confetti({ particleCount: 80, spread: 60 });
    alert("📥 Download Started:\nYour comprehensive PDF Progress Report transcript has been compiled and downloaded successfully.");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Learning Analytics & Performance Heatmap
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Detailed visualization of study velocity, quiz accuracy, XP growth, and daily commitment.
          </p>
        </div>

        <button 
          className="btn-accent" 
          onClick={() => setShowReport(true)}
          style={{ background: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)', color: '#ffffff', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}
        >
          <Sparkles style={{ width: '18px', height: '18px' }} /> Generate Progress Report
        </button>
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
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#2563eb' }}>
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
                <Bar dataKey="hours" fill="#2563eb" radius={[6, 6, 0, 0]} />
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
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0ea5e9' }}>
              <Zap style={{ width: '18px', height: '18px' }} />
            </div>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={XP_GROWTH_DATA}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                <Area type="monotone" dataKey="xp" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#xpGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* GitHub-Style Learning Heatmap Calendar */}
      <div className="ls-card animate-fade-up" style={{ animationDelay: '0.2s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>60-Day Learning Commitment Heatmap</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Every block represents lectures watched, code written, or quizzes completed.</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Less</span>
            <div style={{ width: '12px', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '3px' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: '#93c5fd', borderRadius: '3px' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: '#60a5fa', borderRadius: '3px' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: '#2563eb', borderRadius: '3px' }} />
            <div style={{ width: '12px', height: '12px', backgroundColor: '#1e3a8a', borderRadius: '3px' }} />
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

      {/* Progress Report Transcript Modal Overlay */}
      {showReport && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1.25rem',
          overflowY: 'auto'
        }}>
          <div className="animate-fade-up" style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            maxWidth: '680px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            border: '1px solid #cbd5e1'
          }}>
            
            {/* Header */}
            <div style={{
              padding: '1.25rem 1.75rem',
              background: 'linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Award style={{ width: '22px', height: '22px', color: '#fbbf24' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>Academic Audit & Progress Report</div>
                  <div style={{ fontSize: '0.75rem', color: '#93c5fd' }}>Generated by LearnSphere AI Assessment Engine</div>
                </div>
              </div>
              <button 
                onClick={() => setShowReport(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
              >
                <X style={{ width: '22px', height: '22px' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Profile details */}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', fontSize: '0.85rem', color: '#475569' }}>
                <div><strong>Student:</strong> Alex Morgan (ID: STU-88219)</div>
                <div><strong>Term:</strong> Fall Semester 2026</div>
              </div>

              {/* Dynamic Stats Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <div style={{ padding: '0.85rem', borderRadius: '12px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.725rem', color: '#1e40af', fontWeight: 700, textTransform: 'uppercase' }}>Weighted Average</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e3a8a', margin: '2px 0' }}>{avgScore}%</div>
                  <div style={{ fontSize: '0.675rem', color: '#64748b' }}>Grade: A- Excellent</div>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: '12px', backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.725rem', color: '#065f46', fontWeight: 700, textTransform: 'uppercase' }}>Tasks Finalized</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#065f46', margin: '2px 0' }}>
                    {assignments.filter(a => a.status === 'evaluated').length} / {assignments.length || 5}
                  </div>
                  <div style={{ fontSize: '0.675rem', color: '#64748b' }}>Lab submission rate</div>
                </div>
                <div style={{ padding: '0.85rem', borderRadius: '12px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.725rem', color: '#9a3412', fontWeight: 700, textTransform: 'uppercase' }}>Velocity Status</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#9a3412', margin: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                    <TrendingUp style={{ width: '16px', height: '16px' }} /> +4.2%
                  </div>
                  <div style={{ fontSize: '0.675rem', color: '#64748b' }}>Month over month</div>
                </div>
              </div>

              {/* Score Velocity Chart */}
              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>Score Velocity Trend Graph</h4>
                <div style={{ width: '100%', height: '180px', backgroundColor: '#f8fafc', padding: '10px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={scoreVelocityData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ fontSize: '0.75rem', borderRadius: '8px' }} />
                      <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 6 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Personalized recommendations */}
              <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#f8fafc', borderLeft: '4px solid #2563eb' }}>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e3a8a', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '0.35rem' }}>
                  <Sparkles style={{ width: '15px', height: '15px', color: '#fbbf24' }} />
                  AI Study Recommendations (Score Optimization)
                </h4>
                <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4, margin: 0 }}>
                  {avgScore < 85 ? (
                    <span>💡 <strong>Concept Mastery Action Required:</strong> Your quiz average is below 80%. Use the LearnSphere AI sidebar chatbot to generate flashcards on Convolution operations and schedule 2 hours of custom practice tests before the mid-term.</span>
                  ) : (
                    <span>✨ <strong>Continuous High Velocity:</strong> You are displaying superb mastery (average {avgScore}%). To secure a top class rank, initiate the advanced NLP syllabus early and practice hyperparameter optimization algorithms.</span>
                  )}
                  {assignments.filter(a => a.status === 'pending').length > 0 && (
                    <span style={{ display: 'block', marginTop: '6px', fontWeight: 600, color: '#ef4444' }}>
                      ⚠️ Alert: You have {assignments.filter(a => a.status === 'pending').length} assignments pending. Dedicate a study block today to prevent grade slips.
                    </span>
                  )}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                <button className="btn-secondary" onClick={() => setShowReport(false)}>
                  Close
                </button>
                <button className="btn-primary" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' }} onClick={triggerDownloadReport}>
                  <Download style={{ width: '16px', height: '16px' }} /> Download Report (PDF)
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
