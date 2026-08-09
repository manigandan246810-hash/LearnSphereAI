import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Edit3, 
  Copy, 
  Archive, 
  Eye, 
  X, 
  Check, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { MOCK_COURSES } from '../../data/mockData';

export function CourseManager() {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('AI & Data Science');
  const [newDescription, setNewDescription] = useState('');

  const handleCreateCourse = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourse = {
      id: `CS-${Math.floor(100 + Math.random() * 900)}`,
      title: newTitle,
      instructor: "Dr. Evelyn Vance",
      category: newCategory,
      progress: 0,
      totalModules: 10,
      completedModules: 0,
      estimatedTimeLeft: "10h 0m",
      enrolledStudents: 1,
      rating: 5.0,
      coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80",
      description: newDescription || "Newly created course module for LearnSphere curriculum."
    };

    setCourses([newCourse, ...courses]);
    setNewTitle('');
    setNewDescription('');
    setShowCreateModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Course Management Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Create new courses, update syllabi, archive outdated modules, or preview student view.
          </p>
        </div>

        <button className="btn-primary" onClick={() => setShowCreateModal(true)}>
          <Plus style={{ width: '18px', height: '18px' }} /> Create New Course
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid-responsive">
        {courses.map((course) => (
          <div key={course.id} className="ls-card animate-fade-up" style={{ padding: 0, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ height: '150px', position: 'relative' }}>
              <img src={course.coverImage} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <span className="chip chip-indigo" style={{ position: 'absolute', top: '10px', left: '10px' }}>
                {course.id}
              </span>
            </div>

            <div style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.3 }}>
                {course.title}
              </h3>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {course.description}
              </p>

              <div style={{ fontSize: '0.775rem', color: '#475569', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span>👥 <strong>{course.enrolledStudents}</strong> Students</span>
                <span>⭐ <strong>{course.rating}</strong> Rating</span>
              </div>

              {/* Course Admin Action Buttons */}
              <div style={{ display: 'flex', gap: '0.4rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                <button className="btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', justifyContent: 'center' }}>
                  <Edit3 style={{ width: '14px', height: '14px' }} /> Edit
                </button>
                <button className="btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', justifyContent: 'center' }}>
                  <Copy style={{ width: '14px', height: '14px' }} /> Duplicate
                </button>
                <button className="btn-secondary" style={{ flex: 1, padding: '0.4rem', fontSize: '0.75rem', justifyContent: 'center' }}>
                  <Archive style={{ width: '14px', height: '14px' }} /> Archive
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Course Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <form onSubmit={handleCreateCourse} className="animate-fade-up" style={{ backgroundColor: '#ffffff', borderRadius: '24px', maxWidth: '540px', width: '100%', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '1.25rem 1.75rem', background: 'linear-gradient(135deg, #312e81 0%, #4338ca 100%)', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>Create New Curriculum Course</div>
              <button type="button" onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}><X style={{ width: '20px', height: '20px' }} /></button>
            </div>

            <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Course Title</label>
                <input type="text" required placeholder="e.g. Advanced Transformer Architectures" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Category</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }}>
                  <option value="AI & Data Science">AI & Data Science</option>
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Description</label>
                <textarea rows={3} placeholder="Provide a brief summary of course outcomes..." value={newDescription} onChange={(e) => setNewDescription(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1px solid #cbd5e1', marginTop: '4px', fontSize: '0.875rem' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary"><Sparkles style={{ width: '16px', height: '16px' }} /> Publish Course</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
