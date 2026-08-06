import React from 'react';
import { 
  Sparkles, 
  Flame, 
  Trophy, 
  Zap, 
  BookOpen, 
  FileCheck, 
  HelpCircle, 
  Award, 
  Clock, 
  TrendingUp, 
  ArrowRight,
  PlayCircle,
  Bookmark,
  Star
} from 'lucide-react';
import { MOCK_COURSES, MOCK_ASSIGNMENTS } from '../../data/mockData';

export function StudentDashboard({ profile, setActiveTab, setSelectedCourse }) {
  const statCards = [
    { title: 'Courses Registered', value: '6 Courses', sub: '2 Active this sem', icon: BookOpen, color: '#4f46e5', bg: '#e0e7ff' },
    { title: 'Assignments Pending', value: '2 Pending', sub: 'Next due in 4 days', icon: FileCheck, color: '#f59e0b', bg: '#fef3c7' },
    { title: 'Quiz Average', value: '92.5%', sub: '+4.2% from last week', icon: HelpCircle, color: '#10b981', bg: '#d1fae5' },
    { title: 'Certificates', value: '4 Verified', sub: '2 ready to claim', icon: Award, color: '#7c3aed', bg: '#f3e8ff' },
    { title: 'Learning Hours', value: '38.5 hrs', sub: 'This month', icon: Clock, color: '#0ea5e9', bg: '#e0f2fe' },
    { title: 'Weekly XP', value: '+1,250 XP', sub: 'Top 5% student', icon: Zap, color: '#f97316', bg: '#ffedd5' },
    { title: 'Attendance Rate', value: '96.2%', sub: '48/50 lectures', icon: TrendingUp, color: '#059669', bg: '#ecfdf5' },
    { title: 'Badges Earned', value: '12 Badges', sub: 'Latest: AI Wizard', icon: Trophy, color: '#eab308', bg: '#fef9c3' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Greeting Hero Banner */}
      <div className="animate-fade-up" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        borderRadius: '24px',
        padding: '2.25rem',
        color: '#ffffff',
        boxShadow: '0 12px 30px -4px rgba(30, 27, 75, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Ambient Decorative Shapes */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '220px',
          height: '220px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.35) 0%, rgba(0, 0, 0, 0) 70%)',
          borderRadius: '50%'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#a5b4fc',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <Sparkles style={{ width: '14px', height: '14px', color: '#fbbf24' }} /> {profile.semester}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>• {profile.department}</span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
              Welcome back, {profile.name}! 👋
            </h1>

            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '600px', lineHeight: 1.5 }}>
              Your learning streak is going strong. You are currently ranked <strong style={{ color: '#fbbf24' }}>#{profile.rank}</strong> in your department!
            </p>
          </div>

          {/* Gamification Stats Quick Pill Grid */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '1rem 1.25rem',
            borderRadius: '16px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
          }}>
            <div style={{ textAlign: 'center', padding: '0 0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f97316', justifyContent: 'center' }}>
                <Flame style={{ width: '20px', height: '20px' }} />
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{profile.streakDays}</span>
              </div>
              <span style={{ fontSize: '0.725rem', color: '#cbd5e1', fontWeight: 600 }}>Day Streak</span>
            </div>
            <div style={{ width: '1px', height: '36px', backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />
            <div style={{ textAlign: 'center', padding: '0 0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', justifyContent: 'center' }}>
                <Zap style={{ width: '20px', height: '20px' }} />
                <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>{profile.xp.toLocaleString()}</span>
              </div>
              <span style={{ fontSize: '0.725rem', color: '#cbd5e1', fontWeight: 600 }}>Total XP</span>
            </div>
          </div>
        </div>

        {/* Quick Action Button & Progress Bar */}
        <div style={{
          marginTop: '1.75rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ flex: 1, minWidth: '260px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginBottom: '6px' }}>
              <span>Overall Semester Progress</span>
              <span style={{ fontWeight: 700, color: '#ffffff' }}>78% Completed</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: '78%', height: '100%', backgroundColor: '#38bdf8', borderRadius: '9999px' }} />
            </div>
          </div>

          <button 
            onClick={() => setActiveTab('courses')}
            className="btn-accent"
          >
            <PlayCircle style={{ width: '18px', height: '18px' }} />
            Continue AI & Neural Networks
            <ArrowRight style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      </div>

      {/* 8 Statistics Cards Grid */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Academic Overview & Statistics
        </h2>
        <div className="grid-responsive">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div 
                key={idx} 
                className="ls-card ls-card-hover animate-fade-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>{stat.title}</span>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: stat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon style={{ width: '20px', height: '20px', color: stat.color }} />
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '4px' }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue Learning Course Banner */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Continue Learning
          </h2>
          <button 
            onClick={() => setActiveTab('courses')}
            style={{ fontSize: '0.875rem', fontWeight: 700, color: '#4f46e5', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            View All Courses →
          </button>
        </div>

        <div className="ls-card" style={{
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          overflow: 'hidden'
        }}>
          <div style={{ height: '220px', position: 'relative' }}>
            <img 
              src={MOCK_COURSES[0].coverImage} 
              alt={MOCK_COURSES[0].title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <span style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              color: '#ffffff',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 700,
              backdropFilter: 'blur(4px)'
            }}>
              {MOCK_COURSES[0].category}
            </span>
          </div>

          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{MOCK_COURSES[0].instructor}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Star style={{ width: '14px', height: '14px', fill: '#eab308' }} /> {MOCK_COURSES[0].rating}
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {MOCK_COURSES[0].title}
              </h3>

              <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.5 }}>
                {MOCK_COURSES[0].description}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '6px' }}>
                <span>Module {MOCK_COURSES[0].completedModules} of {MOCK_COURSES[0].totalModules}</span>
                <span style={{ fontWeight: 700, color: '#4f46e5' }}>{MOCK_COURSES[0].progress}% Complete</span>
              </div>
              <div className="progress-bar-bg" style={{ marginBottom: '1.25rem' }}>
                <div className="progress-bar-fill" style={{ width: `${MOCK_COURSES[0].progress}%` }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  onClick={() => setActiveTab('timeline')} 
                  className="btn-primary"
                >
                  <PlayCircle style={{ width: '18px', height: '18px' }} />
                  Resume Lesson 11
                </button>
                <button className="btn-secondary">
                  <Bookmark style={{ width: '16px', height: '16px', color: '#4f46e5' }} />
                  Bookmark
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
