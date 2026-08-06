import React, { useState } from 'react';
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

// Staff View Components
import { StaffDashboard } from './components/staff/StaffDashboard';
import { CourseManager } from './components/staff/CourseManager';
import { WeeklyPlanner } from './components/staff/WeeklyPlanner';
import { AssignmentBuilder } from './components/staff/AssignmentBuilder';
import { QuizBuilder } from './components/staff/QuizBuilder';
import { StudentManagement } from './components/staff/StudentManagement';
import { EvaluationDesk } from './components/staff/EvaluationDesk';
import { AnnouncementsCenter } from './components/staff/AnnouncementsCenter';
import { ResourceLibrary } from './components/staff/ResourceLibrary';

// Mock Data Profiles
import { INITIAL_STUDENT_PROFILE, INITIAL_FACULTY_PROFILE } from './data/mockData';

export default function App() {
  const [activeRole, setActiveRole] = useState('Student');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [unreadCount, setUnreadCount] = useState(3);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleToggleRole = (role) => {
    setActiveRole(role);
    if (role === 'Student') {
      setActiveTab('dashboard');
    } else {
      setActiveTab('staff-dashboard');
    }
  };

  const renderContent = () => {
    // Student Routes
    if (activeRole === 'Student') {
      switch (activeTab) {
        case 'dashboard':
          return <StudentDashboard profile={INITIAL_STUDENT_PROFILE} setActiveTab={setActiveTab} setSelectedCourse={setSelectedCourse} />;
        case 'courses':
          return <CourseGrid setActiveTab={setActiveTab} setSelectedCourse={setSelectedCourse} />;
        case 'timeline':
          return <WeeklyTimeline setActiveTab={setActiveTab} selectedCourse={selectedCourse} />;
        case 'assignments':
          return <AssignmentsSection />;
        case 'quizzes':
          return <QuizSection />;
        case 'leaderboard':
          return <Leaderboard currentStudentName={INITIAL_STUDENT_PROFILE.name} />;
        case 'analytics':
          return <AnalyticsDashboard />;
        case 'achievements':
          return <AchievementsBadgeCollection />;
        case 'calendar':
          return <StudentCalendar />;
        case 'profile':
          return <StudentProfile profile={INITIAL_STUDENT_PROFILE} />;
        default:
          return <StudentDashboard profile={INITIAL_STUDENT_PROFILE} setActiveTab={setActiveTab} setSelectedCourse={setSelectedCourse} />;
      }
    }

    // Staff / Faculty Routes
    if (activeRole === 'Staff') {
      switch (activeTab) {
        case 'staff-dashboard':
          return <StaffDashboard profile={INITIAL_FACULTY_PROFILE} setActiveTab={setActiveTab} />;
        case 'course-management':
          return <CourseManager />;
        case 'weekly-planner':
          return <WeeklyPlanner />;
        case 'assignment-builder':
          return <AssignmentBuilder />;
        case 'quiz-builder':
          return <QuizBuilder />;
        case 'student-management':
          return <StudentManagement />;
        case 'evaluation-desk':
          return <EvaluationDesk />;
        case 'staff-analytics':
          return <AnalyticsDashboard />;
        case 'announcements-manager':
          return <AnnouncementsCenter />;
        case 'resource-library':
          return <ResourceLibrary />;
        default:
          return <StaffDashboard profile={INITIAL_FACULTY_PROFILE} setActiveTab={setActiveTab} />;
      }
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar 
        activeRole={activeRole} 
        onToggleRole={handleToggleRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadCount={unreadCount}
        setUnreadCount={setUnreadCount}
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
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Floating AI Assistant Widget */}
      <AIAssistantWidget />
    </div>
  );
}
