import React, { useState } from 'react';
import { 
  Sparkles, 
  Search, 
  Bell, 
  UserCheck, 
  GraduationCap, 
  Briefcase, 
  Command, 
  CheckCircle2, 
  Megaphone,
  X
} from 'lucide-react';
import { MOCK_ANNOUNCEMENTS } from '../../data/mockData';

export function Navbar({ activeRole, onToggleRole, activeTab, setActiveTab, unreadCount, setUnreadCount }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState(MOCK_ANNOUNCEMENTS);

  const markAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <header style={{
      height: '72px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
    }}>
      {/* Brand & Portal Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => setActiveTab('dashboard')}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 50%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            <Sparkles style={{ width: '24px', height: '24px', color: '#ffffff' }} />
          </div>
          <div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', lineHeight: 1.1 }}>
              LearnSphere <span style={{ color: '#4f46e5' }}>AI</span>
            </div>
            <div style={{ fontSize: '0.725rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Next-Gen LMS
            </div>
          </div>
        </div>

        {/* Role Switcher Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#f1f5f9',
          padding: '4px',
          borderRadius: '9999px',
          border: '1px solid #e2e8f0',
          marginLeft: '1rem'
        }}>
          <button
            onClick={() => onToggleRole('Student')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.825rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              backgroundColor: activeRole === 'Student' ? '#ffffff' : 'transparent',
              color: activeRole === 'Student' ? '#4f46e5' : '#64748b',
              boxShadow: activeRole === 'Student' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <GraduationCap style={{ width: '16px', height: '16px' }} />
            Student Portal
          </button>
          <button
            onClick={() => onToggleRole('Staff')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.9rem',
              borderRadius: '9999px',
              fontSize: '0.825rem',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              backgroundColor: activeRole === 'Staff' ? '#ffffff' : 'transparent',
              color: activeRole === 'Staff' ? '#7c3aed' : '#64748b',
              boxShadow: activeRole === 'Staff' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            <Briefcase style={{ width: '16px', height: '16px' }} />
            Faculty Portal
          </button>
        </div>
      </div>

      {/* Global Search Bar */}
      <div style={{
        position: 'relative',
        width: '380px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Search style={{ position: 'absolute', left: '12px', width: '18px', height: '18px', color: '#94a3b8' }} />
        <input 
          type="text" 
          placeholder="Search courses, assignments, topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.6rem 1rem 0.6rem 2.4rem',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            fontSize: '0.875rem',
            color: '#0f172a',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
        />
        <div style={{
          position: 'absolute',
          right: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '2px 6px',
          fontSize: '0.7rem',
          color: '#64748b',
          fontWeight: 600
        }}>
          <Command style={{ width: '10px', height: '10px' }} /> K
        </div>
      </div>

      {/* Right User & Notification Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              backgroundColor: showNotifications ? '#e0e7ff' : '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transition: 'all 0.2s ease'
            }}
          >
            <Bell style={{ width: '20px', height: '20px', color: showNotifications ? '#4f46e5' : '#475569' }} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#ef4444',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 800,
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid #ffffff'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Center Dropdown */}
          {showNotifications && (
            <div className="animate-fade-up" style={{
              position: 'absolute',
              right: 0,
              top: '52px',
              width: '380px',
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.18)',
              border: '1px solid #e2e8f0',
              zIndex: 100,
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#f8fafc'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Megaphone style={{ width: '18px', height: '18px', color: '#4f46e5' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>Notifications</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button 
                    onClick={markAllRead} 
                    style={{ fontSize: '0.775rem', color: '#4f46e5', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer' }}
                  >
                    Mark all read
                  </button>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}
                  >
                    <X style={{ width: '16px', height: '16px' }} />
                  </button>
                </div>
              </div>

              <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div key={n.id} style={{
                    padding: '1rem 1.25rem',
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: n.pinned ? '#f5f3ff' : '#ffffff',
                    transition: 'background 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className={`chip ${n.pinned ? 'chip-indigo' : 'chip-sky'}`}>
                        {n.category}
                      </span>
                      <span style={{ fontSize: '0.725rem', color: '#64748b' }}>{n.date}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', marginBottom: '4px' }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                      {n.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Quick Summary */}
        <div 
          onClick={() => setActiveTab('profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '4px 8px',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'background 0.2s ease'
          }}
        >
          <img 
            src={activeRole === 'Student' 
              ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
              : "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
            } 
            alt="User Avatar"
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #6366f1' }}
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: '#0f172a', lineHeight: 1.1 }}>
              {activeRole === 'Student' ? 'Alex Morgan' : 'Dr. Evelyn Vance'}
            </span>
            <span style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 500 }}>
              {activeRole === 'Student' ? '6th Sem • CSE' : 'Head of AI Dept'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
