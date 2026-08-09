import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Clock, 
  FileText, 
  HelpCircle, 
  Trophy, 
  BarChart3, 
  Award, 
  Calendar, 
  User, 
  FolderKanban, 
  PlusCircle, 
  UserCheck, 
  CheckSquare, 
  Megaphone, 
  FolderOpen,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

export function Sidebar({ activeRole, activeTab, setActiveTab }) {
  const studentNavItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'courses', label: 'Registered Courses', icon: BookOpen, badge: '6 Enrolled' },
    { id: 'timeline', label: 'Weekly Timeline', icon: Clock, badge: 'Week 5' },
    { id: 'assignments', label: 'Assignments', icon: FileText, badge: '2 Due' },
    { id: 'quizzes', label: 'Quizzes & Practice', icon: HelpCircle, badge: '1 New' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, badge: '#2 Rank' },
    { id: 'analytics', label: 'Learning Analytics', icon: BarChart3, badge: null },
    { id: 'achievements', label: 'Badges & XP', icon: Award, badge: '14.8k XP' },
    { id: 'calendar', label: 'Academic Calendar', icon: Calendar, badge: null },
    { id: 'profile', label: 'Student Profile', icon: User, badge: null }
  ];

  const staffNavItems = [
    { id: 'staff-dashboard', label: 'Faculty Overview', icon: LayoutDashboard, badge: null },
    { id: 'upload', label: 'Upload Center', icon: PlusCircle, badge: 'Unified' },
    { id: 'student-management', label: 'Student Roster', icon: UserCheck, badge: '340 Students' },
    { id: 'malpractice-reports', label: 'Security Violations', icon: ShieldAlert, badge: 'Security' },
    { id: 'evaluation-desk', label: 'Evaluation Desk', icon: CheckSquare, badge: '12 Pending' },
    { id: 'staff-analytics', label: 'Faculty Analytics', icon: BarChart3, badge: null },
    { id: 'announcements-manager', label: 'Announcements', icon: Megaphone, badge: null },
    { id: 'resource-library', label: 'Resource Library', icon: FolderOpen, badge: null }
  ];

  const hodNavItems = [
    { id: 'hod-dashboard', label: 'HOD Overview', icon: LayoutDashboard, badge: null },
    { id: 'hod-courses', label: 'Course Catalog & Approvals', icon: FolderKanban, badge: 'Review' },
    { id: 'hod-faculty', label: 'Faculty & Workload', icon: UserCheck, badge: '8 active' },
    { id: 'hod-security', label: 'Security & Proctor Logs', icon: ShieldAlert, badge: 'Logs' },
    { id: 'hod-announcements', label: 'Broadcaster Center', icon: Megaphone, badge: null }
  ];

  const navItems = activeRole === 'Student' 
    ? studentNavItems 
    : (activeRole === 'Staff' ? staffNavItems : hodNavItems);

  return (
    <aside style={{
      width: '260px',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '1.25rem 0.85rem',
      minHeight: 'calc(100vh - 72px)',
      position: 'sticky',
      top: '72px',
      height: 'calc(100vh - 72px)'
    }}>
      {/* Navigation List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        <div style={{
          fontSize: '0.725rem',
          fontWeight: 700,
          color: '#94a3b8',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          padding: '0 0.75rem 0.5rem 0.75rem'
        }}>
          {activeRole === 'Student' ? 'Student Workspace' : (activeRole === 'Staff' ? 'Faculty Management' : 'HOD Administration')}
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '12px',
                border: 'none',
                backgroundColor: isActive 
                  ? (activeRole === 'Student' ? '#e0f2fe' : (activeRole === 'Staff' ? '#dbeafe' : '#fef3c7'))
                  : 'transparent',
                color: isActive 
                  ? (activeRole === 'Student' ? '#1e40af' : (activeRole === 'Staff' ? '#0369a1' : '#b45309'))
                  : '#475569',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Icon style={{ 
                  width: '18px', 
                  height: '18px', 
                  color: isActive 
                    ? 'var(--primary-indigo)'
                    : '#64748b'
                }} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  backgroundColor: isActive 
                    ? 'var(--primary-indigo)'
                    : '#f1f5f9',
                  color: isActive ? '#ffffff' : '#64748b'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Assistant Quick Callout Box in Sidebar */}
      <div style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        borderRadius: '16px',
        padding: '1rem',
        color: '#ffffff',
        boxShadow: '0 8px 20px rgba(30, 27, 75, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-15px',
          right: '-15px',
          width: '60px',
          height: '60px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <Sparkles style={{ width: '16px', height: '16px', color: '#fbbf24' }} />
          <span style={{ fontWeight: 800, fontSize: '0.875rem' }}>LearnSphere AI</span>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '0.75rem', lineHeight: 1.3 }}>
          Need help summarizing notes or generating quiz practice? Ask AI anytime.
        </p>
        <div style={{
          fontSize: '0.7rem',
          fontWeight: 700,
          color: '#818cf8',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '4px 8px',
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          ✨ Floating Bot Ready
        </div>
      </div>
    </aside>
  );
}
