// LearnSphere AI Comprehensive Mock Data Store

export const INITIAL_STUDENT_PROFILE = {
  id: "STU-88219",
  name: "Alex Morgan",
  role: "Student",
  email: "alex.morgan@learnsphere.edu",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  department: "Computer Science & Engineering",
  semester: "6th Semester",
  rank: 2,
  totalStudents: 1420,
  streakDays: 14,
  xp: 14850,
  level: "Grandmaster Scholar",
  weeklyXP: 1250,
  overallProgress: 78,
  currentGoal: "Complete AI Neural Networks Module by Friday",
  github: "https://github.com/alexmorgan",
  linkedin: "https://linkedin.com/in/alexmorgan",
  skills: ["React", "Python", "Deep Learning", "TypeScript", "Docker", "Algorithms"],
  bio: "Passionate AI Enthusiast and Full-Stack Developer aiming for AI Research."
};

export const INITIAL_FACULTY_PROFILE = {
  id: "FAC-1042",
  name: "Dr. Evelyn Vance",
  role: "Staff",
  title: "Professor & Head of AI Research",
  email: "evelyn.vance@learnsphere.edu",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  department: "Department of Computer Science",
  subjects: ["Artificial Intelligence", "Deep Learning & Neural Networks", "Advanced Data Structures"],
  activeClasses: 4,
  pendingReviews: 12,
  officeHours: "Mon/Wed 2:00 PM - 4:00 PM",
  rating: 4.9
};

export const MOCK_COURSES = [
  {
    id: "CS-401",
    title: "Artificial Intelligence & Neural Networks",
    instructor: "Dr. Evelyn Vance",
    category: "AI & Data Science",
    progress: 82,
    totalModules: 12,
    completedModules: 10,
    estimatedTimeLeft: "2h 45m",
    enrolledStudents: 340,
    rating: 4.9,
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80",
    isBookmarked: true,
    isFavorite: true,
    description: "Master feedforward neural networks, backpropagation, CNNs, Transformers, and modern generative AI models.",
    weeklyTimeline: [
      { week: 1, topic: "Introduction to AI & Agent Architecture", status: "completed", videoUrl: "#", notesPdf: "#", quizScore: "95%" },
      { week: 2, topic: "Supervised Learning & Regression Models", status: "completed", videoUrl: "#", notesPdf: "#", quizScore: "100%" },
      { week: 3, topic: "Neural Network Architecture & Backprop", status: "completed", videoUrl: "#", notesPdf: "#", quizScore: "90%" },
      { week: 4, topic: "Convolutional Neural Networks (CNNs)", status: "completed", videoUrl: "#", notesPdf: "#", quizScore: "88%" },
      { week: 5, topic: "Recurrent Networks & Attention Mechanism", status: "in-progress", videoUrl: "#", notesPdf: "#", quizScore: "Pending" },
      { week: 6, topic: "Transformers & LLM Architecture", status: "upcoming", videoUrl: "#", notesPdf: "#", quizScore: "Locked" }
    ]
  },
  {
    id: "CS-302",
    title: "Machine Learning & Data Visualization",
    instructor: "Prof. Marcus Thorne",
    category: "Data Science",
    progress: 64,
    totalModules: 10,
    completedModules: 6,
    estimatedTimeLeft: "5h 15m",
    enrolledStudents: 410,
    rating: 4.8,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
    isBookmarked: true,
    isFavorite: false,
    description: "Hands-on machine learning with Python, scikit-learn, Seaborn, interactive dashboards, and statistical models."
  },
  {
    id: "CS-205",
    title: "Modern Web Development with React & Next.js",
    instructor: "Sarah Jenkins",
    category: "Software Engineering",
    progress: 95,
    totalModules: 14,
    completedModules: 13,
    estimatedTimeLeft: "45m",
    enrolledStudents: 520,
    rating: 5.0,
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80",
    isBookmarked: false,
    isFavorite: true,
    description: "Build ultra-fast, responsive web applications using React 18, Next.js App Router, TailwindCSS, and Zustand."
  },
  {
    id: "CS-108",
    title: "Python for Scientific Computing",
    instructor: "Dr. Alan Turing",
    category: "Programming",
    progress: 100,
    totalModules: 8,
    completedModules: 8,
    estimatedTimeLeft: "Completed",
    enrolledStudents: 680,
    rating: 4.9,
    coverImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    isBookmarked: false,
    isFavorite: true,
    description: "Comprehensive introduction to Python algorithms, NumPy matrix algebra, SciPy optimization, and Pandas manipulation."
  },
  {
    id: "CS-504",
    title: "Cloud Computing & AWS Architecture",
    instructor: "David Miller",
    category: "Cloud & Infrastructure",
    progress: 42,
    totalModules: 15,
    completedModules: 6,
    estimatedTimeLeft: "8h 30m",
    enrolledStudents: 290,
    rating: 4.7,
    coverImage: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80",
    isBookmarked: true,
    isFavorite: false,
    description: "Architecting resilient, auto-scaling cloud solutions on AWS, EC2, Lambda, S3, ECS, and Terraform IaC."
  },
  {
    id: "CS-601",
    title: "Cyber Security & Ethical Hacking",
    instructor: "Cmdr. Rachel Adams",
    category: "Security",
    progress: 30,
    totalModules: 10,
    completedModules: 3,
    estimatedTimeLeft: "11h 0m",
    enrolledStudents: 310,
    rating: 4.9,
    coverImage: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80",
    isBookmarked: false,
    isFavorite: false,
    description: "Network penetration testing, vulnerability assessment, cryptography fundamentals, and zero-trust security architecture."
  }
];

