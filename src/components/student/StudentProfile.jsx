import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Award, 
  ShieldCheck, 
  Github, 
  Linkedin, 
  Sparkles,
  BookOpen,
  Calendar,
  Download,
  ExternalLink
} from 'lucide-react';
import { MOCK_CERTIFICATES } from '../../data/mockData';
import { api } from '../../services/api';

export function StudentProfile({ profile }) {
  const [certificates, setCertificates] = useState(MOCK_CERTIFICATES);

  useEffect(() => {
    let isMounted = true;
    api.getCertificates(profile.id)
      .then(res => {
        if (isMounted && Array.isArray(res) && res.length > 0) {
          setCertificates(res);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [profile]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Profile Header Banner */}
      <div className="ls-card animate-fade-up" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        color: '#ffffff',
        padding: '2.5rem 2rem',
        borderRadius: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '2rem',
        flexWrap: 'wrap',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <img 
          src={profile.avatar} 
          alt={profile.name} 
          style={{ width: '100px', height: '100px', borderRadius: '50%', border: '4px solid #818cf8', objectFit: 'cover' }}
        />

        <div style={{ flex: 1, minWidth: '260px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff' }}>{profile.name}</h1>
            <span className="chip chip-emerald" style={{ fontSize: '0.75rem' }}>{profile.level}</span>
          </div>

          <div style={{ color: '#a5b4fc', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
            {profile.department} • {profile.semester}
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.85rem', maxWidth: '600px', lineHeight: 1.5, marginBottom: '1rem' }}>
            {profile.bio}
          </p>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href={profile.github} target="_blank" rel="noreferrer" style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', textDecoration: 'none' }}>
              <Github style={{ width: '16px', height: '16px' }} /> GitHub Profile
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" style={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', textDecoration: 'none' }}>
              <Linkedin style={{ width: '16px', height: '16px' }} /> LinkedIn
            </a>
          </div>
        </div>

        {/* Dynamic XP Badge */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: '1.25rem 2rem',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 600 }}>Total Experience Points</div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#fbbf24' }}>{profile.xp.toLocaleString()} XP</div>
        </div>
      </div>

      {/* Verified Certificates Section */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
          Verified Academic Certificates
        </h2>

        <div className="grid-responsive">
          {certificates.map((cert, idx) => (
            <div key={idx} className="ls-card ls-card-hover animate-fade-up" style={{ animationDelay: `${idx * 0.08}s` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#e0e7ff',
                  color: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800
                }}>
                  <Award style={{ width: '26px', height: '26px' }} />
                </div>

                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{cert.title}</h3>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Issued by: {cert.issuer} • {cert.date}</div>
                </div>
              </div>

              <div style={{ paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>ID: {cert.certId}</span>
                <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                  <Download style={{ width: '14px', height: '14px' }} /> Certificate PDF
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
