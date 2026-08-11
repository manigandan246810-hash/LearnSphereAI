// LearnSphere AI - PostgreSQL API Client Service Layer
const API_BASE_URL = 'http://localhost:5001/api';

// Helper for fetch with error handling
async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[API Client Fallback] ${endpoint}:`, err.message);
    throw err;
  }
}

export const api = {
  // Health Check
  getHealth: () => request('/health'),

  // Auth & Profile
  login: (role, email) => request('/auth/login', { method: 'POST', body: JSON.stringify({ role, email }) }),

  // Courses
  getCourses: (studentId) => request(`/courses?studentId=${studentId || ''}`),
  createCourse: (courseData) => request('/courses', { method: 'POST', body: JSON.stringify(courseData) }),
  toggleBookmark: (courseId, studentId) => request(`/courses/${courseId}/toggle-bookmark`, { method: 'POST', body: JSON.stringify({ studentCode: studentId }) }),

  // Assignments
  getAssignments: (studentId) => request(`/assignments?studentId=${studentId || ''}`),
  createAssignment: (asnData) => request('/assignments', { method: 'POST', body: JSON.stringify(asnData) }),
  submitAssignment: (asnId, studentId, fileName) => request(`/assignments/${asnId}/submit`, { method: 'POST', body: JSON.stringify({ studentCode: studentId, fileName }) }),
  gradeSubmission: (gradeData) => request('/assignments/submissions/grade', { method: 'POST', body: JSON.stringify(gradeData) }),

  // Quizzes
  getQuizzes: (studentId) => request(`/quizzes?studentId=${studentId || ''}`),
  createQuiz: (quizData) => request('/quizzes', { method: 'POST', body: JSON.stringify(quizData) }),
  submitQuizAttempt: (quizId, studentId, scorePercentage) => request(`/quizzes/${quizId}/attempt`, { method: 'POST', body: JSON.stringify({ studentCode: studentId, scorePercentage }) }),

  // Gamification & Analytics
  getLeaderboard: (filter, department) => request(`/leaderboard?filter=${filter || 'Weekly'}&department=${department || 'All'}`),
  getAchievements: (studentId) => request(`/achievements?studentId=${studentId || ''}`),
  unlockAchievement: (badgeId, studentId) => request(`/achievements/${badgeId}/unlock`, { method: 'POST', body: JSON.stringify({ studentCode: studentId }) }),
  getAnalytics: () => request('/analytics/summary'),

  // Announcements & Events
  getAnnouncements: () => request('/announcements'),
  createAnnouncement: (annoData) => request('/announcements', { method: 'POST', body: JSON.stringify(annoData) }),
  getEvents: () => request('/events'),

  // Resources & Certificates
  getResources: () => request('/resources'),
  uploadResource: (resData) => request('/resources', { method: 'POST', body: JSON.stringify(resData) }),
  getCertificates: (studentId) => request(`/certificates?studentId=${studentId || ''}`),

  // AI Assistant
  queryAI: (query) => request('/ai/query', { method: 'POST', body: JSON.stringify({ query }) })
};
