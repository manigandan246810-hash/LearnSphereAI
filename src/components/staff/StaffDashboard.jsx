import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  BookOpen, 
  CheckSquare, 
  Award, 
  Clock, 
  TrendingUp, 
  Plus, 
  Sparkles,
  ArrowRight,
  ChevronRight,
  UploadCloud,
  FileText,
  HelpCircle,
  X,
  ShieldAlert,
  AlertTriangle,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MOCK_STAFF_STUDENTS } from '../../data/mockData';

// Simulated AI Quiz Extractor based on keywords in lecture notes
function generateAIQuiz(topic, notesText, numQ, marks, time) {
  const text = (topic + " " + notesText).toLowerCase();
  const questionPool = [];
  
  if (text.includes("network") || text.includes("neural") || text.includes("deep learning") || text.includes("cnn") || text.includes("model")) {
    questionPool.push(
      { question: "What does CNN stand for in deep learning?", options: ["Convolutional Neural Network", "Computer Network Node", "Central Neural Network", "Convoluted Node Net"], correct: 0 },
      { question: "Which activation function is commonly used to prevent vanishing gradient in hidden layers?", options: ["Sigmoid", "Tanh", "ReLU (Rectified Linear Unit)", "Step Function"], correct: 2 },
      { question: "Which layer in a CNN reduces the spatial size of the representation?", options: ["Fully Connected Layer", "Pooling Layer", "Convolutional Layer", "Normalization Layer"], correct: 1 },
      { question: "What is backpropagation primarily used for in multi-layer nets?", options: ["Initial Weight Selection", "Calculating Loss Gradients for updates", "Dataset Splitting", "Feature Visualization"], correct: 1 },
      { question: "Which loss function is best suited for multi-class classification?", options: ["Mean Squared Error", "Binary Cross-Entropy", "Categorical Cross-Entropy", "L1 Smooth Loss"], correct: 2 }
    );
  }
  
  if (text.includes("react") || text.includes("next") || text.includes("web") || text.includes("frontend") || text.includes("js")) {
    questionPool.push(
      { question: "What is the primary benefit of Next.js over vanilla React?", options: ["Built-in server-side rendering (SSR)", "Faster local variables", "Easier CSS declarations", "Simpler state machines"], correct: 0 },
      { question: "Which React hook is used to handle side-effects in functional components?", options: ["useState", "useContext", "useEffect", "useReducer"], correct: 2 },
      { question: "What is the Virtual DOM in React?", options: ["A direct copy of the browser document", "A lightweight Javascript representation of the real DOM", "An external database system", "A cloud-hosted rendering pipeline"], correct: 1 },
      { question: "How do you pass data down from parent to child components in React?", options: ["Using state selectors", "Using class methods", "Using Props", "Using import statements"], correct: 2 },
      { question: "In Next.js, how are routes defined in the App Router?", options: ["Via configuration files", "By nesting folders inside the 'app' directory", "Using external router plugins", "Inside the main app.js file"], correct: 1 }
    );
  }
  
  // Default general fallback pool if keywords aren't matched
  if (questionPool.length === 0) {
    questionPool.push(
      { question: `What is the core objective of studying ${topic || 'this module'}?`, options: ["Memorizing historical formulas", "Understanding fundamental principles and practical application", "Automating simple scripts only", "Passing exams without coding"], correct: 1 },
      { question: "What does 'epoch' refer to in machine learning training?", options: ["One pass through a single batch", "One full pass through the entire training dataset", "The rate of learning parameter", "The loss reduction threshold"], correct: 1 },
      { question: "Which step is critical before feeding raw data to an AI model?", options: ["Feature scaling and preprocessing", "Increasing GPU hardware capacity", "Duplicating text lines", "Translating code to English"], correct: 0 },
      { question: "What is overfitting in predictive modeling?", options: ["Model performing poorly on training data", "Model performing exceptionally on training data but poorly on unseen test data", "Model learning too slowly", "Model executing too fast"], correct: 1 },
      { question: "What does API stand for in software engineering?", options: ["Application Programming Interface", "Artificial Primary Intelligence", "Advanced Protocol Integrator", "Applied Program Instruction"], correct: 0 }
    );
  }
  
  // Slice to desired question length, repeating if pool is smaller
  const quizQuestions = [];
  for (let i = 0; i < numQ; i++) {
    const template = questionPool[i % questionPool.length];
    quizQuestions.push({
      id: i + 1,
      question: template.question,
      options: [...template.options],
      correct: template.correct
    });
  }
  
  return quizQuestions;
}

