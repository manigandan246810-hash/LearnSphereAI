import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  Bookmark, 
  Heart, 
  PlayCircle, 
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { MOCK_COURSES } from '../../data/mockData';

export function CourseGrid({ setActiveTab, setSelectedCourse }) {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'AI & Data Science', 'Software Engineering', 'Programming', 'Cloud & Infrastructure', 'Security'];

  const filteredCourses = courses.filter(c => {
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleBookmark = (id) => {
    setCourses(courses.map(c => c.id === id ? { ...c, isBookmarked: !c.isBookmarked } : c));
  };

  const toggleFavorite = (id) => {
    setCourses(courses.map(c => c.id === id ? { ...c, isFavorite: !c.isFavorite } : c));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
            Registered Courses
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Explore your active curriculum, video lectures, and syllabus schedules.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ position: 'relative', width: '260px' }}>
            <Search style={{ position: 'absolute', left: '10px', top: '10px', width: '16px', height: '16px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search course title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2.2rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem'
              }}
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: activeCategory === cat ? '#4f46e5' : '#ffffff',
              color: activeCategory === cat ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '0.825rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeCategory === cat ? '0 4px 12px rgba(79,70,229,0.3)' : '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid-responsive" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {filteredCourses.map((course, idx) => (
          <div 
            key={course.id} 
            className="ls-card ls-card-hover animate-fade-up"
            style={{ padding: 0, animationDelay: `${idx * 0.06}s`, display: 'flex', flexDirection: 'column' }}
          >
            {/* Image Banner */}
            <div style={{ height: '175px', position: 'relative', overflow: 'hidden' }}>
              <img 
                src={course.coverImage} 
                alt={course.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
              />
              <span style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                backgroundColor: 'rgba(15, 23, 42, 0.8)',
                color: '#ffffff',
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.725rem',
                fontWeight: 700,
                backdropFilter: 'blur(4px)'
              }}>
                {course.category}
              </span>

              {/* Action Buttons Overlay */}
              <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '6px' }}>
                <button 
                  onClick={() => toggleBookmark(course.id)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Bookmark style={{ width: '16px', height: '16px', color: course.isBookmarked ? '#4f46e5' : '#64748b', fill: course.isBookmarked ? '#4f46e5' : 'none' }} />
                </button>
                <button 
                  onClick={() => toggleFavorite(course.id)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <Heart style={{ width: '16px', height: '16px', color: course.isFavorite ? '#ef4444' : '#64748b', fill: course.isFavorite ? '#ef4444' : 'none' }} />
                </button>
              </div>
            </div>

            {/* Content Details */}
            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: '0.775rem', color: '#64748b', fontWeight: 600 }}>{course.instructor}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#eab308', fontWeight: 700, fontSize: '0.8rem' }}>
                    <Star style={{ width: '13px', height: '13px', fill: '#eab308' }} /> {course.rating}
                  </div>
                </div>

                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  {course.title}
                </h3>

                <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.4, marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {course.description}
                </p>
              </div>

              <div>
                {/* Progress & Stats */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.775rem', color: '#64748b', marginBottom: '4px' }}>
                    <span>Progress ({course.completedModules}/{course.totalModules} Modules)</span>
                    <span style={{ fontWeight: 700, color: '#4f46e5' }}>{course.progress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{ width: `${course.progress}%` }} />
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock style={{ width: '14px', height: '14px' }} /> {course.estimatedTimeLeft} left
                  </span>
                  <button
                    onClick={() => {
                      if (setSelectedCourse) setSelectedCourse(course);
                      setActiveTab('timeline');
                    }}
                    className="btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
                  >
                    <PlayCircle style={{ width: '15px', height: '15px' }} />
                    View Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
