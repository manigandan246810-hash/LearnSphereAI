import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Building, 
  Users, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Megaphone,
  UserCheck,
  Send,
  Zap,
  Activity,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DEPARTMENT_GPA_DATA = [
  { course: 'AI Basics', avgGPA: 3.65 },
  { course: 'Deep Learning', avgGPA: 3.42 },
  { course: 'NLP Systems', avgGPA: 3.71 },
  { course: 'Computer Vision', avgGPA: 3.55 }
];

export function HODDashboard({ 
  profile, 
  activeTab, 
  setActiveTab, 
  courses, 
  setCourses,
  assignments, 
  setAssignments,
  quizzes,
  setQuizzes,
  malpracticeLogs,
  setMalpracticeLogs,
  reminders,
  setReminders
}) {

  // HOD specific states
  const [facultyMembers, setFacultyMembers] = useState([
    { id: 'FAC-01', name: 'Dr. Evelyn Vance', role: 'Professor', teachingLoad: '12 Credits', courses: ['Artificial Intelligence & Neural Networks'], status: 'Active' },
    { id: 'FAC-02', name: 'Dr. Sarah Jenkins', role: 'Associate Professor', teachingLoad: '9 Credits', courses: ['Deep Learning Theory & Lab'], status: 'Active' },
    { id: 'FAC-03', name: 'Prof. Michael Chang', role: 'Assistant Professor', teachingLoad: '15 Credits', courses: ['Natural Language Processing'], status: 'On Leave' },
    { id: 'FAC-04', name: 'Dr. Aris Thorne', role: 'Assistant Professor', teachingLoad: '12 Credits', courses: ['Computer Vision Foundations'], status: 'Active' }
  ]);

  const [broadcasterTitle, setBroadcasterTitle] = useState('');
  const [broadcasterContent, setBroadcasterContent] = useState('');
  const [broadcasterTarget, setBroadcasterTarget] = useState('all');
  const [broadcasterType, setBroadcasterType] = useState('info');

  const [allocationFacultyId, setAllocationFacultyId] = useState('FAC-01');
  const [allocationCourseId, setAllocationCourseId] = useState('AI-101');

  // HOD Actions
  const handleApproveCourse = (courseId) => {
    const updated = courses.map(c => {
      if (c.id === courseId) {
        return { ...c, approvedByHOD: true };
      }
      return c;
    });
    setCourses(updated);
    
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
    alert(`Course curriculum approved successfully by Head of Department!`);
  };

  const handleAllocateCourse = (e) => {
    e.preventDefault();
    const faculty = facultyMembers.find(f => f.id === allocationFacultyId);
    const course = courses.find(c => c.id === allocationCourseId);
    
    if (!faculty || !course) return;

    // Update Faculty list
    const updatedFaculty = facultyMembers.map(f => {
      if (f.id === allocationFacultyId) {
        return {
          ...f,
          courses: f.courses.includes(course.title) ? f.courses : [...f.courses, course.title]
        };
      }
      return f;
    });
    setFacultyMembers(updatedFaculty);
    
    alert(`Successfully assigned "${course.title}" teaching allocation to ${faculty.name}.`);
  };

  const handleBroadcastNotice = (e) => {
    e.preventDefault();
    if (!broadcasterTitle.trim() || !broadcasterContent.trim()) {
      alert("Please enter title and content.");
      return;
    }

    const newReminder = {
      id: `HOD-NOTE-${Date.now()}`,
      title: `🏛️ HOD Notice: ${broadcasterTitle}`,
      text: broadcasterContent,
      time: 'Just now',
      color: broadcasterType === 'warning' ? '#ef4444' : (broadcasterType === 'important' ? '#b45309' : '#2563eb')
    };

    setReminders(prev => [newReminder, ...prev]);
    
    alert(`Notice broadcasted successfully to active feeds!`);
    setBroadcasterTitle('');
    setBroadcasterContent('');
  };

  const handleInvestigateLog = (logId) => {
    const updated = malpracticeLogs.map(l => {
      if (l.id === logId) {
        return { ...l, severity: 'Pending Investigation' };
      }
      return l;
    });
    setMalpracticeLogs(updated);
    alert("Investigation request sent to assigned course invigilator.");
  };

  const handleClearLog = (logId) => {
    const updated = malpracticeLogs.filter(l => l.id !== logId);
    setMalpracticeLogs(updated);
    alert("Infraction record cleared from department log.");
  };

  // Metrics
  const totalApproved = courses.filter(c => c.approvedByHOD).length;
  const totalFacultyCount = facultyMembers.length;
  const highRiskSecurityIncidents = malpracticeLogs.filter(l => l.severity === 'High').length;

  // HOD Render Sections
  const renderDashboardOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Dynamic Summary Cards */}
      <div className="grid-responsive" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="ls-card ls-card-hover" onClick={() => setActiveTab('hod-courses')} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '5px solid #2563eb', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>CURRICULUM APPROVALS</span>
            <BookOpen style={{ width: '18px', height: '18px', color: '#2563eb' }} />
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>{totalApproved} / {courses.length} Approved</span>
          <span style={{ fontSize: '0.725rem', color: '#64748b' }}>Pending HOD authentication</span>
        </div>

        <div className="ls-card ls-card-hover" onClick={() => setActiveTab('hod-faculty')} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '5px solid #10b981', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>FACULTY STRENGTH</span>
            <Users style={{ width: '18px', height: '18px', color: '#10b981' }} />
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>{totalFacultyCount} Members</span>
          <span style={{ fontSize: '0.725rem', color: '#10b981', fontWeight: 600 }}>100% Workload distributed</span>
        </div>

        <div className="ls-card ls-card-hover" onClick={() => setActiveTab('hod-security')} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '5px solid #ef4444', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>PROCTOR SECURITY RISK</span>
            <ShieldAlert style={{ width: '18px', height: '18px', color: '#ef4444' }} />
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>{highRiskSecurityIncidents} High Alerts</span>
          <span style={{ fontSize: '0.725rem', color: '#ef4444', fontWeight: 600 }}>Unresolved infractions</span>
        </div>

        <div className="ls-card ls-card-hover" onClick={() => setActiveTab('hod-courses')} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '5px solid #f59e0b', cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>DEPT CUMULATIVE GPA</span>
            <Award style={{ width: '18px', height: '18px', color: '#f59e0b' }} />
          </div>
          <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b' }}>3.58 GPA</span>
          <span style={{ fontSize: '0.725rem', color: '#64748b' }}>CSE - AI Department Average</span>
        </div>
      </div>

      {/* Visual Analytics & Department Feeds Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
        
        {/* Recharts Department GPA Chart */}
        <div className="ls-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>GPA Performance Averages</h3>
              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>Course performance indicators across standard AI modules</p>
            </div>
            <Activity style={{ width: '20px', height: '20px', color: '#2563eb' }} />
          </div>
          
          <div style={{ width: '100%', height: '240px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPARTMENT_GPA_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="course" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis domain={[3.0, 4.0]} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="avgGPA" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security Violations Quick view */}
        <div className="ls-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Flagged Proctor Violations</h3>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>Immediate response required for high-severity violations</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '250px' }}>
            {malpracticeLogs.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                No proctor infractions recorded.
              </div>
            ) : (
              malpracticeLogs.map(log => (
                <div key={log.id} style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  backgroundColor: '#fff5f5',
                  border: '1px solid #fee2e2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#991b1b', fontSize: '0.85rem' }}>{log.studentName}</div>
                    <div style={{ fontSize: '0.725rem', color: '#7f1d1d' }}>{log.quizTitle} • {log.infractionsCount} Offenses</div>
                  </div>
                  <button 
                    onClick={() => setActiveTab('hod-security')}
                    style={{
                      border: 'none',
                      backgroundColor: '#ef4444',
                      color: '#ffffff',
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    Action <ArrowRight style={{ width: '12px', height: '12px' }} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );

  const renderCoursesCatalog = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>Course Catalog Approvals</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Review and authorize syllabus structures proposed by faculty members.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        {courses.map(course => (
          <div key={course.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #cbd5e1',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '1rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>{course.id}</span>
                <span className={`chip ${course.approvedByHOD ? 'chip-success' : 'chip-amber'}`} style={{ fontSize: '0.7rem' }}>
                  {course.approvedByHOD ? '🏛️ HOD Approved' : '⏳ Pending Review'}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>{course.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0 0 1rem 0' }}>Weekly Modules: {course.weeklyTimeline?.length || 0} topics registered.</p>
              
              <div style={{ backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '10px', fontSize: '0.75rem' }}>
                <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>Timeline Preview:</div>
                {course.weeklyTimeline?.slice(0, 2).map((w, idx) => (
                  <div key={idx} style={{ color: '#475569' }}>Week {w.week}: {w.topic}</div>
                ))}
                {(course.weeklyTimeline?.length || 0) > 2 && <div style={{ color: '#94a3b8', fontStyle: 'italic', marginTop: '2px' }}>+ {(course.weeklyTimeline?.length || 0) - 2} more weeks</div>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => handleApproveCourse(course.id)}
                disabled={course.approvedByHOD}
                style={{
                  flex: 1,
                  padding: '0.6rem',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: course.approvedByHOD ? '#f1f5f9' : '#2563eb',
                  color: course.approvedByHOD ? '#94a3b8' : '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: course.approvedByHOD ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <CheckCircle style={{ width: '16px', height: '16px' }} />
                {course.approvedByHOD ? 'Curriculum Authorized' : 'Approve Curriculum'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFacultyWorkload = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Allocation Allocator Form */}
      <div className="ls-card" style={{ padding: '1.5rem', background: '#f8fafc', border: '1px dashed #cbd5e1' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Zap style={{ width: '18px', height: '18px', color: '#b45309' }} /> Define Teaching Allocations
        </h3>
        <form onSubmit={handleAllocateCourse} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Select HOD Faculty Member</label>
            <select 
              value={allocationFacultyId}
              onChange={(e) => setAllocationFacultyId(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.825rem' }}
            >
              {facultyMembers.map(f => <option key={f.id} value={f.id}>{f.name} ({f.role})</option>)}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Allocate Curriculum Course</label>
            <select 
              value={allocationCourseId}
              onChange={(e) => setAllocationCourseId(e.target.value)}
              style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.825rem' }}
            >
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', background: '#2563eb', fontWeight: 700, fontSize: '0.825rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <UserCheck style={{ width: '16px', height: '16px' }} /> Assign Workload
          </button>
        </form>
      </div>

      {/* Faculty Workload Roster */}
      <div className="ls-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Faculty Workload & Roster</h3>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Faculty ID</th>
              <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Member Details</th>
              <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Assigned Courses</th>
              <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Teaching Load</th>
              <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {facultyMembers.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '1rem 1.25rem', fontSize: '0.825rem', fontWeight: 700, color: '#2563eb' }}>{member.id}</td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.875rem' }}>{member.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{member.role}</div>
                </td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                    {member.courses.map((c, i) => (
                      <span key={i} className="chip chip-blue" style={{ fontSize: '0.7rem' }}>{c}</span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '1rem 1.25rem', fontSize: '0.825rem', fontWeight: 600, color: '#475569' }}>{member.teachingLoad}</td>
                <td style={{ padding: '1rem 1.25rem' }}>
                  <span className={`chip ${member.status === 'Active' ? 'chip-success' : 'chip-amber'}`} style={{ fontSize: '0.7rem' }}>
                    {member.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );

  const renderSecurityProctoring = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>Security Audits & Proctor Logs</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>HOD command center for proctor compliance alerts and cheating investigation audits.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {malpracticeLogs.length === 0 ? (
          <div className="ls-card" style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <CheckCircle style={{ width: '48px', height: '48px', color: '#10b981', margin: '0 auto 1rem auto' }} />
            <div style={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a' }}>All Clear! No Infractions Logged</div>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '4px 0 0 0' }}>Students are complying with test protection policies.</p>
          </div>
        ) : (
          malpracticeLogs.map(log => (
            <div key={log.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #cbd5e1',
              padding: '1.25rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '12px', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AlertTriangle style={{ width: '22px', height: '22px', color: '#ef4444' }} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>{log.studentName}</span>
                    <span style={{ fontSize: '0.725rem', color: '#64748b' }}>ID: {log.studentId}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '2px' }}>
                    Exam: <strong>{log.quizTitle}</strong> • Flags: <span style={{ color: '#b91c1c', fontWeight: 700 }}>{log.infractionsCount} tab focus switches</span>
                  </div>
                  <div style={{ fontSize: '0.725rem', color: '#94a3b8', marginTop: '4px' }}>
                    Timestamp: {log.time} • Invigilation Status: <strong style={{ color: '#b45309' }}>{log.severity} Severity</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleInvestigateLog(log.id)}
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '8px',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Delegate Investigation
                </button>
                <button
                  onClick={() => handleClearLog(log.id)}
                  style={{
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.5rem 0.85rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    backgroundColor: '#fee2e2',
                    color: '#ef4444',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  Dismiss / Clear
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const renderAnnouncements = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>HOD Broadcaster Center</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Broadcast official departmental circulars and emergency guidelines.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        
        {/* Composer Card */}
        <div className="ls-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Megaphone style={{ width: '20px', height: '20px', color: '#2563eb' }} /> Compose Notice
          </h3>

          <form onSubmit={handleBroadcastNotice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Notice Title</label>
              <input 
                type="text"
                required
                placeholder="e.g. End Semester Exam Regulations"
                value={broadcasterTitle}
                onChange={(e) => setBroadcasterTitle(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.825rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Broadcast Priority</label>
              <select
                value={broadcasterType}
                onChange={(e) => setBroadcasterType(e.target.value)}
                style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.825rem' }}
              >
                <option value="info">💡 Informational Notice</option>
                <option value="important">⚠️ Important Announcement</option>
                <option value="warning">🚨 Urgent Security Warning</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>Notice Body</label>
              <textarea 
                rows="4"
                required
                placeholder="Write official announcement details here..."
                value={broadcasterContent}
                onChange={(e) => setBroadcasterContent(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.825rem', fontFamily: 'sans-serif' }}
              />
            </div>

            <button type="submit" className="btn-primary" style={{ padding: '0.65rem', borderRadius: '8px', background: '#2563eb', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
              <Send style={{ width: '16px', height: '16px' }} /> Broadcast Notice
            </button>
          </form>
        </div>

        {/* Existing Notices Feed Preview */}
        <div className="ls-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Active Department Feed</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '350px' }}>
            {reminders.map((note) => (
              <div key={note.id} style={{
                padding: '0.85rem 1.15rem',
                borderRadius: '12px',
                borderLeft: `4px solid ${note.color}`,
                backgroundColor: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderLeftWidth: '5px'
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0f172a' }}>{note.title}</div>
                <p style={{ fontSize: '0.775rem', color: '#475569', margin: '4px 0' }}>{note.text}</p>
                <span style={{ fontSize: '0.675rem', color: '#94a3b8' }}>{note.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Head Banner Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <Building style={{ width: '16px', height: '16px', color: '#b45309' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase' }}>CSE Department Administration</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {activeTab === 'hod-courses' ? 'Catalog Authorization' : 
             activeTab === 'hod-faculty' ? 'Faculty Teaching Loads' :
             activeTab === 'hod-security' ? 'Invigilation & Anti-Cheat Audits' :
             activeTab === 'hod-announcements' ? 'Broadcaster Command' : 'HOD Executive Dashboard'}
          </h1>
        </div>
        
        <div style={{ fontSize: '0.85rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', color: '#b45309', padding: '6px 12px', borderRadius: '10px', fontWeight: 700 }}>
          Logged: {profile?.name || 'Dr. Evelyn Vance'} (HOD)
        </div>
      </div>

      {/* Main Switcher Box */}
      <div className="animate-fade-up">
        {activeTab === 'hod-courses' && renderCoursesCatalog()}
        {activeTab === 'hod-faculty' && renderFacultyWorkload()}
        {activeTab === 'hod-security' && renderSecurityProctoring()}
        {activeTab === 'hod-announcements' && renderAnnouncements()}
        {(activeTab === 'hod-dashboard' || !['hod-courses', 'hod-faculty', 'hod-security', 'hod-announcements'].includes(activeTab)) && renderDashboardOverview()}
      </div>

    </div>
  );
}
