import React, { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';

export function StudentProfile({ profile }) {
  const [activeTab, setActiveTab] = useState('Overview');

  const certificates = [
    { title: "Advanced Artificial Intelligence & Neural Networks", issuer: "LearnSphere AI Institute", date: "Jul 2026", certId: "LS-CERT-99481" },
    { title: "Full-Stack Web Development with React 18 & Next.js", issuer: "Meta & LearnSphere", date: "May 2026", certId: "LS-CERT-88210" },
    { title: "Python for Data Science & Machine Learning", issuer: "Python Software Foundation", date: "Jan 2026", certId: "LS-CERT-77102" }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Profile Header Hero */}
      <div className="ls-card animate-fade-up" style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4338ca 100%)',
        borderRadius: '24px',
        padding: '2rem',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <img 
            src={profile.avatar} 
            alt={profile.name}
            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #818cf8', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="chip chip-indigo" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff' }}>
                {profile.level}
              </span>
              <span style={{ fontSize: '0.8rem', color: '#a5b4fc' }}>ID: {profile.id}</span>
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.25rem' }}>
              {profile.name}
            </h1>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>
              {profile.department} • {profile.semester}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <a href={profile.github} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}>
            <Github style={{ width: '16px', height: '16px' }} /> GitHub
          </a>
          <a href={profile.linkedin} target="_blank" rel="noreferrer" className="btn-secondary" style={{ padding: '0.6rem 0.9rem', fontSize: '0.85rem' }}>
            <Linkedin style={{ width: '16px', height: '16px', color: '#0284c7' }} /> LinkedIn
          </a>
        </div>
      </div>

      {/* Profile Sections Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Skills & Bio */}
        <div className="ls-card animate-fade-up">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            About & Skill Stack
          </h3>
          <p style={{ color: '#475569', fontSize: '0.875rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            {profile.bio}
          </p>

          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>Verified Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {profile.skills.map((skill, i) => (
              <span key={i} className="chip chip-indigo" style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}>
                ⚡ {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Verified Certificates */}
        <div className="ls-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Verified Credentials & Certificates
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {certificates.map((cert, i) => (
              <div key={i} style={{
                padding: '0.85rem 1rem',
                borderRadius: '12px',
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0f172a' }}>{cert.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{cert.issuer} • {cert.date}</div>
                </div>
                <button className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}>
                  <Download style={{ width: '13px', height: '13px' }} /> PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
