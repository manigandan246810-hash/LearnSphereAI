import React, { useState } from 'react';
import { Sparkles, GraduationCap, Briefcase, ShieldAlert, ArrowLeft, Lock, Mail, UserCheck } from 'lucide-react';

export function LoginGateway({ onLogin }) {
  const [selectedPortal, setSelectedPortal] = useState(null); // 'Student' | 'Staff' | 'HOD' | null
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [extraId, setExtraId] = useState(''); // Student ID, Faculty ID, or HOD Admin ID
  const [department, setDepartment] = useState('Computer Science');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePortalSelect = (portal) => {
    setSelectedPortal(portal);
    setError('');
    // Prefill mock data to make evaluation seamless and quick
    if (portal === 'Student') {
      setEmail('alex.morgan@learnsphere.edu');
      setExtraId('STU-88219');
      setPassword('••••••••');
    } else if (portal === 'Staff') {
      setEmail('dr.jenkins@learnsphere.edu');
      setExtraId('FAC-11029');
      setPassword('••••••••');
      setDepartment('Computer Science');
    } else if (portal === 'HOD') {
      setEmail('hod.cs@learnsphere.edu');
      setExtraId('HOD-00918');
      setPassword('••••••••');
    }
  };

  const handleBack = () => {
    setSelectedPortal(null);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (!extraId && selectedPortal !== 'HOD')) {
      setError('Please fill in all security fields.');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate server-side authentication spinner
    setTimeout(() => {
      setLoading(false);
      const mockProfile = {
        email,
        id: extraId || 'ADMIN-CS',
        name: selectedPortal === 'Student' ? 'Alex Morgan' : (selectedPortal === 'Staff' ? 'Dr. Sarah Jenkins' : 'Dr. Evelyn Vance'),
        title: selectedPortal === 'Student' ? '6th Sem • Undergrad' : (selectedPortal === 'Staff' ? 'Associate Professor' : 'Head of Department (CSE)'),
        department: selectedPortal === 'Student' ? 'Computer Science' : department
      };
      
      onLogin(selectedPortal, mockProfile);
    }, 800);
  };

  // Portal selection gateway cards
  if (!selectedPortal) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3b8a 100%)',
        padding: '2rem 1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ maxWidth: '900px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Logo & Headline */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)',
              margin: '0 auto 1rem auto'
            }}>
              <Sparkles style={{ width: '36px', height: '36px', color: '#ffffff' }} />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', margin: '0 0 0.5rem 0' }}>
              LearnSphere <span style={{ color: '#3b82f6' }}>AI</span>
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.05rem', margin: 0 }}>
              Next-Generation Academic LMS & Assessment Ecosystem
            </p>
            <div style={{
              display: 'inline-block',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '9999px',
              padding: '4px 14px',
              fontSize: '0.8rem',
              color: '#60a5fa',
              fontWeight: 700,
              marginTop: '0.75rem'
            }}>
              🏫 Engineering Blue multi-portal gateway active
            </div>
          </div>

          {/* Role Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            
            {/* Student Card */}
            <div 
              onClick={() => handlePortalSelect('Student')}
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '2rem 1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.boxShadow = '0 20px 35px -5px rgba(37, 99, 235, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#dbeafe', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <GraduationCap style={{ width: '28px', height: '28px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>Student Portal</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Access registered courses, dynamic timetables, AI summary flashcards, and launch proctored MCQ quizzes.
              </p>
            </div>

            {/* Faculty Card */}
            <div 
              onClick={() => handlePortalSelect('Staff')}
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '2rem 1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = '#0ea5e9';
                e.currentTarget.style.boxShadow = '0 20px 35px -5px rgba(14, 165, 233, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Briefcase style={{ width: '28px', height: '28px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>Faculty Console</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Construct lecture planners, distribute project assignments, build quizzes, and audit anti-cheat violations.
              </p>
            </div>

            {/* HOD Card */}
            <div 
              onClick={() => handlePortalSelect('HOD')}
              style={{
                backgroundColor: 'rgba(30, 41, 59, 0.7)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '2rem 1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-6px)';
                e.currentTarget.style.borderColor = '#fbbf24';
                e.currentTarget.style.boxShadow = '0 20px 35px -5px rgba(251, 191, 36, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.3)';
              }}
            >
              <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <ShieldAlert style={{ width: '28px', height: '28px' }} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: '0 0 0.5rem 0' }}>HOD Workspace</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                Supervise department catalogs, authorize pending classes, audit faculty workloads, and broadcast announcements.
              </p>
            </div>

          </div>
        </div>
      </div>
    );
  }

  // Dedicated Login Form View
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3b8a 100%)',
      padding: '2rem 1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div className="animate-fade-up" style={{
        maxWidth: '420px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        border: '1px solid #cbd5e1'
      }}>
        {/* Form Header */}
        <div style={{
          padding: '1.75rem',
          background: selectedPortal === 'Student' 
            ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' 
            : (selectedPortal === 'Staff' 
              ? 'linear-gradient(135deg, #0f172a 0%, #0ea5e9 100%)' 
              : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #b45309 100%)'),
          color: '#ffffff',
          position: 'relative'
        }}>
          <button 
            onClick={handleBack}
            style={{
              position: 'absolute',
              top: '1.25rem',
              left: '1.25rem',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
          </button>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginTop: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '0.75rem'
            }}>
              {selectedPortal === 'Student' ? <GraduationCap style={{ width: '24px', height: '24px' }} /> : (selectedPortal === 'Staff' ? <Briefcase style={{ width: '24px', height: '24px' }} /> : <ShieldAlert style={{ width: '24px', height: '24px' }} />)}
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              {selectedPortal === 'Student' ? 'Student Workspace Login' : (selectedPortal === 'Staff' ? 'Faculty Planner Login' : 'HOD Administrative Login')}
            </h2>
            <span style={{ fontSize: '0.75rem', color: '#bfdbfe', marginTop: '3px' }}>
              University Credentials Portal
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {error && (
            <div style={{
              backgroundColor: '#fee2e2',
              color: '#991b1b',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              border: '1px solid #fca5a5'
            }}>
              {error}
            </div>
          )}

          {/* Email field */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Academic Email</label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <Mail style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b' }} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. name@university.edu"
                style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Portal ID field */}
          {selectedPortal !== 'HOD' ? (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                {selectedPortal === 'Student' ? 'Student ID Code' : 'Faculty ID'}
              </label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <UserCheck style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b' }} />
                <input 
                  type="text"
                  required
                  value={extraId}
                  onChange={(e) => setExtraId(e.target.value)}
                  placeholder={selectedPortal === 'Student' ? 'e.g. STU-88219' : 'e.g. FAC-11029'}
                  style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          ) : (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Admin Security Passcode</label>
              <div style={{ position: 'relative', marginTop: '4px' }}>
                <Lock style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b' }} />
                <input 
                  type="text"
                  required
                  value={extraId}
                  onChange={(e) => setExtraId(e.target.value)}
                  placeholder="e.g. HOD-00918"
                  style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>
            </div>
          )}

          {/* Department Select (For Staff) */}
          {selectedPortal === 'Staff' && (
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Department Roster</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="AI & Data Science">AI & Data Science</option>
              </select>
            </div>
          )}

          {/* Password field */}
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>Security Password</label>
            <div style={{ position: 'relative', marginTop: '4px' }}>
              <Lock style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#64748b' }} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.75rem 0.6rem 2.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
          </div>

          {/* Submission button */}
          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary" 
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '0.75rem',
              borderRadius: '10px',
              fontWeight: 800,
              background: selectedPortal === 'Student' 
                ? 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)' 
                : (selectedPortal === 'Staff' 
                  ? 'linear-gradient(135deg, #0f172a 0%, #0ea5e9 100%)' 
                  : 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #b45309 100%)'),
              color: '#ffffff',
              border: 'none',
              marginTop: '0.5rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Authenticating Profile...' : 'Sign In to Portal'}
          </button>

          {/* Prefilled Mock hint info */}
          <div style={{
            fontSize: '0.725rem',
            color: '#64748b',
            backgroundColor: '#f8fafc',
            padding: '8px 12px',
            borderRadius: '6px',
            textAlign: 'center',
            lineHeight: 1.3,
            border: '1px dashed #cbd5e1'
          }}>
            🔐 <strong>Mock Account Enabled:</strong> Inputs have been prefilled. Simply click the "Sign In" button to verify access.
          </div>
        </form>
      </div>
    </div>
  );
}
