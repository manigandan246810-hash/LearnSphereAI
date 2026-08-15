import React, { useState, useRef } from 'react';
import { 
  User, 
  Award, 
  Github, 
  Linkedin, 
  FileText, 
  Globe, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  Edit3,
  ExternalLink,
  Camera,
  Mail,
  Phone,
  BookOpen,
  Trophy,
  Zap,
  TrendingUp,
  ShieldCheck,
  Star,
  Check,
  X,
  Upload,
  BarChart3
} from 'lucide-react';
import confetti from 'canvas-confetti';

const ALL_ACHIEVEMENTS = [
  { id: 'ach-1', title: 'AI Prompt Wizard', icon: '🤖', description: 'Mastered prompt engineering and LLM adapter tuning.', category: 'AI & Data', points: '+500 XP' },
  { id: 'ach-2', title: 'Top Code Contributor', icon: '💻', description: 'Submitted 25+ clean GitHub repositories with documentation.', category: 'Coding', points: '+750 XP' },
  { id: 'ach-3', title: 'Syllabus Master', icon: '📚', description: 'Completed 100% of semester module milestones ahead of deadline.', category: 'Academic', points: '+1,000 XP' },
  { id: 'ach-4', title: 'Perfect Attendance Sentinel', icon: '🛡️', description: 'Maintained 95%+ class attendance across all enrolled courses.', category: 'Discipline', points: '+400 XP' },
  { id: 'ach-5', title: 'Proctor Integrity Champion', icon: '⚖️', description: 'Zero security infractions recorded during proctored exams.', category: 'Security', points: '+600 XP' },
  { id: 'ach-6', title: 'Clean Submission Streak', icon: '🔥', description: 'Submitted 10 consecutive assignments on first attempt.', category: 'Submissions', points: '+800 XP' },
  { id: 'ach-7', title: 'Faculty Grant Laureate', icon: '🏅', description: 'Published peer-reviewed research paper in international journal.', category: 'Research', points: '+1,500 XP' },
  { id: 'ach-8', title: 'Curriculum Innovator', icon: '⚡', description: 'Designed interactive PyTorch and React LMS learning labs.', category: 'Teaching', points: '+1,200 XP' }
];