export const MOCK_ASSIGNMENTS = [
  {
    id: "ASN-101",
    title: "Implement Convolutional Neural Network (CNN) in PyTorch",
    courseId: "CS-401",
    courseName: "Artificial Intelligence & Neural Networks",
    faculty: "Dr. Evelyn Vance",
    dueDate: "2026-08-10T23:59:00",
    remainingHours: 104,
    status: "pending", // pending, completed, late
    maxMarks: 100,
    earnedMarks: null,
    rubric: [
      { criteria: "Model Architecture Setup (CNN Layers & Activation)", points: 30 },
      { criteria: "Training Loop & Optimizer Optimization", points: 30 },
      { criteria: "Evaluation Metrics (Accuracy, Precision, Recall)", points: 20 },
      { criteria: "Code Cleanliness & Documentation", points: 20 }
    ],
    instructions: "Write a PyTorch CNN model to achieve >92% accuracy on the CIFAR-10 dataset. Submit your Jupyter Notebook (.ipynb) or Python script with loss graphs."
  },
  {
    id: "ASN-102",
    title: "Interactive Data Visualization Dashboard",
    courseId: "CS-302",
    courseName: "Machine Learning & Data Visualization",
    faculty: "Prof. Marcus Thorne",
    dueDate: "2026-08-14T23:59:00",
    remainingHours: 200,
    status: "pending",
    maxMarks: 50,
    earnedMarks: null,
    rubric: [
      { criteria: "Chart Variety & Interactivity", points: 20 },
      { criteria: "Dataset Insights & Narrative", points: 20 },
      { criteria: "Visual Styling & Palette Choice", points: 10 }
    ],
    instructions: "Create a Seaborn or Plotly interactive dashboard exploring global climate change trends over the past century."
  },
  {
    id: "ASN-100",
    title: "Build a Full-Stack Portfolio App with React 18",
    courseId: "CS-205",
    courseName: "Modern Web Development",
    faculty: "Sarah Jenkins",
    dueDate: "2026-08-01T23:59:00",
    remainingHours: 0,
    status: "completed",
    maxMarks: 100,
    earnedMarks: 98,
    feedback: "Outstanding work Alex! The micro-animations and component modularity were exceptionally well-executed."
  }
];

export const MOCK_QUIZZES = [
  {
    id: "QZ-501",
    title: "Neural Networks & Backpropagation Quiz",
    courseName: "Artificial Intelligence",
    durationMinutes: 15,
    questionsCount: 5,
    avgScore: "88%",
    rank: 3,
    status: "available",
    questions: [
      {
        id: 1,
        question: "Which activation function is most commonly used in hidden layers of Deep Neural Networks to prevent vanishing gradients?",
        options: ["Sigmoid", "ReLU (Rectified Linear Unit)", "Softmax", "Tanh"],
        correct: 1
      },
      {
        id: 2,
        question: "What is the primary role of the Backpropagation algorithm?",
        options: [
          "To compute loss directly without gradients",
          "To update network weights by calculating loss gradients via the chain rule",
          "To randomly shuffle training samples",
          "To compress input images into lower dimensions"
        ],
        correct: 1
      },
      {
        id: 3,
        question: "In Convolutional Neural Networks, what does a 'Max Pooling' layer do?",
        options: [
          "Increases spatial resolution of feature maps",
          "Reduces spatial dimensions while preserving dominant features",
          "Adds bias parameters to zero padding",
          "Applies a linear transformation across channels"
        ],
        correct: 1
      }
    ]
  },
  {
    id: "QZ-502",
    title: "React Server Components & Hooks Quiz",
    courseName: "Modern Web Development",
    durationMinutes: 20,
    questionsCount: 10,
    avgScore: "94%",
    rank: 1,
    status: "completed",
    lastScore: "100%"
  }
];

