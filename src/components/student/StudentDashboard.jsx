import React, { useState } from 'react';
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
  Star,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { MOCK_COURSES, MOCK_ASSIGNMENTS } from '../../data/mockData';

// Hour-wise attendance data (can be fetched from API in production)
const HOURLY_ATTENDANCE = [
  { hour: '8 AM', present: true,  subject: 'Deep Learning' },
  { hour: '9 AM', present: true,  subject: 'Data Structures' },
  { hour: '10 AM', present: false, subject: 'OS Lab' },
  { hour: '11 AM', present: true,  subject: 'Computer Networks' },
  { hour: '12 PM', present: true,  subject: 'DBMS' },
  { hour: '1 PM',  present: null,  subject: 'Lunch Break' },
  { hour: '2 PM',  present: true,  subject: 'Project Seminar' },
  { hour: '3 PM',  present: true,  subject: 'Elective – NLP' },
  { hour: '4 PM',  present: false, subject: 'ML Lab' },
];

export function StudentDashboard({ profile, setActiveTab, setSelectedCourse, courses = [], assignments = [], quizzes = [] }) {
  const [bookmarkedCourse, setBookmarkedCourse] = useState(null);
  const activeCoursesCount = courses.filter(c => (c.progress || 0) > 0 && (c.progress || 0) < 100).length;
  const pendingAsns = assignments.filter(a => a.status === 'pending' || a.status === 'Not Submitted');
  
  const totalCourseProgress = courses.length > 0 
    ? Math.round(courses.reduce((sum, c) => sum + (c.progress || 0), 0) / courses.length) 
    : 78;

  const currentCourse = courses[0] || {
    title: 'No Course Registered',
    instructor: 'Unassigned',
    rating: 4.8,
    description: 'Enroll in a course from your study plan to begin learning.',
    progress: 0,
    completedModules: 0,
    totalModules: 0,
    category: 'Core',
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60'
  };

  const statCards = [
    { title: 'Courses Registered', value: `${courses.length} Courses`, sub: `${activeCoursesCount} Active this sem`, icon: BookOpen, color: '#4f46e5', bg: '#e0e7ff' },
    { title: 'Assignments Pending', value: `${pendingAsns.length} Pending`, sub: pendingAsns.length > 0 ? 'Deadline approaching' : 'All tasks submitted', icon: FileCheck, color: '#f59e0b', bg: '#fef3c7' },
    { title: 'Quiz Average', value: '92.5%', sub: '+4.2% from last week', icon: HelpCircle, color: '#10b981', bg: '#d1fae5' },
    { title: 'Certificates', value: '4 Verified', sub: '2 ready to claim', icon: Award, color: '#7c3aed', bg: '#f3e8ff' },
    { title: 'Learning Hours', value: '38.5 hrs', sub: 'This month', icon: Clock, color: '#0ea5e9', bg: '#e0f2fe' },
    { title: 'Weekly XP', value: `+${profile.xp || 1250} XP`, sub: 'Top 5% student', icon: Zap, color: '#f97316', bg: '#ffedd5' },
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
              <span style={{ fontWeight: 700, color: '#ffffff' }}>{totalCourseProgress}% Completed</span>
            </div>
            <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${totalCourseProgress}%`, height: '100%', backgroundColor: '#38bdf8', borderRadius: '9999px' }} />
            </div>
          </div>

          <button 
            onClick={() => {
              if (courses.length > 0) {
                if (setSelectedCourse) setSelectedCourse(courses[0]);
                setActiveTab('timeline');
              } else {
                setActiveTab('courses');
              }
            }}
            className="btn-accent"
          >
            <PlayCircle style={{ width: '18px', height: '18px' }} />
            {courses.length > 0 ? `Continue ${currentCourse.title}` : 'Browse Courses'}
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

      {/* Hour-wise Attendance Tracker */}
      <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>Today's Hour-wise Attendance</h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Real-time class-by-class attendance breakdown for today</p>
          </div>
          {(() => {
            const attended = HOURLY_ATTENDANCE.filter(h => h.present === true).length;
            const total = HOURLY_ATTENDANCE.filter(h => h.present !== null).length;
            const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
            return (
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: pct >= 75 ? '#059669' : '#ef4444', lineHeight: 1 }}>{pct}%</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{attended} / {total} classes attended</div>
              </div>
            );
          })()}
        </div>

        <div className="ls-card" style={{ padding: '1.25rem' }}>
          {/* Attendance % progress bar */}
          {(() => {
            const attended = HOURLY_ATTENDANCE.filter(h => h.present === true).length;
            const total = HOURLY_ATTENDANCE.filter(h => h.present !== null).length;
            const pct = total > 0 ? Math.round((attended / total) * 100) : 0;
            const isGood = pct >= 75;
            return (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '6px', fontWeight: 600 }}>
                  <span>Attendance Percentage Today</span>
                  <span style={{ color: isGood ? '#059669' : '#ef4444', fontWeight: 800 }}>{pct}% {isGood ? '✓ Above Threshold' : '⚠ Below 75% Minimum'}</span>
                </div>
                <div style={{ height: '10px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', backgroundColor: isGood ? '#059669' : '#ef4444', borderRadius: '9999px', transition: 'width 0.8s ease' }} />
                </div>
              </div>
            );
          })()}

          {/* Hour slots grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.65rem' }}>
            {HOURLY_ATTENDANCE.map((slot, idx) => {
              const isBreak = slot.present === null;
              const isPresent = slot.present === true;
              const isAbsent = slot.present === false;
              return (
                <div
                  key={idx}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '12px',
                    border: `1.5px solid ${isBreak ? '#e2e8f0' : isPresent ? '#a7f3d0' : '#fca5a5'}`,
                    backgroundColor: isBreak ? '#f8fafc' : isPresent ? '#f0fdf4' : '#fef2f2',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem',
                    opacity: isBreak ? 0.6 : 1
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>{slot.hour}</span>
                    {isBreak ? (
                      <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700 }}>BREAK</span>
                    ) : isPresent ? (
                      <CheckCircle2 style={{ width: '14px', height: '14px', color: '#059669' }} />
                    ) : (
                      <XCircle style={{ width: '14px', height: '14px', color: '#ef4444' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: isBreak ? '#94a3b8' : isPresent ? '#065f46' : '#991b1b', lineHeight: 1.2 }}>
                    {slot.subject}
                  </div>
                  {!isBreak && (
                    <span style={{
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: '9999px',
                      backgroundColor: isPresent ? '#059669' : '#ef4444',
                      color: '#ffffff',
                      alignSelf: 'flex-start'
                    }}>
                      {isPresent ? 'PRESENT' : 'ABSENT'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
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
              src={currentCourse.coverImage || currentCourse.cover_image_url} 
              alt={currentCourse.title}
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
              {currentCourse.category}
            </span>
          </div>

          <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>{currentCourse.instructor}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#eab308', fontWeight: 700, fontSize: '0.85rem' }}>
                  <Star style={{ width: '14px', height: '14px', fill: '#eab308' }} /> {currentCourse.rating}
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {currentCourse.title}
              </h3>

              <p style={{ fontSize: '0.875rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.5 }}>
                {currentCourse.description}
              </p>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b', marginBottom: '6px' }}>
                <span>Module {currentCourse.completedModules} of {currentCourse.totalModules}</span>
                <span style={{ fontWeight: 700, color: '#4f46e5' }}>{currentCourse.progress}% Complete</span>
              </div>
              <div className="progress-bar-bg" style={{ marginBottom: '1.25rem' }}>
                <div className="progress-bar-fill" style={{ width: `${currentCourse.progress}%` }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  onClick={() => {
                    if (courses.length > 0) {
                      if (setSelectedCourse) setSelectedCourse(courses[0]);
                      setActiveTab('timeline');
                    } else {
                      setActiveTab('courses');
                    }
                  }} 
                  className="btn-primary"
                >
                  <PlayCircle style={{ width: '18px', height: '18px' }} />
                  {courses.length > 0 ? 'Resume Course' : 'Browse Courses'}
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => {
                    setBookmarkedCourse(currentCourse.title);
                    setTimeout(() => setBookmarkedCourse(null), 3000);
                  }}
                  style={{ position: 'relative' }}
                >
                  <Bookmark style={{ width: '16px', height: '16px', color: bookmarkedCourse ? '#059669' : '#4f46e5', fill: bookmarkedCourse ? '#059669' : 'none' }} />
                  {bookmarkedCourse ? 'Bookmarked ✓' : 'Bookmark'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