export function StaffDashboard({ 
  profile, 
  setActiveTab, 
  courses, 
  setCourses, 
  assignments, 
  setAssignments, 
  quizzes, 
  setQuizzes,
  malpracticeLogs 
}) {
  // Modal State
  const [showUploadHub, setShowUploadHub] = useState(false);
  
  // One-Tap Form State
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'AI-101');
  const [weekNumber, setWeekNumber] = useState(6);
  const [topicTitle, setTopicTitle] = useState('');
  const [lectureNotes, setLectureNotes] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  
  // Optional features state
  const [includeAssignment, setIncludeAssignment] = useState(false);
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  const [assignmentMaxMarks, setAssignmentMaxMarks] = useState(100);
  const [assignmentInstructions, setAssignmentInstructions] = useState('');
  
  const [includeQuiz, setIncludeQuiz] = useState(false);
  const [quizQuestionsCount, setQuizQuestionsCount] = useState(5);
  const [quizMarksPerQuestion, setQuizMarksPerQuestion] = useState(10);
  const [quizDuration, setQuizDuration] = useState(15);

  // Stats derived dynamically from global state
  const activeStudentCount = MOCK_STAFF_STUDENTS.length;
  const pendingSubCount = assignments.filter(a => a.status === 'pending').length;
  
  const staffStats = [
    { title: 'Total Enrolled Students', value: `${activeStudentCount} Students`, sub: 'Across active AI curricula', icon: Users, color: '#2563eb', bg: '#dbeafe', tab: 'student-management' },
    { title: 'Active Courses', value: `${courses.length} Courses`, sub: 'Spring Semester 2026', icon: BookOpen, color: '#0ea5e9', bg: '#e0f2fe', tab: 'upload' },
    { title: 'Pending Submissions', value: `${pendingSubCount} Submissions`, sub: 'Requires grading evaluation', icon: CheckSquare, color: '#f59e0b', bg: '#fef3c7', tab: 'evaluation-desk' },
    { title: 'Security Infractions', value: `${malpracticeLogs.length} Flagged`, sub: 'Real-time test monitors', icon: ShieldAlert, color: '#ef4444', bg: '#ffe4e6', tab: 'malpractice-reports' }
  ];

  const todaySchedule = [
    { time: '10:00 AM - 11:30 AM', subject: 'Artificial Intelligence & Neural Networks', room: 'Lab 402 / Online Stream', type: 'Lecture & Lab' },
    { time: '02:00 PM - 03:30 PM', subject: 'Deep Learning Faculty Q&A Office Hours', room: 'Faculty Office B-12', type: 'Office Hours' }
  ];

  const handleOneTapPublish = (e) => {
    e.preventDefault();
    if (!topicTitle.trim()) {
      alert("Please enter a week topic/lesson title.");
      return;
    }

    // 1. Update Course syllabus timeline
    const updatedCourses = courses.map(course => {
      if (course.id === selectedCourseId) {
        const weekExists = course.weeklyTimeline.some(w => w.week === Number(weekNumber));
        const newTimelineItem = {
          week: Number(weekNumber),
          topic: topicTitle,
          status: 'in-progress',
          quizScore: includeQuiz ? 'Not Taken' : 'Locked',
          videoUrl: videoUrl || 'https://www.w3schools.com/html/mov_bbb.mp4',
          pdfNotes: lectureNotes || 'No notes contents specified.'
        };

        let newTimeline = [...course.weeklyTimeline];
        if (weekExists) {
          newTimeline = newTimeline.map(w => w.week === Number(weekNumber) ? newTimelineItem : w);
        } else {
          newTimeline.push(newTimelineItem);
        }

        // Sort syllabus week-by-week
        newTimeline.sort((a, b) => a.week - b.week);

        return {
          ...course,
          weeklyTimeline: newTimeline,
          progress: Math.min(100, Math.floor(((course.completedModules + 1) / (course.totalModules + 1)) * 100)),
          completedModules: course.completedModules + 1,
          totalModules: course.totalModules + 1
        };
      }
      return course;
    });
    setCourses(updatedCourses);

    // 2. Add Assignment if checked
    if (includeAssignment) {
      const newAssignment = {
        id: `ASG-${Date.now()}`,
        courseId: selectedCourseId,
        courseName: courses.find(c => c.id === selectedCourseId)?.title || "Curriculum Course",
        title: assignmentTitle || `${topicTitle} Practical Lab`,
        faculty: profile.name,
        dueDate: assignmentDueDate ? new Date(assignmentDueDate).toISOString() : new Date(Date.now() + 7 * 86400000).toISOString(),
        status: 'pending',
        maxMarks: Number(assignmentMaxMarks),
        earnedMarks: null,
        instructions: assignmentInstructions || "Complete all exercises outlined in the uploaded lab notebooks.",
        rubric: [
          { criteria: 'Functional Correctness', points: Math.floor(assignmentMaxMarks * 0.4) },
          { criteria: 'Code Design & Structure', points: Math.floor(assignmentMaxMarks * 0.4) },
          { criteria: 'Documentation & Comments', points: Math.floor(assignmentMaxMarks * 0.2) }
        ]
      };
      setAssignments(prev => [newAssignment, ...prev]);
    }

    // 3. Add AI Generated Quiz if checked
    if (includeQuiz) {
      const generatedQuestions = generateAIQuiz(topicTitle, lectureNotes, quizQuestionsCount, quizMarksPerQuestion, quizDuration);
      const newQuiz = {
        id: `QUIZ-${Date.now()}`,
        courseId: selectedCourseId,
        courseName: courses.find(c => c.id === selectedCourseId)?.title || "Curriculum Course",
        title: `${topicTitle} Practice Test`,
        duration: quizDuration,
        questionsCount: quizQuestionsCount,
        totalMarks: quizQuestionsCount * quizMarksPerQuestion,
        status: 'available',
        questions: generatedQuestions
      };
      setQuizzes(prev => [newQuiz, ...prev]);
    }

    // Confetti effect!
    confetti({
      particleCount: 150,
      spread: 80,
      origin: { y: 0.6 }
    });

    alert("✨ One-Tap Broadcast Successful!\nSyllabus, notes, video link, assignments, and AI quiz have been published simultaneously.");
    
    // Reset Form
    setTopicTitle('');
    setLectureNotes('');
    setVideoUrl('');
    setIncludeAssignment(false);
    setIncludeQuiz(false);
    setShowUploadHub(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Faculty Hero Banner */}
      <div className="animate-fade-up" style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)',
        borderRadius: '24px',
        padding: '2.25rem',
        color: '#ffffff',
        boxShadow: '0 12px 30px -4px rgba(37, 99, 235, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#38bdf8'
            }}>
              {profile.title}
            </span>
            <span style={{ fontSize: '0.8rem', color: '#e0f2fe' }}>• {profile.department}</span>
          </div>

          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
            Welcome, {profile.name}! 🎓
          </h1>

          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '600px' }}>
            You have <strong>{pendingSubCount} student assignment submissions</strong> waiting for evaluation. Use the Upload Center to add weekly schedules, assignments, and test content.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={() => setActiveTab('smart-lists')} style={{ color: '#ffffff', background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '10px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
            <FileSpreadsheet style={{ width: '18px', height: '18px' }} /> Smart List & Excel Export
          </button>
          <button className="btn-primary" onClick={() => setActiveTab('upload')} style={{ color: '#ffffff', background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)', border: 'none', padding: '0.65rem 1.25rem', borderRadius: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
            <UploadCloud style={{ width: '18px', height: '18px' }} /> Upload Center
          </button>
          <button className="btn-secondary" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }} onClick={() => setActiveTab('evaluation-desk')}>
            <CheckSquare style={{ width: '18px', height: '18px' }} /> Grade Desk ({pendingSubCount})
          </button>
        </div>
      </div>

      {/* Faculty Statistics Grid */}
      <div className="grid-responsive">
        {staffStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className="ls-card ls-card-hover animate-fade-up" 
              onClick={() => setActiveTab(stat.tab)}
              style={{ animationDelay: `${idx * 0.06}s`, cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifycontent: 'space-between', marginBottom: '0.75rem', width: '100%' }}>
                <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#64748b' }}>{stat.title}</span>
                <div style={{ marginLeft: 'auto', width: '38px', height: '38px', borderRadius: '10px', backgroundColor: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon style={{ width: '20px', height: '20px', color: stat.color }} />
                </div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '4px' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                {stat.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule & Security Flags Split View */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Today's Schedule */}
        <div className="ls-card animate-fade-up">
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
            Today's Faculty Schedule
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {todaySchedule.map((s, i) => (
              <div key={i} style={{ padding: '1rem', borderRadius: '12px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderLeft: '4px solid var(--primary-indigo)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-indigo)', marginBottom: '3px' }}>{s.time}</div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a', marginBottom: '2px' }}>{s.subject}</div>
                <div style={{ fontSize: '0.775rem', color: '#64748b' }}>📍 {s.room}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Security / Malpractice Warnings Quick View */}
        <div className="ls-card animate-fade-up" style={{ animationDelay: '0.1s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldAlert style={{ width: '20px', height: '20px', color: '#ef4444' }} />
              Active Proctoring Alerts
            </h3>
            <button style={{ border: 'none', background: 'none', color: '#2563eb', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }} onClick={() => setActiveTab('malpractice-reports')}>
              All Violations →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {malpracticeLogs.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', fontSize: '0.85rem' }}>
                No exam security violations logged today.
              </div>
            ) : (
              malpracticeLogs.slice(0, 3).map((log) => (
                <div key={log.id} style={{ padding: '0.75rem 1rem', borderRadius: '10px', backgroundColor: '#fff5f5', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#b91c1c' }}>{log.studentName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#7f1d1d' }}>Exam: {log.quizTitle} • {log.infractionsCount} Tab switches</div>
                  </div>
                  <span className="chip chip-rose" style={{ fontSize: '0.7rem' }}>
                    {log.severity} Alert
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
