import React from 'react';
import { 
  Briefcase, 
  Users, 
  BookOpen, 
  CheckSquare, 
  Award, 
  Clock, 
  TrendingUp, 
  Plus, 
  Sparkles,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { MOCK_STAFF_STUDENTS } from '../../data/mockData';

export function StaffDashboard({ profile, setActiveTab }) {
  const staffStats = [
    { title: 'Total Enrolled Students', value: '340 Students', sub: 'Across 3 AI Courses', icon: Users, color: '#7c3aed', bg: '#f3e8ff' },
    { title: 'Active Courses', value: '4 Courses', sub: 'Spring Semester 2026', icon: BookOpen, color: '#2563eb', bg: '#dbeafe' },
    { title: 'Pending Submissions', value: '12 Submissions', sub: 'Requires Grading', icon: CheckSquare, color: '#f59e0b', bg: '#fef3c7' },
    { title: 'Average Class Score', value: '88.4%', sub: '+3.1% this month', icon: Award, color: '#10b981', bg: '#d1fae5' }
  ];

  const todaySchedule = [
    { time: '10:00 AM - 11:30 AM', subject: 'Artificial Intelligence & Neural Networks', room: 'Lab 402 / Online Stream', type: 'Lecture & Lab' },
    { time: '02:00 PM - 03:30 PM', subject: 'Deep Learning Faculty Q&A Office Hours', room: 'Faculty Office B-12', type: 'Office Hours' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Faculty Hero Banner */}
      <div className="animate-fade-up" style={{
        background: 'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #6d28d9 100%)',
        borderRadius: '24px',
        padding: '2.25rem',
        color: '#ffffff',
        boxShadow: '0 12px 30px -4px rgba(67, 56, 202, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#d8b4fe'
            }}>
              {profile.title}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#e9d5ff' }}>• {profile.department}</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Welcome, {profile.name}! 🎓
          </h1>

          <p style={{ color: '#e9d5ff', fontSize: '0.95rem', maxWidth: '600px' }}>
            You have <strong>12 student assignment submissions</strong> waiting for your evaluation.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-accent" onClick={() => setActiveTab('assignment-builder')}>
            <Plus style={{ width: '18px', height: '18px' }} /> Create Assignment
          </button>
          <button className="btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }} onClick={() => setActiveTab('evaluation-desk')}>
            <CheckSquare style={{ width: '18px', height: '18px' }} /> Grade Desk (12)
          </button>
        </div>
      </div>

      {/* Faculty Statistics Grid */}
      <div className="grid-responsive">
        {staffStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="ls-card ls-card-hover animate-fade-up" style={{ animationDelay: `${idx * 0.06}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>{stat.title}</span>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', backgroundColor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: '20px', height: '20px', color: stat.color }} />
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                {stat.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule & Pending Queue Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Today's Schedule */}
        <div className="ls-card animate-fade-up">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Today's Faculty Schedule
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {todaySchedule.map((s, i) => (
              <div key={i} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid #7c3aed' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#7c3aed', marginBottom: '3px' }}>{s.time}</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '2px' }}>{s.subject}</div>
                <div style={{ fontSize: '0.775rem', color: '#64748b' }}>📍 {s.room}</div>
              </div>
            ))}
          </div>
        </div>

        {/* At-Risk / Top Students Quick View */}
        <div className="ls-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Student Performance Flags</h3>
            <button style={{ border: 'none', background: 'none', color: '#7c3aed', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => setActiveTab('student-management')}>
              View Roster →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {MOCK_STAFF_STUDENTS.map((st) => (
              <div key={st.id} style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a' }}>{st.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Avg Score: {st.avgScore} • Attendance: {st.attendance}</div>
                </div>
                <span className={`chip ${st.status === 'Top Performer' ? 'chip-emerald' : (st.status === 'Needs Attention' ? 'chip-rose' : 'chip-sky')}`}>
                  {st.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