export const MOCK_LEADERBOARD = [
  { rank: 1, name: "Sophia Chen", department: "Computer Science", xp: 16200, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80", streak: 21, badge: "👑 Champion" },
  { rank: 2, name: "Alex Morgan (You)", department: "Computer Science", xp: 14850, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80", streak: 14, badge: "⚡ Master" },
  { rank: 3, name: "Liam Vance", department: "AI & Robotics", xp: 13900, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80", streak: 12, badge: "🔥 Innovator" },
  { rank: 4, name: "Emma Watson", department: "Data Science", xp: 12400, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80", streak: 9, badge: "⭐ Scholar" },
  { rank: 5, name: "Noah Patel", department: "Computer Science", xp: 11850, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80", streak: 7, badge: "🚀 Explorer" }
];

export const MOCK_ACHIEVEMENTS = [
  { id: 1, title: "14-Day Streak Master", desc: "Logged in and completed learning tasks for 14 consecutive days.", icon: "🔥", unlocked: true, date: "Aug 04, 2026" },
  { id: 2, title: "AI Wizard", desc: "Scored 95%+ on 5 AI Neural Network Quizzes.", icon: "🧠", unlocked: true, date: "Aug 01, 2026" },
  { id: 3, title: "Speed Demon", desc: "Submitted 3 assignments at least 48 hours before deadline.", icon: "⚡", unlocked: true, date: "Jul 28, 2026" },
  { id: 4, title: "Code Titan", desc: "Completed 50 coding challenges in the interactive workbench.", icon: "💻", unlocked: false, requirement: "42/50 Completed" },
  { id: 5, title: "Knowledge Pioneer", desc: "Helped 15 fellow classmates in discussion forums.", icon: "🌟", unlocked: false, requirement: "11/15 Helped" },
  { id: 6, title: "Polyglot Engineer", desc: "Completed certifications across 3 different domains.", icon: "🏆", unlocked: true, date: "Jul 20, 2026" }
];

export const MOCK_ANNOUNCEMENTS = [
  { id: 1, title: "Upcoming National AI Hackathon 2026", author: "Dr. Evelyn Vance", date: "2 hours ago", pinned: true, category: "Event", text: "Registrations are now open for the Annual LearnSphere National AI Hackathon with $50,000 in cloud credits and prizes!" },
  { id: 2, title: "Mid-Term Exam Schedule & Guidelines Released", author: "Dean of Academics", date: "1 day ago", pinned: true, category: "Academic", text: "Please review the updated examination timetable. All mid-term exams will be conducted on the LearnSphere secure test module." },
  { id: 3, title: "Guest Lecture: Generative AI at Scale by OpenAI Engineers", author: "Computer Science Dept", date: "3 days ago", pinned: false, category: "Webinar", text: "Join us live this Thursday at 4:00 PM EST for an exclusive workshop on deploying transformer models in production." }
];

export const MOCK_STAFF_STUDENTS = [
  { id: "STU-88219", name: "Alex Morgan", email: "alex.morgan@learnsphere.edu", progress: 78, attendance: "96%", avgScore: "92%", status: "Top Performer", lastActive: "10 mins ago" },
  { id: "STU-88220", name: "Sophia Chen", email: "sophia.chen@learnsphere.edu", progress: 85, attendance: "98%", avgScore: "95%", status: "Top Performer", lastActive: "1 hour ago" },
  { id: "STU-88221", name: "Jacob Miller", email: "jacob.m@learnsphere.edu", progress: 42, attendance: "72%", avgScore: "64%", status: "Needs Attention", lastActive: "3 days ago" },
  { id: "STU-88222", name: "Elena Rostova", email: "elena.r@learnsphere.edu", progress: 61, attendance: "88%", avgScore: "78%", status: "On Track", lastActive: "Yesterday" },
  { id: "STU-88223", name: "David Kim", email: "david.k@learnsphere.edu", progress: 35, attendance: "65%", avgScore: "58%", status: "Needs Attention", lastActive: "5 days ago" }
];
