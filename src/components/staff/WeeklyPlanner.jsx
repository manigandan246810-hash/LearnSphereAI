import React, { useState } from 'react';
import { Clock, Plus, Upload, Link, Check, Sparkles, FileText, Video, Paperclip, X } from 'lucide-react';
import { api } from '../../services/api';
import confetti from 'canvas-confetti';

export function WeeklyPlanner({ courses = [], onRefreshData }) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || courses[0]?.uuid || '');
  const [weekNumber, setWeekNumber] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [notesPdfUrl, setNotesPdfUrl] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedCourse = courses.find(c => c.id === selectedCourseId || c.uuid === selectedCourseId) || courses[0];
  const weeks = selectedCourse?.weeklyTimeline || [];

  const handleFileSelect = (file) => {
    if (!file) return;
    setUploadedFile({
      name: file.name,
      size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      type: file.type || 'Document'
    });
    setNotesPdfUrl(URL.createObjectURL(file));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleAddWeek = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      alert("Please select a course catalog entry.");
      return;
    }
    if (!weekNumber) {
      alert("Please specify the syllabus week number.");
      return;
    }
    if (!newTopic.trim()) {
      alert("Please input a valid lecture topic title.");
      return;
    }

    setLoading(true);
    try {
      const targetCourse = courses.find(c => c.id === selectedCourseId || c.uuid === selectedCourseId);
      const targetCourseId = targetCourse ? (targetCourse.uuid || targetCourse.id) : selectedCourseId;

      const finalPdfUrl = notesPdfUrl || (uploadedFile ? uploadedFile.name : 'https://storage.learnsphere.edu/syllabus/notes.pdf');

      await api.publishWeeklySyllabus(
        targetCourseId,
        Number(weekNumber),
        newTopic,
        videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
        finalPdfUrl
      );

      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      alert(`✨ Week ${weekNumber} Curriculum published successfully with attached file: ${uploadedFile ? uploadedFile.name : 'PDF Slides'}!`);

      setWeekNumber('');
      setNewTopic('');
      setVideoUrl('');
      setNotesPdfUrl('');
      setUploadedFile(null);

      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (err) {
      console.error("Error publishing syllabus:", err);
      alert("Failed to publish syllabus: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Weekly Syllabus & Content Planner
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
            Structure topics, upload video lecture URLs, attach reading PDFs, and publish weekly modules.
          </p>
        </div>

        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          style={{ 
            padding: '0.6rem 1rem', 
            borderRadius: '12px', 
            border: '1px solid #cbd5e1', 
            backgroundColor: '#ffffff', 
            fontWeight: 700, 
            fontSize: '0.875rem', 
            color: '#4f46e5',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {courses.map(c => (
            <option key={c.id || c.uuid} value={c.id || c.uuid}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {/* Add New Week Module Builder */}
      <div className="ls-card animate-fade-up">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles style={{ width: '18px', height: '18px', color: '#4f46e5' }} />
          Publish Syllabus Week & Lecture Assets
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Syllabus Week Number</label>
            <input 
              type="number" 
              placeholder="e.g. 6" 
              value={weekNumber} 
              onChange={(e) => setWeekNumber(e.target.value)} 
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem', outline: 'none' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Topic / Lesson Title</label>
            <input 
              type="text" 
              placeholder="e.g. Deep Residual Learning (ResNets)" 
              value={newTopic} 
              onChange={(e) => setNewTopic(e.target.value)} 
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem', outline: 'none' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Video Lecture Link (YouTube/MP4)</label>
            <input 
              type="text" 
              placeholder="https://youtube.com/watch?v=..." 
              value={videoUrl} 
              onChange={(e) => setVideoUrl(e.target.value)} 
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem', outline: 'none' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Lecture Notes PDF URL / Link</label>
            <input 
              type="text" 
              placeholder="https://storage.edu/notes.pdf" 
              value={notesPdfUrl} 
              onChange={(e) => setNotesPdfUrl(e.target.value)} 
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem', outline: 'none' }} 
            />
          </div>
        </div>

        {/* Interactive File Dropzone Box */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '6px' }}>
            Upload Lecture File (PDF, PPT, DOCX, Video)
          </label>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${isDragging ? '#2563eb' : '#cbd5e1'}`,
              backgroundColor: isDragging ? '#eff6ff' : '#f8fafc',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative'
            }}
            onClick={() => document.getElementById('file-upload-input').click()}
          >
            <input 
              id="file-upload-input"
              type="file"
              accept=".pdf,.ppt,.pptx,.doc,.docx,.mp4,.zip"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            {uploadedFile ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', backgroundColor: '#ffffff', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #bfdbfe', maxWidth: '400px', margin: '0 auto' }}>
                <Paperclip style={{ width: '20px', height: '20px', color: '#2563eb' }} />
                <div style={{ textAlign: 'left', flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {uploadedFile.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{uploadedFile.size} • Ready for upload</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setUploadedFile(null);
                    setNotesPdfUrl('');
                  }}
                  style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                >
                  <X style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Upload style={{ width: '20px', height: '20px', color: '#4f46e5' }} />
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                  Click to select file or drag & drop here
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Supports PDF, PPTX, DOCX, MP4, ZIP (up to 100 MB)
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          className="btn-primary" 
          onClick={handleAddWeek}
          disabled={loading}
          style={{ width: '100%', justifyContent: 'center' }}
        >
          <Plus style={{ width: '16px', height: '16px' }} /> 
          {loading ? 'Publishing Syllabus Assets...' : 'Publish Weekly Module Details'}
        </button>
      </div>

      {/* Current Weekly Curriculum List */}
      <div className="ls-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock style={{ width: '18px', height: '18px', color: '#64748b' }} />
          Active Curriculum Schedule for Selected Course ({weeks.length} Weeks)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {weeks.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.9rem' }}>
              No syllabus weeks published for this course yet.
            </div>
          ) : (
            weeks.map((item) => (
              <div 
                key={item.week} 
                style={{ 
                  padding: '1rem 1.25rem', 
                  borderRadius: '12px', 
                  backgroundColor: '#f8fafc', 
                  border: '1px solid #cbd5e1', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  flexWrap: 'wrap', 
                  gap: '1rem' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span className="chip chip-indigo" style={{ fontWeight: 800, padding: '0.35rem 0.75rem', borderRadius: '8px' }}>
                    Week {item.week}
                  </span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.975rem', color: '#0f172a' }}>{item.topic}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', gap: '0.75rem', marginTop: '4px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Video style={{ width: '13px', height: '13px' }} /> Video Link Attached</span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><FileText style={{ width: '13px', height: '13px' }} /> Lecture Slides (PDF)</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className={`chip ${item.status === 'completed' ? 'chip-emerald' : 'chip-sky'}`}>
                    {item.status || 'Active'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
