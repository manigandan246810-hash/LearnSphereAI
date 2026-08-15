import React, { useState, useEffect } from 'react';
import { api } from './services/api';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { AIAssistantWidget } from './components/ai/AIAssistantWidget';
import { ChevronLeft, ArrowLeft } from 'lucide-react';

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
import { UserProfile } from './components/common/UserProfile';
import { StaffCommunity } from './components/staff/StaffCommunity';

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
import { SmartListGenerator } from './components/staff/SmartListGenerator';

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
  
  // Cross-Portal User Profiles State
  const [userProfiles, setUserProfiles] = useState(() => {
    const saved = localStorage.getItem('learnsphere_user_profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) {
        console.error("Error reading saved user profiles:", e);
      }
    }
    return {
      Student: {
        id: 'STU-88219',
        name: 'Alex Morgan',
        title: '6th Sem • Computer Science & Eng',
        department: 'Computer Science & AI',
        email: 'alex.morgan@learnsphere.edu',
        phone: '+1 (555) 234-8901',
        bio: 'Passionate about artificial intelligence, neural network architectures, and interactive web applications.',
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        featuredBadges: ['ach-1', 'ach-2', 'ach-3', 'ach-6']
      },
      Staff: {
        id: 'FAC-102',
        name: 'Dr. Sarah Jenkins',
        title: 'Associate Professor of AI',
        department: 'Computer Science & AI',
        email: 'sarah.jenkins@learnsphere.edu',
        phone: '+1 (555) 345-6789',
        bio: 'Lead instructor for Deep Learning & Neural Networks. Research focus on transformer architectures and efficient model fine-tuning.',
        avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        featuredBadges: ['ach-7', 'ach-8', 'ach-1', 'ach-4']
      },
      HOD: {
        id: 'HOD-001',
        name: 'Dr. Evelyn Vance',
        title: 'Head of Department',
        department: 'Artificial Intelligence & Data Science',
        email: 'evelyn.vance@learnsphere.edu',
        phone: '+1 (555) 901-4422',
        bio: 'Head of Artificial Intelligence and Data Science Department. Leading research in autonomous agents, neural architectures, and curriculum accreditation.',
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        featuredBadges: ['ach-7', 'ach-5', 'ach-3', 'ach-8']
      }
    };
  });

  const handleUpdateProfile = (updatedFields) => {
    setUserProfiles(prev => {
      const current = prev[activeRole] || {};
      const updated = {
        ...prev,
        [activeRole]: {
          ...current,
          ...updatedFields
        }
      };
      localStorage.setItem('learnsphere_user_profiles', JSON.stringify(updated));
      return updated;
    });
  };
  
  // Lifted Core States
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [assignments, setAssignments] = useState(() => {
    const saved = localStorage.getItem('learnsphere_assignments');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Error reading saved assignments:", e);
      }
    }
    return MOCK_ASSIGNMENTS;
  });
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

  const fetchAllData = async (studentId) => {
    try {
      const stuCode = studentId || loggedUserProfile?.user_code || loggedUserProfile?.id || 'STU-88219';
      
      const [coursesData, assignmentsData, quizzesData] = await Promise.all([
        api.getCourses(stuCode),
        api.getAssignments(stuCode),
        api.getQuizzes(stuCode)
      ]);

      setCourses(coursesData);
      setAssignments(assignmentsData);
      setQuizzes(quizzesData);

      if (selectedCourse) {
        const updatedCourse = coursesData.find(c => c.id === selectedCourse.id || c.course_code === selectedCourse.id);
        if (updatedCourse) {
          setSelectedCourse(updatedCourse);
        }
      }
    } catch (err) {
      console.warn('Error fetching dynamic data:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn && loggedUserProfile) {
      fetchAllData(loggedUserProfile.user_code || loggedUserProfile.id);
    }
  }, [isLoggedIn, loggedUserProfile, activeRole]);

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

    // Dynamic deadline check interval (every 30 seconds)
    const interval = setInterval(() => {
      const now = new Date();
      // Check assignments
      const pendingAsns = assignments.filter(a => a.status === 'pending' || a.status === 'Not Submitted');
      pendingAsns.forEach(a => {
        const dueDate = new Date(a.dueDate);
        const timeDiff = dueDate - now;
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        // If due within 48 hours
        if (hoursDiff > 0 && hoursDiff < 48) {
          setActiveNotification({
            id: Date.now() + Math.random(),
            title: `⚠️ Assignment Due Soon: ${a.title}`,
            text: `Due in ${Math.round(hoursDiff)} hours! Submit your work before the deadline.`,
            color: "#ef4444"
          });
          setUnreadCount(prev => prev + 1);
        }
      });
    }, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [assignments]);

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
        case 'student-dashboard':
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
              studentProfile={loggedUserProfile || INITIAL_STUDENT_PROFILE}
              onRefreshData={() => fetchAllData(loggedUserProfile?.id || 'STU-88219')}
            />
          );
        case 'timeline':
          return (
            <WeeklyTimeline 
              setActiveTab={setActiveTab} 
              selectedCourse={selectedCourse || courses[0]} 
              setSelectedCourse={setSelectedCourse}
              courses={courses}
              studentProfile={loggedUserProfile || INITIAL_STUDENT_PROFILE}
              onRefreshData={() => fetchAllData(loggedUserProfile?.id || 'STU-88219')}
            />
          );
        case 'assignments':
          return (
            <AssignmentsSection 
              assignments={assignments} 
              setAssignments={setAssignments} 
              studentProfile={loggedUserProfile || INITIAL_STUDENT_PROFILE}
              onRefreshData={() => fetchAllData(loggedUserProfile?.id || 'STU-88219')}
            />
          );
        case 'quizzes':
          return (
            <QuizSection 
              quizzes={quizzes} 
              setQuizzes={setQuizzes} 
              malpracticeLogs={malpracticeLogs}
              setMalpracticeLogs={setMalpracticeLogs}
              studentProfile={loggedUserProfile || INITIAL_STUDENT_PROFILE}
              onRefreshData={() => fetchAllData(loggedUserProfile?.id || 'STU-88219')}
            />
          );
        case 'leaderboard':
          return <Leaderboard currentStudentName={INITIAL_STUDENT_PROFILE.name} />;
        case 'smart-lists':
          return <SmartListGenerator />;
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
          return <UserProfile activeRole="Student" profile={userProfiles.Student} onUpdateProfile={handleUpdateProfile} />;
        default:
          return (
            <StudentDashboard 
              profile={userProfiles.Student} 
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
        case 'dashboard':
        case 'staff-dashboard':
          return (
            <StaffDashboard 
              profile={userProfiles.Staff} 
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
        case 'courses-manager':
        case 'course-manager':
        case 'courses':
          return (
            <CourseManager 
              courses={courses} 
              setCourses={setCourses} 
              staffProfile={loggedUserProfile || userProfiles.Staff} 
              onRefreshData={() => fetchAllData(loggedUserProfile?.id || 'STU-88219')}
            />
          );
        case 'quiz-builder':
        case 'quizzes':
          return (
            <QuizBuilder 
              staffProfile={loggedUserProfile || userProfiles.Staff} 
              courses={courses} 
              onRefreshData={() => fetchAllData(loggedUserProfile?.id || 'STU-88219')}
            />
          );
        case 'assignment-builder':
          return (
            <AssignmentBuilder 
              courses={courses} 
              assignments={assignments} 
              setAssignments={setAssignments} 
              onRefreshData={() => fetchAllData(loggedUserProfile?.id || 'STU-88219')}
            />
          );
        case 'staff-community':
          return <StaffCommunity activeRole="Staff" profile={userProfiles.Staff} />;
        case 'profile':
          return <UserProfile activeRole="Staff" profile={userProfiles.Staff} onUpdateProfile={handleUpdateProfile} />;
        case 'smart-lists':
          return <SmartListGenerator />;
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
              onRefreshData={() => fetchAllData(userProfiles.Student?.id || 'STU-88219')}
            />
          );
        case 'student-management':
          return (
            <StudentManagement 
              courses={courses} 
              assignments={assignments} 
              quizzes={quizzes} 
              malpracticeLogs={malpracticeLogs}
              setActiveTab={setActiveTab}
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
              onRefreshData={() => fetchAllData(userProfiles.Student?.id || 'STU-88219')}
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
              profile={userProfiles.Staff} 
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
      if (activeTab === 'profile') {
        return <UserProfile activeRole="HOD" profile={userProfiles.HOD} onUpdateProfile={handleUpdateProfile} />;
      }
      if (activeTab === 'staff-community') {
        return <StaffCommunity activeRole="HOD" profile={userProfiles.HOD} />;
      }
      return (
        <HODDashboard 
          profile={userProfiles.HOD}
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

  const isMainDashboard = ['dashboard', 'student-dashboard', 'staff-dashboard', 'hod-dashboard'].includes(activeTab);

  const handleBackNavigation = () => {
    if (activeRole === 'Student') setActiveTab('dashboard');
    else if (activeRole === 'Staff') setActiveTab('staff-dashboard');
    else if (activeRole === 'HOD') setActiveTab('hod-dashboard');
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
      case 'student-dashboard': return 'Student Workspace';
      case 'staff-dashboard': return 'Faculty Overview';
      case 'hod-dashboard': return 'HOD Administration';
      case 'smart-lists': return 'Smart Activity Lists';
      case 'courses': return 'Registered Courses';
      case 'timeline': return 'Weekly Syllabus';
      case 'assignments': return 'Assignments';
      case 'quizzes': return 'Quizzes & Practice';
      case 'upload': return 'Curriculum Upload Center';
      case 'student-management': return 'Student Roster';
      case 'malpractice-reports': return 'Security Infractions';
      case 'evaluation-desk': return 'Evaluation Desk';
      case 'staff-analytics':
      case 'analytics': return 'Learning Analytics';
      case 'resource-library': return 'Resource Library';
      case 'announcements-manager':
      case 'hod-announcements': return 'Announcements';
      case 'hod-courses': return 'Course Catalog';
      case 'hod-faculty': return 'Faculty Workload';
      case 'hod-security': return 'Security Logs';
      case 'staff-community': return 'Staff & HOD Community Hub';
      case 'profile': return `${activeRole} Profile`;
      default: return 'LearnSphere AI';
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
        profile={userProfiles[activeRole]}
        onSignOut={() => setIsLoggedIn(false)}
      />

      {/* Main Workspace Layout (Sidebar + Content Body) */}
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
            {!isMainDashboard && (
              <div className="animate-fade-up" style={{
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#ffffff',
                padding: '0.75rem 1.25rem',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <button 
                  onClick={handleBackNavigation}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '0.45rem 0.95rem',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#94a3b8';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#ffffff';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                >
                  <ArrowLeft style={{ width: '16px', height: '16px', color: 'var(--primary-indigo)' }} />
                  Back to Dashboard Overview
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.825rem', color: '#64748b', fontWeight: 600 }}>
                  <span>Current Section:</span>
                  <span className="chip chip-indigo" style={{ fontWeight: 800 }}>{getTabTitle()}</span>
                </div>
              </div>
            )}
            {renderContent()}
          </div>
        </main>
      </div>

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
