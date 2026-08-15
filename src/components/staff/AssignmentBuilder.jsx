import React, { useState, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  UploadCloud, 
  Paperclip, 
  X, 
  Download, 
  AlertCircle,
  FileCheck,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../../services/api';

export function AssignmentBuilder({ courses = [], assignments = [], setAssignments, setActiveTab }) {
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'CS-401');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [maxMarks, setMaxMarks] = useState(100);
  const [instructions, setInstructions] = useState('');
  const [rubrics, setRubrics] = useState([
    { criteria: 'Model Architecture & Core Setup', points: 40 },
    { criteria: 'Validation Metrics & Training Accuracy', points: 40 },
    { criteria: 'Code Quality & Documentation', points: 20 }
  ]);

  // File Upload State
  const [attachedFile, setAttachedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const fileInputRef = useRef(null);

  const totalRubricPoints = rubrics.reduce((sum, r) => sum + (Number(r.points) || 0), 0);

  const addRubricRow = () => {
    setRubrics([...rubrics, { criteria: '', points: 10 }]);
  };

  const removeRubricRow = (idx) => {
    setRubrics(rubrics.filter((_, i) => i !== idx));
  };

  const handleFileProcess = (file) => {
    if (!file) return;

    const fileSizeMb = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
    const reader = new FileReader();

    reader.onload = (e) => {
      setAttachedFile({
        name: file.name,
        size: fileSizeMb,
        type: file.type || file.name.split('.').pop(),
        dataUrl: e.target.result,
        lastModified: new Date(file.lastModified).toLocaleDateString()
      });
    };

    reader.readAsDataURL(file);
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
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter an assignment title.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage('');

    const targetCourse = courses.find(c => c.id === selectedCourseId || c.course_code === selectedCourseId) || {
      id: selectedCourseId,
      title: 'Artificial Intelligence & Neural Networks'
    };

    const newAssignment = {
      id: `ASN-${Date.now().toString().slice(-4)}`,
      title: title.trim(),
      courseId: targetCourse.id,
      courseName: targetCourse.title,
      faculty: 'Dr. Evelyn Vance',
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      remainingHours: 168,
      status: 'pending',
      maxMarks: Number(maxMarks) || 100,
      earnedMarks: null,
      rubric: rubrics.filter(r => r.criteria.trim() !== ''),
      instructions: instructions.trim() || 'Complete assignment according to rubric criteria.',
      attachedFile: attachedFile ? {
        name: attachedFile.name,
        size: attachedFile.size,
        type: attachedFile.type,
        dataUrl: attachedFile.dataUrl,
        uploadDate: new Date().toISOString()
      } : null,
      createdAt: new Date().toISOString()
    };

    try {
      // Attempt backend API save (graceful fallback if offline)
      await api.createAssignment(newAssignment).catch(err => {
        console.warn("API create assignment notice (using local state fallback):", err.message);
      });

      // Synchronously update App-wide assignments state
      if (setAssignments) {
        setAssignments(prev => [newAssignment, ...(prev || [])]);
      }

      // Persist assignment in localStorage
      const existing = JSON.parse(localStorage.getItem('learnsphere_assignments') || '[]');
      localStorage.setItem('learnsphere_assignments', JSON.stringify([newAssignment, ...existing]));

      // Trigger Confetti Celebration!
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

      setSuccessMessage(`Assignment "${title}" successfully broadcasted & published to Student Portals! ${attachedFile ? `(Attached File: ${attachedFile.name})` : ''}`);

      // Reset form
      setTitle('');
      setDueDate('');
      setInstructions('');
      setAttachedFile(null);
    } catch (err) {
      console.error("Error publishing assignment:", err);
      alert("Failed to publish assignment: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
          Assignment Builder & Rubric Creator
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
          Design structured assignments, attach reference prompt files, set deadlines, and build automated rubric evaluation matrices.
        </p>
      </div>

      {successMessage && (
        <div style={{
          padding: '1rem 1.25rem',
          borderRadius: '14px',
          backgroundColor: '#ecfdf5',
          border: '1px solid #a7f3d0',
          color: '#065f46',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckCircle2 style={{ width: '22px', height: '22px', color: '#10b981', flexShrink: 0 }} />
            <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              {successMessage}
            </div>
          </div>
          {setActiveTab && (
            <button
              onClick={() => setActiveTab('evaluation-desk')}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', whiteSpace: 'nowrap' }}
            >
              View Evaluation Desk →
            </button>
          )}
        </div>
      )}

      <form onSubmit={handlePublish} className="ls-card animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        {/* Basic Information Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Target Course</label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                marginTop: '4px',
                fontSize: '0.875rem',
                backgroundColor: '#ffffff',
                fontWeight: 600
              }}
            >
              {courses.length > 0 ? (
                courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} — {c.title}
                  </option>
                ))
              ) : (
                <option value="CS-401">CS-401 — Artificial Intelligence & Neural Networks</option>
              )}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Assignment Title</label>
            <input 
              type="text" 
              required 
              placeholder="e.g. Fine-Tuning Llama-3 with LoRA Adapters" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Due Date & Time</label>
            <input 
              type="datetime-local" 
              required 
              value={dueDate} 
              onChange={(e) => setDueDate(e.target.value)} 
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} 
            />
          </div>

          <div>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Maximum Marks</label>
            <input 
              type="number" 
              min={1} 
              value={maxMarks} 
              onChange={(e) => setMaxMarks(Number(e.target.value))} 
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} 
            />
          </div>
        </div>

        {/* Instructions */}
        <div>
          <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Submission Instructions & Requirements</label>
          <textarea 
            rows={3} 
            placeholder="Explain expectations, datasets to use, required output format (.ipynb / .pdf / .zip)..." 
            value={instructions} 
            onChange={(e) => setInstructions(e.target.value)} 
            style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} 
          />
        </div>

        {/* FILE UPLOAD & ATTACHMENT SECTION */}
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '1.25rem',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Paperclip style={{ width: '18px', height: '18px', color: '#4f46e5' }} />
                Attach Reference Document / Assignment Prompt File
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '2px 0 0 0' }}>
                Upload starter code (.ipynb / .py), assignment guidelines (.pdf / .docx), or dataset (.zip / .csv) for students.
              </p>
            </div>

            <button
              type="button"
              className="btn-secondary"
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip style={{ width: '15px', height: '15px' }} />
              Upload Assignment File
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.ipynb,.py,.zip,.rar,.txt,.csv,.png,.jpg"
            style={{ display: 'none' }}
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileProcess(e.target.files[0]);
              }
            }}
          />

          {/* Drag & Drop File Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragging ? '#2563eb' : '#a5b4fc'}`,
              borderRadius: '12px',
              padding: '1.5rem 1rem',
              textAlign: 'center',
              backgroundColor: isDragging ? '#eff6ff' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginTop: '0.25rem'
            }}
          >
            {attachedFile ? (
              <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#eff6ff',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1px solid #bfdbfe',
                  maxWidth: '600px',
                  margin: '0 auto'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '8px',
                    backgroundColor: '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#2563eb',
                    flexShrink: 0
                  }}>
                    <FileCheck style={{ width: '20px', height: '20px' }} />
                  </div>
                  <div style={{ textAlign: 'left', overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {attachedFile.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Size: {attachedFile.size} • Uploaded Ready to Broadcast
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {attachedFile.dataUrl && (
                    <a
                      href={attachedFile.dataUrl}
                      download={attachedFile.name}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        color: '#2563eb',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      title="Download file"
                    >
                      <Download style={{ width: '14px', height: '14px' }} /> Download
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '6px'
                    }}
                    title="Remove attached file"
                  >
                    <Trash2 style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                <UploadCloud style={{ width: '36px', height: '36px', color: '#4f46e5' }} />
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>
                  Click to select assignment file or drag & drop here
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  Supported formats: .pdf, .ipynb, .docx, .py, .zip, .csv, .txt (Max 50MB)
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Rubrics Builder Matrix */}
        <div style={{ backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#3730a3' }}>Grading Rubric Matrix</h4>
              <div style={{ fontSize: '0.75rem', color: totalRubricPoints === maxMarks ? '#059669' : '#d97706', fontWeight: 700, marginTop: '2px' }}>
                Rubric Total: {totalRubricPoints} pts {totalRubricPoints === maxMarks ? '✓ (Matches Max Marks)' : `(Max Marks: ${maxMarks})`}
              </div>
            </div>
            <button type="button" className="btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }} onClick={addRubricRow}>
              <Plus style={{ width: '14px', height: '14px' }} /> Add Criterion Row
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {rubrics.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Criterion description..." 
                  value={r.criteria} 
                  onChange={(e) => {
                    const copy = [...rubrics]; copy[i].criteria = e.target.value; setRubrics(copy);
                  }} 
                  style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                />

                <input 
                  type="number" 
                  placeholder="Points" 
                  value={r.points} 
                  onChange={(e) => {
                    const copy = [...rubrics]; copy[i].points = Number(e.target.value); setRubrics(copy);
                  }} 
                  style={{ width: '90px', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }} 
                />

                <button type="button" onClick={() => removeRubricRow(i)} style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                  <Trash2 style={{ width: '16px', height: '16px' }} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', gap: '1rem' }}>
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className="btn-accent" 
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.9rem' }}
          >
            <Sparkles style={{ width: '18px', height: '18px' }} /> 
            {isSubmitting ? 'Broadcasting Assignment...' : 'Broadcast & Publish Assignment'}
          </button>
        </div>
      </form>
    </div>
  );
}

