import React, { useState } from 'react';
import { CalendarRange, PlusCircle, HelpCircle } from 'lucide-react';
import { WeeklyPlanner } from './WeeklyPlanner';
import { AssignmentBuilder } from './AssignmentBuilder';
import { QuizBuilder } from './QuizBuilder';

export function UploadCenter({ courses, setCourses, assignments, setAssignments, quizzes, setQuizzes, setActiveTab }) {
  const [activeUploadTab, setActiveUploadTab] = useState('planner');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Page Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
          Curriculum Upload Center
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
          Manage syllabus structures, create assignments, and build proctored quizzes.
        </p>
      </div>

      {/* Upload Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: '0.35rem',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '2px',
        marginTop: '0.5rem'
      }}>
        <button
          onClick={() => setActiveUploadTab('planner')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.75rem 1.25rem',
            border: 'none',
            borderBottom: activeUploadTab === 'planner' ? '3px solid #2563eb' : '3px solid transparent',
            backgroundColor: activeUploadTab === 'planner' ? '#eff6ff' : 'transparent',
            color: activeUploadTab === 'planner' ? '#1e40af' : '#475569',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            transition: 'all 0.2s ease'
          }}
        >
          <CalendarRange style={{ width: '18px', height: '18px' }} />
          Weekly Syllabus Planner
        </button>

        <button
          onClick={() => setActiveUploadTab('assignment')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.75rem 1.25rem',
            border: 'none',
            borderBottom: activeUploadTab === 'assignment' ? '3px solid #2563eb' : '3px solid transparent',
            backgroundColor: activeUploadTab === 'assignment' ? '#eff6ff' : 'transparent',
            color: activeUploadTab === 'assignment' ? '#1e40af' : '#475569',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            transition: 'all 0.2s ease'
          }}
        >
          <PlusCircle style={{ width: '18px', height: '18px' }} />
          Assignment Builder
        </button>

        <button
          onClick={() => setActiveUploadTab('quiz')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '0.75rem 1.25rem',
            border: 'none',
            borderBottom: activeUploadTab === 'quiz' ? '3px solid #2563eb' : '3px solid transparent',
            backgroundColor: activeUploadTab === 'quiz' ? '#eff6ff' : 'transparent',
            color: activeUploadTab === 'quiz' ? '#1e40af' : '#475569',
            fontWeight: 700,
            fontSize: '0.875rem',
            cursor: 'pointer',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            transition: 'all 0.2s ease'
          }}
        >
          <HelpCircle style={{ width: '18px', height: '18px' }} />
          Quiz & Exam Builder
        </button>
      </div>

      {/* Tab Panel Content Box */}
      <div className="animate-fade-up" style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        padding: '1.75rem',
        border: '1px solid #cbd5e1',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
      }}>
        {activeUploadTab === 'planner' && (
          <WeeklyPlanner courses={courses} setCourses={setCourses} />
        )}
        {activeUploadTab === 'assignment' && (
          <AssignmentBuilder 
            courses={courses} 
            assignments={assignments} 
            setAssignments={setAssignments} 
            setActiveTab={setActiveTab} 
          />
        )}
        {activeUploadTab === 'quiz' && (
          <QuizBuilder 
            courses={courses} 
            quizzes={quizzes} 
            setQuizzes={setQuizzes} 
            setActiveTab={setActiveTab} 
          />
        )}
      </div>

    </div>
  );
}