export function UserProfile({ activeRole = 'Student', profile, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState('');
  const fileInputRef = useRef(null);

  // Form State for editing details
  const [formData, setFormData] = useState({
    name: profile?.name || (activeRole === 'Student' ? 'Alex Morgan' : (activeRole === 'Staff' ? 'Dr. Sarah Jenkins' : 'Dr. Evelyn Vance')),
    title: profile?.title || (activeRole === 'Student' ? '6th Sem • Computer Science & Eng' : (activeRole === 'Staff' ? 'Associate Professor of AI' : 'Head of Department')),
    department: profile?.department || 'Computer Science & Artificial Intelligence',
    email: profile?.email || (activeRole === 'Student' ? 'alex.morgan@learnsphere.edu' : (activeRole === 'Staff' ? 'sarah.jenkins@learnsphere.edu' : 'evelyn.vance@learnsphere.edu')),
    phone: profile?.phone || '+1 (555) 234-8901',
    bio: profile?.bio || 'Passionate about artificial intelligence, neural network architectures, and interactive web applications.',
    github: profile?.github || 'https://github.com',
    linkedin: profile?.linkedin || 'https://linkedin.com'
  });

  // Featured Badges State (IDs of badges showcased on profile)
  const [featuredBadges, setFeaturedBadges] = useState(
    profile?.featuredBadges || ['ach-1', 'ach-2', 'ach-3', 'ach-6']
  );

  const currentAvatar = profile?.avatar || (activeRole === 'Student' 
    ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" 
    : (activeRole === 'Staff' 
      ? "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"));

  const handleFilePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newAvatarUrl = event.target.result;
      if (onUpdateProfile) {
        onUpdateProfile({ avatar: newAvatarUrl });
      }
      setShowPhotoModal(false);
      confetti({ particleCount: 60, spread: 50 });
    };
    reader.readAsDataURL(file);
  };

  const handleApplyPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    if (onUpdateProfile) {
      onUpdateProfile({ avatar: photoUrlInput.trim() });
    }
    setPhotoUrlInput('');
    setShowPhotoModal(false);
    confetti({ particleCount: 60, spread: 50 });
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: formData.name,
        title: formData.title,
        department: formData.department,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        github: formData.github,
        linkedin: formData.linkedin,
        featuredBadges: featuredBadges
      });
    }
    setIsEditing(false);
    confetti({ particleCount: 80, spread: 60 });
  };

  const toggleBadgeSelection = (badgeId) => {
    let updated;
    if (featuredBadges.includes(badgeId)) {
      updated = featuredBadges.filter(id => id !== badgeId);
    } else {
      if (featuredBadges.length >= 4) {
        alert("You can select up to 4 featured badges for your profile header.");
        return;
      }
      updated = [...featuredBadges, badgeId];
    }
    setFeaturedBadges(updated);
    if (onUpdateProfile) {
      onUpdateProfile({ featuredBadges: updated });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* Profile Header Hero Card */}
      <div className="ls-card animate-fade-up" style={{
        background: activeRole === 'Student' 
          ? 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)' 
          : (activeRole === 'Staff' 
            ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #2563eb 100%)' 
            : 'linear-gradient(135deg, #311b92 0%, #4a148c 40%, #7b1fa2 100%)'),
        borderRadius: '24px',
        padding: '2.25rem',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem',
        boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.3)',
        position: 'relative'
      }}>
        
        {/* Left Avatar & Primary Details */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          
          {/* Avatar Container with Upload Camera Button */}
          <div style={{ position: 'relative' }}>
            <img 
              src={currentAvatar} 
              alt={formData.name}
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #818cf8',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
              }}
            />
            <button
              onClick={() => setShowPhotoModal(true)}
              title="Change Profile Photo"
              style={{
                position: 'absolute',
                bottom: '0',
                right: '0',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: '2px solid #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
              }}
            >
              <Camera style={{ width: '16px', height: '16px' }} />
            </button>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span className="chip" style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', fontWeight: 800, padding: '4px 12px' }}>
                {activeRole === 'Student' ? '🎓 Student' : (activeRole === 'Staff' ? '💼 Faculty / Staff' : '👑 Head of Department')}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc', fontWeight: 600 }}>
                ID: {profile?.id || (activeRole === 'Student' ? 'STU-88219' : (activeRole === 'Staff' ? 'FAC-102' : 'HOD-001'))}
              </span>
            </div>

            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
              {formData.name}
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', margin: '4px 0 0 0', fontWeight: 500 }}>
              {formData.title} • {formData.department}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginTop: '0.65rem', fontSize: '0.8rem', color: '#cbd5e1', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Mail style={{ width: '14px', height: '14px', color: '#93c5fd' }} /> {formData.email}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Phone style={{ width: '14px', height: '14px', color: '#86efac' }} /> {formData.phone}
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions & Social Links */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-accent"
              style={{ padding: '0.65rem 1.1rem', fontSize: '0.85rem' }}
            >
              <Edit3 style={{ width: '16px', height: '16px' }} /> {isEditing ? 'Cancel Editing' : 'Edit Profile'}
            </button>
            <a href={formData.github} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
              <Github style={{ width: '16px', height: '16px' }} /> GitHub
            </a>
            <a href={formData.linkedin} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
              <Linkedin style={{ width: '16px', height: '16px', color: '#0284c7' }} /> LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Profile Photo Upload Modal */}
      {showPhotoModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '1rem'
        }}>
          <div className="ls-card animate-fade-up" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem', backgroundColor: '#ffffff', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Update Profile Photo
              </h3>
              <button onClick={() => setShowPhotoModal(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Option 1: File Upload */}
              <div style={{
                border: '2px dashed #a5b4fc',
                borderRadius: '14px',
                padding: '1.5rem',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                cursor: 'pointer'
              }} onClick={() => fileInputRef.current?.click()}>
                <Upload style={{ width: '36px', height: '36px', color: '#4f46e5', margin: '0 auto 0.5rem auto' }} />
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                  Click to select image file from computer
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                  Supports PNG, JPG, WEBP (Max 5MB)
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFilePhotoSelect}
                  style={{ display: 'none' }}
                />
              </div>

              <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700 }}>OR PASTE IMAGE URL</div>

              {/* Option 2: Image URL */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  value={photoUrlInput}
                  onChange={(e) => setPhotoUrlInput(e.target.value)}
                  style={{ flex: 1, padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
                <button onClick={handleApplyPhotoUrl} className="btn-primary" style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}>
                  Apply URL
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inline Edit Details Form if Editing */}
      {isEditing && (
        <form onSubmit={handleSaveDetails} className="ls-card animate-fade-up" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', border: '2px solid #3b82f6' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e40af', margin: 0 }}>
            ✏️ Edit Profile Details
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Full Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '3px', fontSize: '0.85rem' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Academic Title / Semester</label>
              <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '3px', fontSize: '0.85rem' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Department</label>
              <input type="text" required value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '3px', fontSize: '0.85rem' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Email Address</label>
              <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '3px', fontSize: '0.85rem' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>Phone Number</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '3px', fontSize: '0.85rem' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>GitHub URL</label>
              <input type="url" value={formData.github} onChange={(e) => setFormData({ ...formData, github: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '3px', fontSize: '0.85rem' }} />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>About / Biography</label>
            <textarea rows={3} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '3px', fontSize: '0.85rem' }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary" style={{ padding: '0.55rem 1rem' }}>Cancel</button>
            <button type="submit" className="btn-primary" style={{ padding: '0.55rem 1.25rem' }}>Save Changes</button>
          </div>
        </form>
      )}

      {/* Role-Specific Progress & Performance Dashboard */}
      <div>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BarChart3 style={{ width: '22px', height: '22px', color: '#4f46e5' }} />
          {activeRole === 'Student' ? 'Student Progress & Academic Statistics' : (activeRole === 'Staff' ? 'Faculty Performance & Workload Progress' : 'Departmental Governance & Progress Metrics')}
        </h2>

        {/* 4 Stat Cards depending on Role */}
        <div className="grid-responsive">
          {activeRole === 'Student' ? (
            <>
              <div className="ls-card animate-fade-up">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Semester Completion</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>78%</div>
                <div className="progress-bar-bg" style={{ marginTop: '8px' }}>
                  <div className="progress-bar-fill" style={{ width: '78%' }} />
                </div>
              </div>
              <div className="ls-card animate-fade-up">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Current GPA</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>3.92 / 4.0</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>Rank #2 in Department</div>
              </div>
              <div className="ls-card animate-fade-up">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Total XP & Badges</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>14,850 XP</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>12 Badges Unlocked</div>
              </div>
              <div className="ls-card animate-fade-up">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Overall Attendance</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>88.9%</div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>✓ Above 75% Threshold</div>
              </div>
            </>
          ) : activeRole === 'Staff' ? (
            <>
              <div className="ls-card animate-fade-up">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Syllabus Completion</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>84.5%</div>
                <div className="progress-bar-bg" style={{ marginTop: '8px' }}>
                  <div className="progress-bar-fill" style={{ width: '84.5%' }} />
                </div>
              </div>
              <div className="ls-card animate-fade-up">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Student Evaluation Score</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>94.8%</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>340 Students Mentored</div>
              </div>
              <div className="ls-card animate-fade-up">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Grading Throughput</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>92 Submissions</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>12 Pending Evaluation</div>
              </div>
              <div className="ls-card animate-fade-up">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Active Courses Taught</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>4 Courses</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>CS-401, DS-302, ML-504</div>
              </div>
            </>
          ) : (
            <>
              <div className="ls-card animate-fade-up">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Dept Governance Rating</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#2563eb', marginTop: '4px' }}>96.2%</div>
                <div className="progress-bar-bg" style={{ marginTop: '8px' }}>
                  <div className="progress-bar-fill" style={{ width: '96.2%' }} />
                </div>
              </div>
              <div className="ls-card animate-fade-up">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Faculty Members Managed</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>18 Professors</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>850 Active Students</div>
              </div>
              <div className="ls-card animate-fade-up">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Courses Approved</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>18 Courses</div>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>100% Accreditation Met</div>
              </div>
              <div className="ls-card animate-fade-up">
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Proctor Security Cases</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', marginTop: '4px' }}>100% Resolved</div>
                <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>Zero Audit Escalations</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Selectable Achievements Reel */}
      <div className="ls-card animate-fade-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy style={{ width: '22px', height: '22px', color: '#d97706' }} />
              Achievement Badges Collection
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>
              Select badges to feature on your profile header highlight reel (up to 4 badges).
            </p>
          </div>

          <span className="chip chip-amber" style={{ fontWeight: 800 }}>
            {featuredBadges.length} / 4 Featured
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
          {ALL_ACHIEVEMENTS.map(badge => {
            const isFeatured = featuredBadges.includes(badge.id);
            return (
              <div
                key={badge.id}
                style={{
                  padding: '1rem',
                  borderRadius: '14px',
                  border: `2px solid ${isFeatured ? '#3b82f6' : '#e2e8f0'}`,
                  backgroundColor: isFeatured ? '#eff6ff' : '#ffffff',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '0.75rem',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: isFeatured ? '#dbeafe' : '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    {badge.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{badge.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>{badge.description}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb' }}>{badge.points}</span>
                  <button
                    onClick={() => toggleBadgeSelection(badge.id)}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: isFeatured ? '#2563eb' : '#f1f5f9',
                      color: isFeatured ? '#ffffff' : '#475569',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {isFeatured ? <><Star style={{ width: '12px', height: '12px', fill: '#ffffff' }} /> Featured</> : '+ Feature'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
