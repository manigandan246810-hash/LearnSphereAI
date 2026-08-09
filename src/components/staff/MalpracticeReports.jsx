import React, { useState } from 'react';
import { ShieldAlert, User, Clock, AlertTriangle, CheckCircle, Trash2, HelpCircle } from 'lucide-react';

export function MalpracticeReports({ malpracticeLogs, setMalpracticeLogs }) {
  const [filter, setFilter] = useState('All');

  const filteredLogs = malpracticeLogs.filter(log => {
    if (filter === 'All') return true;
    return log.severity === filter;
  });

  const clearAllLogs = () => {
    if (window.confirm("Are you sure you want to clear all malpractice logs?")) {
      setMalpracticeLogs([]);
    }
  };

  const resolveLog = (id) => {
    setMalpracticeLogs(prev => prev.map(log => 
      log.id === id ? { ...log, status: 'Resolved' } : log
    ));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldAlert style={{ width: '28px', height: '28px', color: '#ef4444' }} />
            Exam Security & Malpractice Reports
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Monitor real-time security logs from proctored exams, including focus losses, tab switching, and copy attempts.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            style={{ padding: '0.5rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', fontWeight: 600, fontSize: '0.85rem', outline: 'none' }}
          >
            <option value="All">All Severities</option>
            <option value="High">High (&gt;= 3 Infractions)</option>
            <option value="Medium">Medium (2 Infractions)</option>
            <option value="Low">Low (1 Infraction)</option>
          </select>

          {malpracticeLogs.length > 0 && (
            <button className="btn-secondary" style={{ color: '#ef4444', borderColor: '#fca5a5' }} onClick={clearAllLogs}>
              <Trash2 style={{ width: '16px', height: '16px' }} /> Clear Logs
            </button>
          )}
        </div>
      </div>

      {/* Roster Table */}
      <div className="ls-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1.5rem', color: '#64748b' }}>
            <ShieldAlert style={{ width: '48px', height: '48px', color: '#10b981', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>No Security Violations</h3>
            <p style={{ fontSize: '0.875rem' }}>All active proctored tests are currently clean. No student malpractice reported.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.775rem', color: '#64748b', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.85rem 1.5rem' }}>Student & Course</th>
                  <th style={{ padding: '0.85rem 1.5rem' }}>Exam / Quiz</th>
                  <th style={{ padding: '0.85rem 1.5rem' }}>Infraction Count</th>
                  <th style={{ padding: '0.85rem 1.5rem' }}>Violations Details</th>
                  <th style={{ padding: '0.85rem 1.5rem' }}>Severity</th>
                  <th style={{ padding: '0.85rem 1.5rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1.5rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{log.studentName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>ID: {log.studentId}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 700, color: '#1e3a8a', fontSize: '0.875rem' }}>{log.quizTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <Clock style={{ width: '12px', height: '12px' }} /> {log.time}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 800, color: log.infractionsCount >= 3 ? '#ef4444' : '#f59e0b' }}>
                      {log.infractionsCount} / 3 Max
                    </td>
                    <td style={{ padding: '1rem 1.5rem', maxWidth: '280px', fontSize: '0.8rem', color: '#475569', lineHeight: 1.4 }}>
                      {log.infractions.map((inf, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <AlertTriangle style={{ width: '12px', height: '12px', color: '#ef4444', flexShrink: 0 }} />
                          <span>{inf}</span>
                        </div>
                      ))}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span className={`chip ${log.severity === 'High' ? 'chip-rose' : (log.severity === 'Medium' ? 'chip-amber' : 'chip-sky')}`}>
                        {log.severity}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: 700, 
                        color: log.status === 'Resolved' ? '#059669' : '#d97706',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        {log.status === 'Resolved' && <CheckCircle style={{ width: '14px', height: '14px' }} />}
                        {log.status}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      {log.status === 'Pending' ? (
                        <button className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: '#2563eb', borderColor: '#bfdbfe' }} onClick={() => resolveLog(log.id)}>
                          Review & Resolve
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Resolved</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
