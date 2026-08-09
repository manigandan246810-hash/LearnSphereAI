import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AIAssistantWidget } from './components/ai/AIAssistantWidget';

// Student View Components
import { StudentDashboard } from './components/student/StudentDashboard';
import { CourseGrid } from './components/student/CourseGrid';
import { WeeklyTimeline } from './components/student/WeeklyTimeline';
import { AssignmentsSection } from './components/student/AssignmentsSection';
import { QuizSection } from './components/student/QuizSection';
import { Leaderboard } from './components/student/Leaderboard';
import { AnalyticsDashboard } from './components/student/AnalyticsDashboard';
import { AchievementsBadgeCollection } from './components/student/AchievementsBadgeCollection';
import { StudentCalendar } from './components/student/StudentCalendar';
import { StudentProfile } from './components/student/StudentProfile';

import { StaffDashboard } from './components/staff/StaffDashboard';
import { CourseManager } from './components/staff/CourseManager';
import { WeeklyPlanner } from './components/staff/WeeklyPlanner';
import { AssignmentBuilder } from './components/staff/AssignmentBuilder';
import { QuizBuilder } from './components/staff/QuizBuilder';
import { StudentManagement } from './components/staff/StudentManagement';
import { EvaluationDesk } from './components/staff/EvaluationDesk';
import { AnnouncementsCenter } from './components/staff/AnnouncementsCenter';
import { ResourceLibrary } from './components/staff/ResourceLibrary';
import { MalpracticeReports } from './components/staff/MalpracticeReports';
import { LoginGateway } from './components/layout/LoginGateway';
import { UploadCenter } from './components/staff/UploadCenter';
import { HODDashboard } from './components/staff/HODDashboard';

