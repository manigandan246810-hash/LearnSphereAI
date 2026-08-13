import React, { useState } from 'react';
import { UserCheck, Search, Filter, Mail, Award, X, Sparkles, FileSpreadsheet } from 'lucide-react';
import { MOCK_STAFF_STUDENTS } from '../../data/mockData';

export function StudentManagement({ setActiveTab }) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filtered = MOCK_STAFF_STUDENTS.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(search.toLowerCase()) || st.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'All' || st.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Student Roster & Performance Desk
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Monitor student attendance, quiz averages, curriculum progress, and flag struggling students early.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {setActiveTab && (
            <button 
              className="btn-primary" 
              onClick={() => setActiveTab('smart-lists')}
              style={{ background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '10px', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px', border: 'none', cursor: 'pointer' }}
            >
              <FileSpreadsheet style={{ width: '16px', height: '16px' }} /> Generate Activity List
            </button>
          )}

          <div style={{ position: 'relative', width: '220px' }}>
            <Search style={{ position: 'absolute', left: '10px', top: '10px', width: '16px', height: '16px', color: '#94a3b8' }} />
            <input type="text" placeholder="Search student..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2.2rem', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} />
          </div>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ padding: '0.5rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontWeight: 600, fontSize: '0.85rem' }}>
            <option value="All">All Statuses</option>
            <option value="Top Performer">Top Performers</option>
            <option value="On Track">On Track</option>
            <option value="Needs Attention">Needs Attention</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="ls-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.775rem', color: '#64748b', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1.5rem' }}>Student ID & Name</th>
                <th style={{ padding: '0.85rem 1.5rem' }}>Attendance</th>
                <th style={{ padding: '0.85rem 1.5rem' }}>Avg Score</th>
                <th style={{ padding: '0.85rem 1.5rem' }}>Progress</th>
                <th style={{ padding: '0.85rem 1.5rem' }}>Status</th>
                <th style={{ padding: '0.85rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((st) => (
                <tr key={st.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{st.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{st.id} • {st.email}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: '#059669' }}>
                    {st.attendance}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: '#4f46e5' }}>
                    {st.avgScore}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', width: '180px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 }}>{st.progress}% Complete</div>
                    <div className="progress-bar-bg"><div className="progress-bar-fill" style={{ width: `${st.progress}%` }} /></div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span className={`chip ${st.status === 'Top Performer' ? 'chip-emerald' : (st.status === 'Needs Attention' ? 'chip-rose' : 'chip-sky')}`}>
                      {st.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={() => setSelectedStudent(st)}>
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Deep-Dive Drawer */}
      {selectedStudent && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="animate-fade-up" style={{ backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '520px', width: '100%', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '1.25rem 1.75rem', background: 'linear-gradient(135deg, #312e81 0%, #4338ca 100%)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{selectedStudent.name} ({selectedStudent.id})</div>
              <button onClick={() => setSelectedStudent(null)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X style={{ width: '20px', height: '20px' }} /></button>
            </div>

            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>Email: <strong>{selectedStudent.email}</strong></div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>Attendance Rate: <strong>{selectedStudent.attendance}</strong></div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>Overall Quiz Average: <strong>{selectedStudent.avgScore}</strong></div>
              <div style={{ fontSize: '0.875rem', color: '#475569' }}>Curriculum Progress: <strong>{selectedStudent.progress}%</strong></div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn-primary" onClick={() => setSelectedStudent(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