// Mock Data Profiles & Lists
import { 
  INITIAL_STUDENT_PROFILE, 
  INITIAL_FACULTY_PROFILE,
  MOCK_COURSES,
  MOCK_ASSIGNMENTS,
  MOCK_QUIZZES
} from './data/mockData';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedUserProfile, setLoggedUserProfile] = useState(null);
  const [activeRole, setActiveRole] = useState('Student');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unreadCount, setUnreadCount] = useState(3);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Lifted Core States
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [assignments, setAssignments] = useState(MOCK_ASSIGNMENTS);
  const [quizzes, setQuizzes] = useState(MOCK_QUIZZES);
  const [isMobileSimulator, setIsMobileSimulator] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  
  const [malpracticeLogs, setMalpracticeLogs] = useState([
    {
      id: 1,
      studentName: 'Alex Morgan',
      studentId: 'STU-88219',
      quizTitle: 'Neural Network Basics',
      time: '10:32 AM',
      infractionsCount: 2,
      infractions: ['Tab switch (lost window focus)', 'Attempted copy-paste action'],
      severity: 'Medium',
      status: 'Pending'
    }
  ]);

  const [reminders, setReminders] = useState([
    { id: 1, date: 'Aug 10', title: 'CNN PyTorch Assignment Deadline', time: '11:59 PM', category: 'Assignment', color: '#ef4444' },
    { id: 2, date: 'Aug 12', title: 'Live Q&A: Deep Learning Models', time: '02:00 PM', category: 'Session', color: '#2563eb' },
    { id: 3, date: 'Aug 15', title: 'LearnSphere National AI Hackathon', time: 'All Day', category: 'Hackathon', color: '#f59e0b' },
    { id: 4, date: 'Aug 18', title: 'React 18 & Next.js Mid-Term Exam', time: '10:00 AM', category: 'Exam', color: '#0ea5e9' }
  ]);

  // Alarms and Reminders Background Check
  useEffect(() => {
    // Show a sample live alarm after 10 seconds to demonstrate daily reminders feature
    const timer = setTimeout(() => {
      setActiveNotification({
        id: Date.now(),
        title: "🔔 Daily Reminder Alert",
        text: "Reminder: Live Q&A on Deep Learning starts in 15 minutes! Get your questions ready.",
        color: "#2563eb"
      });
      setUnreadCount(prev => prev + 1);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleToggleRole = (role) => {
    setActiveRole(role);
    if (role === 'Student') {
      setActiveTab('dashboard');
    } else if (role === 'Staff') {
      setActiveTab('staff-dashboard');
    } else if (role === 'HOD') {
      setActiveTab('hod-dashboard');
    }
  };

  if (!isLoggedIn) {
    return (
      <LoginGateway 
        onLogin={(role, profile) => {
          setActiveRole(role);
          setLoggedUserProfile(profile);
          setIsLoggedIn(true);
          if (role === 'Student') {
            setActiveTab('dashboard');
          } else if (role === 'Staff') {
            setActiveTab('staff-dashboard');
          } else if (role === 'HOD') {
            setActiveTab('hod-dashboard');
          }
        }} 
      />
    );
  }

  const renderContent = () => {
    // Student Routes
    if (activeRole === 'Student') {
      switch (activeTab) {
        case 'dashboard':
          return (
            <StudentDashboard 
              profile={INITIAL_STUDENT_PROFILE} 
              setActiveTab={setActiveTab} 
              setSelectedCourse={setSelectedCourse} 
              courses={courses}
              assignments={assignments}
              reminders={reminders}
            />
          );
        case 'courses':
          return (
            <CourseGrid 
              courses={courses} 
              setCourses={setCourses} 
              setActiveTab={setActiveTab} 
              setSelectedCourse={setSelectedCourse} 
            />
          );
        case 'timeline':
          return (
            <WeeklyTimeline 
              setActiveTab={setActiveTab} 
              selectedCourse={selectedCourse || courses[0]} 
              setSelectedCourse={setSelectedCourse}
              courses={courses}
            />
          );
        case 'assignments':
          return (
            <AssignmentsSection 
              assignments={assignments} 
              setAssignments={setAssignments} 
            />
          );
        case 'quizzes':
          return (
            <QuizSection 
              quizzes={quizzes} 
              setQuizzes={setQuizzes} 
              malpracticeLogs={malpracticeLogs}
              setMalpracticeLogs={setMalpracticeLogs}
            />
          );
        case 'leaderboard':
          return <Leaderboard currentStudentName={INITIAL_STUDENT_PROFILE.name} />;
        case 'analytics':
          return (
            <AnalyticsDashboard 
              assignments={assignments} 
              courses={courses} 
            />
          );
        case 'achievements':
          return <AchievementsBadgeCollection />;
        case 'calendar':
          return (
            <StudentCalendar 
              reminders={reminders} 
              setReminders={setReminders} 
              setActiveNotification={setActiveNotification}
            />
          );
        case 'profile':
          return <StudentProfile profile={INITIAL_STUDENT_PROFILE} />;
        default:
          return (
            <StudentDashboard 
              profile={INITIAL_STUDENT_PROFILE} 
              setActiveTab={setActiveTab} 
              setSelectedCourse={setSelectedCourse} 
              courses={courses}
              assignments={assignments}
              reminders={reminders}
            />
          );
      }
    }

    // Staff / Faculty Routes
    if (activeRole === 'Staff') {
      switch (activeTab) {
        case 'staff-dashboard':
          return (
            <StaffDashboard 
              profile={INITIAL_FACULTY_PROFILE} 
              setActiveTab={setActiveTab} 
              courses={courses}
              setCourses={setCourses}
              assignments={assignments}
              setAssignments={setAssignments}
              quizzes={quizzes}
              setQuizzes={setQuizzes}
              malpracticeLogs={malpracticeLogs}
            />
          );
        case 'upload':
          return (
            <UploadCenter 
              courses={courses}
              setCourses={setCourses}
              assignments={assignments}
              setAssignments={setAssignments}
              quizzes={quizzes}
              setQuizzes={setQuizzes}
              setActiveTab={setActiveTab}
            />
          );
        case 'student-management':
          return (
            <StudentManagement 
              courses={courses} 
              assignments={assignments} 
              quizzes={quizzes} 
              malpracticeLogs={malpracticeLogs}
            />
          );
        case 'malpractice-reports':
          return (
            <MalpracticeReports 
              malpracticeLogs={malpracticeLogs} 
              setMalpracticeLogs={setMalpracticeLogs} 
            />
          );
        case 'evaluation-desk':
          return (
            <EvaluationDesk 
              assignments={assignments} 
              setAssignments={setAssignments} 
            />
          );
        case 'staff-analytics':
          return <AnalyticsDashboard assignments={assignments} courses={courses} />;
        case 'announcements-manager':
          return <AnnouncementsCenter />;
        case 'resource-library':
          return <ResourceLibrary />;
        default:
          return (
            <StaffDashboard 
              profile={INITIAL_FACULTY_PROFILE} 
              setActiveTab={setActiveTab} 
              courses={courses}
              setCourses={setCourses}
              assignments={assignments}
              setAssignments={setAssignments}
              quizzes={quizzes}
              setQuizzes={setQuizzes}
              malpracticeLogs={malpracticeLogs}
            />
          );
      }
    }

    // HOD Routes
    if (activeRole === 'HOD') {
      return (
        <HODDashboard 
          profile={loggedUserProfile}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          courses={courses}
          setCourses={setCourses}
          assignments={assignments}
          setAssignments={setAssignments}
          quizzes={quizzes}
          setQuizzes={setQuizzes}
          malpracticeLogs={malpracticeLogs}
          setMalpracticeLogs={setMalpracticeLogs}
          reminders={reminders}
          setReminders={setReminders}
        />
      );
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f5f9' }}>
      {/* Top Navbar */}
      <Navbar 
        activeRole={activeRole} 
        onToggleRole={handleToggleRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
        setUnreadCount={setUnreadCount}
        isMobileSimulator={isMobileSimulator}
        setIsMobileSimulator={setIsMobileSimulator}
        profile={loggedUserProfile}
        onSignOut={() => setIsLoggedIn(false)}
      />

      {isMobileSimulator ? (
        /* Mobile Simulator Shell View */
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1rem',
          flex: 1,
          backgroundColor: '#0f172a'
        }}>
          {/* Phone Frame Container */}
          <div style={{
            width: '390px',
            height: '844px',
            borderRadius: '40px',
            backgroundColor: '#ffffff',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.4), 0 0 0 12px #1e293b, 0 0 0 14px #334155',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '4px solid #0f172a'
          }}>
            {/* Camera Notch / Island */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '110px',
              height: '30px',
              borderRadius: '20px',
              backgroundColor: '#0f172a',
              zIndex: 999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#1e293b', marginRight: '6px' }} />
              <span style={{ width: '45px', height: '4px', borderRadius: '2px', backgroundColor: '#1e293b' }} />
            </div>

            {/* Simulated Phone Status Bar */}
            <div style={{
              height: '44px',
              backgroundColor: '#ffffff',
              padding: '12px 24px 0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#0f172a',
              userSelect: 'none',
              zIndex: 998
            }}>
              <span>9:41 AM</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem' }}>📶 🛜 🔋</span>
              </div>
            </div>

            {/* Mobile View Title Bar */}
            <div style={{
              padding: '0.5rem 1rem',
              borderBottom: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#1e3a8a',
              fontSize: '0.95rem'
            }}>
              <span>Flutter Sandbox App</span>
            </div>

            {/* Phone Screen Area */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              backgroundColor: '#f8fafc',
              padding: '0.75rem',
              position: 'relative'
            }}>
              {renderContent()}
            </div>

            {/* Flutter Bottom Navigation Bar */}
            <div style={{
              height: '68px',
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              paddingBottom: '8px',
              zIndex: 998
            }}>
              {activeRole === 'Student' ? (
                <>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: activeTab === 'dashboard' ? '#2563eb' : '#64748b', cursor: 'pointer', fontSize: '0.675rem', fontWeight: 800 }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>🏠</span>
                    <span>Home</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('courses')}
                    style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: activeTab === 'courses' ? '#2563eb' : '#64748b', cursor: 'pointer', fontSize: '0.675rem', fontWeight: 800 }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>📚</span>
                    <span>Courses</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('analytics')}
                    style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: activeTab === 'analytics' ? '#2563eb' : '#64748b', cursor: 'pointer', fontSize: '0.675rem', fontWeight: 800 }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>📊</span>
                    <span>Analytics</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('calendar')}
                    style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: activeTab === 'calendar' ? '#2563eb' : '#64748b', cursor: 'pointer', fontSize: '0.675rem', fontWeight: 800 }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>📅</span>
                    <span>Calendar</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('profile')}
                    style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: activeTab === 'profile' ? '#2563eb' : '#64748b', cursor: 'pointer', fontSize: '0.675rem', fontWeight: 800 }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>👤</span>
                    <span>Profile</span>
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setActiveTab('staff-dashboard')}
                    style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: activeTab === 'staff-dashboard' ? '#2563eb' : '#64748b', cursor: 'pointer', fontSize: '0.675rem', fontWeight: 800 }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>🏠</span>
                    <span>Overview</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('course-management')}
                    style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: activeTab === 'course-management' ? '#2563eb' : '#64748b', cursor: 'pointer', fontSize: '0.675rem', fontWeight: 800 }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>🛠️</span>
                    <span>Courses</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('malpractice-reports')}
                    style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: activeTab === 'malpractice-reports' ? '#2563eb' : '#64748b', cursor: 'pointer', fontSize: '0.675rem', fontWeight: 800 }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>🛡️</span>
                    <span>Security</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab('student-management')}
                    style={{ background: 'none', border: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', color: activeTab === 'student-management' ? '#2563eb' : '#64748b', cursor: 'pointer', fontSize: '0.675rem', fontWeight: 800 }}
                  >
                    <span style={{ fontSize: '1.25rem' }}>👥</span>
                    <span>Roster</span>
                  </button>
                </>
              )}
            </div>

            {/* Safe Area Home Indicator */}
            <div style={{
              position: 'absolute',
              bottom: '6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '130px',
              height: '5px',
              borderRadius: '2.5px',
              backgroundColor: '#000000',
              zIndex: 999
            }} />
          </div>
        </div>
      ) : (
        /* Regular Desktop Workspace Layout (Sidebar + Content Body) */
        <div style={{ display: 'flex', flex: 1 }}>
          <Sidebar 
            activeRole={activeRole} 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
          />

          <main style={{
            flex: 1,
            padding: '2rem',
            backgroundColor: '#f8fafc',
            overflowY: 'auto',
            minWidth: 0
          }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
              {renderContent()}
            </div>
          </main>
        </div>
      )}

      {/* Floating daily reminder alert banners */}
      {activeNotification && (
        <div className="animate-fade-up" style={{
          position: 'fixed',
          bottom: '100px',
          right: '24px',
          width: '320px',
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          borderLeft: `6px solid ${activeNotification.color || '#2563eb'}`,
          boxShadow: '0 10px 25px -5px rgba(15,23,42,0.15)',
          padding: '1rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#1e3a8a' }}>{activeNotification.title}</span>
            <button onClick={() => setActiveNotification(null)} style={{ border: 'none', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#475569', margin: 0 }}>{activeNotification.text}</p>
        </div>
      )}

      {/* Floating AI Assistant Widget */}
      <AIAssistantWidget />
    </div>
  );
}
