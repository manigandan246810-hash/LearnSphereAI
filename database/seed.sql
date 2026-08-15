-- =============================================================================
-- LEARNsphere AI - PostgreSQL Database Seed Data
-- Architecture: Complete Development & Testing Dataset
-- Matches existing LearnSphere AI UI models & data requirements
-- =============================================================================

BEGIN;

-- Clear any existing data
TRUNCATE TABLE 
    resource_library,
    certificates,
    academic_events,
    announcements,
    xp_transactions,
    user_achievements,
    achievements,
    quiz_answers,
    quiz_attempts,
    quiz_options,
    quiz_questions,
    quizzes,
    assignment_submissions,
    assignment_rubrics,
    assignments,
    lesson_progress,
    lessons,
    course_modules,
    course_enrollments,
    courses,
    user_skills,
    user_auth,
    users
RESTART IDENTITY CASCADE;

-- =============================================================================
-- 1. SEED USERS & AUTHENTICATION
-- Password hash below is Argon2id/bcrypt mock string for development: '$2a$12$e8x9/K.1J82g1wK9xH5V8u...'
-- =============================================================================

-- Define User UUID Variables using WITH CTEs or inline deterministic UUIDs
-- Admin
INSERT INTO users (id, user_code, name, email, role, department, avatar_url, bio)
VALUES (
    '00000000-0000-4000-a000-000000000001',
    'ADM-0001',
    'System Administrator',
    'admin@learnsphere.edu',
    'Admin',
    'Academic Affairs & IT',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Lead LearnSphere Platform Administrator.'
);

-- Faculty & Staff Members
INSERT INTO users (id, user_code, name, email, role, department, avatar_url, faculty_title, office_hours)
VALUES 
(
    '10000000-0000-4000-a000-000000000050',
    '050',
    'Manigandan A.G',
    'manigandan050@gmail.com',
    'staff',
    'Department of Computer Science & Engineering',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'Senior Staff & LMS Lead',
    'Mon-Fri 9:00 AM - 5:00 PM'
),
(
    '10000000-0000-4000-a000-000000001042',
    'FAC-1042',
    'Dr. Evelyn Vance',
    'evelyn.vance@learnsphere.edu',
    'Faculty',
    'Department of Computer Science',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'Professor & Head of AI Research',
    'Mon/Wed 2:00 PM - 4:00 PM'
),
(
    '10000000-0000-4000-a000-000000001043',
    'FAC-1043',
    'Prof. Marcus Thorne',
    'marcus.thorne@learnsphere.edu',
    'Faculty',
    'Department of Data Science',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'Associate Professor of Machine Learning',
    'Tue/Thu 10:00 AM - 12:00 PM'
),
(
    '10000000-0000-4000-a000-000000001044',
    'FAC-1044',
    'Sarah Jenkins',
    'sarah.jenkins@learnsphere.edu',
    'Faculty',
    'Software Engineering Institute',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    'Senior Frontend Architect & Instructor',
    'Friday 1:00 PM - 3:00 PM'
);

-- Students (10 Students)
INSERT INTO users (id, user_code, name, email, role, department, avatar_url, semester, streak_days, total_xp, current_goal, github_url, linkedin_url, bio)
VALUES 
(
    '20000000-0000-4000-a000-000000008219',
    'STU-88219',
    'Alex Morgan',
    'alex.morgan@learnsphere.edu',
    'Student',
    'Computer Science & Engineering',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    '6th Semester',
    14,
    14850,
    'Complete AI Neural Networks Module by Friday',
    'https://github.com/alexmorgan',
    'https://linkedin.com/in/alexmorgan',
    'Passionate AI Enthusiast and Full-Stack Developer aiming for AI Research.'
),
(
    '20000000-0000-4000-a000-000000008220',
    'STU-88220',
    'Sophia Chen',
    'sophia.chen@learnsphere.edu',
    'Student',
    'Computer Science',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    '6th Semester',
    21,
    16200,
    'Master PyTorch Transformers',
    'https://github.com/sophiachen',
    'https://linkedin.com/in/sophiachen',
    'Deep Learning Research Scholar.'
),
(
    '20000000-0000-4000-a000-000000008221',
    'STU-88221',
    'Liam Vance',
    'liam.vance@learnsphere.edu',
    'Student',
    'AI & Robotics',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    '6th Semester',
    12,
    13900,
    'Build Autonomous Navigation Agent',
    'https://github.com/liamvance',
    'https://linkedin.com/in/liamvance',
    'Robotics and Computer Vision explorer.'
),
(
    '20000000-0000-4000-a000-000000008222',
    'STU-88222',
    'Emma Watson',
    'emma.watson@learnsphere.edu',
    'Student',
    'Data Science',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
    '6th Semester',
    9,
    12400,
    'Finish Data Visualization Capstone',
    'https://github.com/emmawatson',
    'https://linkedin.com/in/emmawatson',
    'Data visualization enthusiast.'
),
(
    '20000000-0000-4000-a000-000000008223',
    'STU-88223',
    'Noah Patel',
    'noah.patel@learnsphere.edu',
    'Student',
    'Computer Science',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    '6th Semester',
    7,
    11850,
    'Complete Cloud Security Lab',
    'https://github.com/noahpatel',
    'https://linkedin.com/in/noahpatel',
    'Cloud engineering student.'
),
(
    '20000000-0000-4000-a000-000000008224',
    'STU-88224',
    'Jacob Miller',
    'jacob.m@learnsphere.edu',
    'Student',
    'Computer Science',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    '4th Semester',
    4,
    6200,
    'Improve Quiz Scores',
    'https://github.com/jacobm',
    'https://linkedin.com/in/jacobm',
    'Software student.'
),
(
    '20000000-0000-4000-a000-000000008225',
    'STU-88225',
    'Elena Rostova',
    'elena.r@learnsphere.edu',
    'Student',
    'Cyber Security',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    '4th Semester',
    8,
    8900,
    'Complete Zero-Trust Architecture Module',
    'https://github.com/elenar',
    'https://linkedin.com/in/elenar',
    'Security enthusiast.'
),
(
    '20000000-0000-4000-a000-000000008226',
    'STU-88226',
    'David Kim',
    'david.k@learnsphere.edu',
    'Student',
    'Software Engineering',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    '4th Semester',
    2,
    4500,
    'Catch up on React Assignments',
    'https://github.com/davidk',
    'https://linkedin.com/in/davidk',
    'Full stack beginner.'
),
(
    '20000000-0000-4000-a000-000000008227',
    'STU-88227',
    'Rachel Green',
    'rachel.g@learnsphere.edu',
    'Student',
    'Data Science',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    '6th Semester',
    10,
    10500,
    'Complete Python Data Science Lab',
    'https://github.com/rachelg',
    'https://linkedin.com/in/rachelg',
    'Data analytics student.'
),
(
    '20000000-0000-4000-a000-000000008228',
    'STU-88228',
    'Michael Scott',
    'michael.s@learnsphere.edu',
    'Student',
    'Computer Science',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    '4th Semester',
    5,
    7100,
    'Complete Docker Containerization Task',
    'https://github.com/michaels',
    'https://linkedin.com/in/michaels',
    'DevOps learning pathway.'
);

-- Seed Auth Credentials for all Users
INSERT INTO user_auth (user_id, password_hash)
SELECT id, '$2a$12$e8x9/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3'
FROM users;

-- Seed Skills for Alex Morgan & others
INSERT INTO user_skills (user_id, skill_name, proficiency_level)
VALUES
('20000000-0000-4000-a000-000000008219', 'React', 'Expert'),
('20000000-0000-4000-a000-000000008219', 'Python', 'Expert'),
('20000000-0000-4000-a000-000000008219', 'Deep Learning', 'Advanced'),
('20000000-0000-4000-a000-000000008219', 'TypeScript', 'Advanced'),
('20000000-0000-4000-a000-000000008219', 'Docker', 'Intermediate'),
('20000000-0000-4000-a000-000000008219', 'Algorithms', 'Expert');

-- =============================================================================
-- 2. SEED COURSES & CONTENT (6 Courses)
-- =============================================================================

INSERT INTO courses (id, course_code, title, description, category, instructor_id, cover_image_url, difficulty, status)
VALUES
(
    '30000000-0000-4000-a000-000000000401',
    'CS-401',
    'Artificial Intelligence & Neural Networks',
    'Master feedforward neural networks, backpropagation, CNNs, Transformers, and modern generative AI models.',
    'AI & Data Science',
    '10000000-0000-4000-a000-000000001042', -- Dr. Evelyn Vance
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&auto=format&fit=crop&q=80',
    'Advanced',
    'Active'
),
(
    '30000000-0000-4000-a000-000000000302',
    'CS-302',
    'Machine Learning & Data Visualization',
    'Hands-on machine learning with Python, scikit-learn, Seaborn, interactive dashboards, and statistical models.',
    'AI & Data Science',
    '10000000-0000-4000-a000-000000001043', -- Prof. Marcus Thorne
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    'Intermediate',
    'Active'
),
(
    '30000000-0000-4000-a000-000000000205',
    'CS-205',
    'Modern Web Development with React & Next.js',
    'Build ultra-fast, responsive web applications using React 18, Next.js App Router, TailwindCSS, and Zustand.',
    'Software Engineering',
    '10000000-0000-4000-a000-000000001044', -- Sarah Jenkins
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    'Intermediate',
    'Active'
),
(
    '30000000-0000-4000-a000-000000000108',
    'CS-108',
    'Python for Scientific Computing',
    'Comprehensive introduction to Python algorithms, NumPy matrix algebra, SciPy optimization, and Pandas manipulation.',
    'Software Engineering',
    '10000000-0000-4000-a000-000000001043', -- Prof. Marcus Thorne
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    'Beginner',
    'Active'
),
(
    '30000000-0000-4000-a000-000000000504',
    'CS-504',
    'Cloud Computing & AWS Architecture',
    'Architecting resilient, auto-scaling cloud solutions on AWS, EC2, Lambda, S3, ECS, and Terraform IaC.',
    'Software Engineering',
    '10000000-0000-4000-a000-000000001044', -- Sarah Jenkins
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    'Advanced',
    'Active'
),
(
    '30000000-0000-4000-a000-000000000601',
    'CS-601',
    'Cyber Security & Ethical Hacking',
    'Network penetration testing, vulnerability assessment, cryptography fundamentals, and zero-trust security architecture.',
    'Software Engineering',
    '10000000-0000-4000-a000-000000001042', -- Dr. Evelyn Vance
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    'Expert',
    'Active'
);

-- =============================================================================
-- 3. SEED COURSE MODULES & LESSONS (Weekly Curriculum for CS-401)
-- =============================================================================

INSERT INTO course_modules (id, course_id, week_number, title, description, display_order)
VALUES
('40000000-0000-4000-a000-000000000001', '30000000-0000-4000-a000-000000000401', 1, 'Introduction to AI & Agent Architecture', 'Foundations of intelligent agents and state search', 1),
('40000000-0000-4000-a000-000000000002', '30000000-0000-4000-a000-000000000401', 2, 'Supervised Learning & Regression Models', 'Linear/Logistic regression and cost functions', 2),
('40000000-0000-4000-a000-000000000003', '30000000-0000-4000-a000-000000000401', 3, 'Neural Network Architecture & Backprop', 'Feedforward propagation and loss gradient chain rule', 3),
('40000000-0000-4000-a000-000000000004', '30000000-0000-4000-a000-000000000401', 4, 'Convolutional Neural Networks (CNNs)', 'Spatial feature maps, pooling, and image classification', 4),
('40000000-0000-4000-a000-000000000005', '30000000-0000-4000-a000-000000000401', 5, 'Recurrent Networks & Attention Mechanism', 'Sequential sequence modeling and attention layers', 5),
('40000000-0000-4000-a000-000000000006', '30000000-0000-4000-a000-000000000401', 6, 'Transformers & LLM Architecture', 'Self-attention mechanisms and generative AI models', 6);

INSERT INTO lessons (id, module_id, title, description, content, video_url, notes_pdf_url, display_order, duration_minutes)
VALUES
('50000000-0000-4000-a000-000000000001', '40000000-0000-4000-a000-000000000001', 'Agent Foundations Lecture', 'Introductory lecture stream', 'Overview of agent environment dynamics.', 'https://stream.learnsphere.edu/v101', 'https://cdn.learnsphere.edu/notes/w1.pdf', 1, 45),
('50000000-0000-4000-a000-000000000002', '40000000-0000-4000-a000-000000000002', 'Gradient Descent Optimization', 'Math behind cost optimization', 'Derivation of cost gradients.', 'https://stream.learnsphere.edu/v102', 'https://cdn.learnsphere.edu/notes/w2.pdf', 1, 50),
('50000000-0000-4000-a000-000000000003', '40000000-0000-4000-a000-000000000003', 'Backpropagation Mechanics', 'Deriving backpropagation', 'Detailed matrix operations.', 'https://stream.learnsphere.edu/v103', 'https://cdn.learnsphere.edu/notes/w3.pdf', 1, 60),
('50000000-0000-4000-a000-000000000004', '40000000-0000-4000-a000-000000000004', 'CNN Layers & Feature Extraction', 'Convolutions and pooling', 'Filter strides and feature maps.', 'https://stream.learnsphere.edu/v104', 'https://cdn.learnsphere.edu/notes/w4.pdf', 1, 45),
('50000000-0000-4000-a000-000000000005', '40000000-0000-4000-a000-000000000005', 'Sequence Modeling with RNNs', 'Recurrent cells and LSTM', 'Vanishing gradients in sequences.', 'https://stream.learnsphere.edu/v105', 'https://cdn.learnsphere.edu/notes/w5.pdf', 1, 55);

-- =============================================================================
-- 4. SEED ENROLLMENTS & LESSON PROGRESS
-- =============================================================================

-- Alex Morgan Enrolled in CS-401, CS-302, CS-205, CS-108, CS-504, CS-601
INSERT INTO course_enrollments (student_id, course_id, is_bookmarked, is_favorite)
VALUES
('20000000-0000-4000-a000-000000008219', '30000000-0000-4000-a000-000000000401', TRUE, TRUE),
('20000000-0000-4000-a000-000000008219', '30000000-0000-4000-a000-000000000302', TRUE, FALSE),
('20000000-0000-4000-a000-000000008219', '30000000-0000-4000-a000-000000000205', FALSE, TRUE),
('20000000-0000-4000-a000-000000008219', '30000000-0000-4000-a000-000000000108', FALSE, TRUE),
('20000000-0000-4000-a000-000000008219', '30000000-0000-4000-a000-000000000504', TRUE, FALSE),
('20000000-0000-4000-a000-000000008219', '30000000-0000-4000-a000-000000000601', FALSE, FALSE);

-- Other Student Enrollments
INSERT INTO course_enrollments (student_id, course_id)
VALUES
('20000000-0000-4000-a000-000000008220', '30000000-0000-4000-a000-000000000401'),
('20000000-0000-4000-a000-000000008221', '30000000-0000-4000-a000-000000000401'),
('20000000-0000-4000-a000-000000008222', '30000000-0000-4000-a000-000000000302'),
('20000000-0000-4000-a000-000000008223', '30000000-0000-4000-a000-000000000504'),
('20000000-0000-4000-a000-000000008224', '30000000-0000-4000-a000-000000000401');

-- Lesson Progress for Alex Morgan
INSERT INTO lesson_progress (student_id, lesson_id, status, progress_percentage, completed_at)
VALUES
('20000000-0000-4000-a000-000000008219', '50000000-0000-4000-a000-000000000001', 'completed', 100.00, CURRENT_TIMESTAMP - INTERVAL '14 days'),
('20000000-0000-4000-a000-000000008219', '50000000-0000-4000-a000-000000000002', 'completed', 100.00, CURRENT_TIMESTAMP - INTERVAL '10 days'),
('20000000-0000-4000-a000-000000008219', '50000000-0000-4000-a000-000000000003', 'completed', 100.00, CURRENT_TIMESTAMP - INTERVAL '7 days'),
('20000000-0000-4000-a000-000000008219', '50000000-0000-4000-a000-000000000004', 'completed', 100.00, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('20000000-0000-4000-a000-000000008219', '50000000-0000-4000-a000-000000000005', 'in-progress', 45.00, NULL);

-- =============================================================================
-- 5. SEED ASSIGNMENTS, RUBRICS & SUBMISSIONS
-- =============================================================================

INSERT INTO assignments (id, assignment_code, course_id, faculty_id, title, instructions, due_date, max_marks)
VALUES
(
    '60000000-0000-4000-a000-000000000101',
    'ASN-101',
    '30000000-0000-4000-a000-000000000401',
    '10000000-0000-4000-a000-000000001042', -- Dr. Evelyn Vance
    'Implement Convolutional Neural Network (CNN) in PyTorch',
    'Write a PyTorch CNN model to achieve >92% accuracy on the CIFAR-10 dataset. Submit your Jupyter Notebook (.ipynb) or Python script with loss graphs.',
    CURRENT_TIMESTAMP + INTERVAL '4 days',
    100
),
(
    '60000000-0000-4000-a000-000000000102',
    'ASN-102',
    '30000000-0000-4000-a000-000000000302',
    '10000000-0000-4000-a000-000000001043', -- Prof. Marcus Thorne
    'Interactive Data Visualization Dashboard',
    'Create a Seaborn or Plotly interactive dashboard exploring global climate change trends over the past century.',
    CURRENT_TIMESTAMP + INTERVAL '8 days',
    50
),
(
    '60000000-0000-4000-a000-000000000100',
    'ASN-100',
    '30000000-0000-4000-a000-000000000205',
    '10000000-0000-4000-a000-000000001044', -- Sarah Jenkins
    'Build a Full-Stack Portfolio App with React 18',
    'Build a modular portfolio with smooth micro-animations and component isolation.',
    CURRENT_TIMESTAMP - INTERVAL '8 days',
    100
);

-- Rubrics for ASN-101
INSERT INTO assignment_rubrics (assignment_id, criteria_text, max_points, display_order)
VALUES
('60000000-0000-4000-a000-000000000101', 'Model Architecture Setup (CNN Layers & Activation)', 30, 1),
('60000000-0000-4000-a000-000000000101', 'Training Loop & Optimizer Optimization', 30, 2),
('60000000-0000-4000-a000-000000000101', 'Evaluation Metrics (Accuracy, Precision, Recall)', 20, 3),
('60000000-0000-4000-a000-000000000101', 'Code Cleanliness & Documentation', 20, 4);

-- Submissions
INSERT INTO assignment_submissions (assignment_id, student_id, submission_attempt, submitted_file_name, submitted_file_url, submitted_at, status, earned_marks, feedback_comments, evaluated_by, evaluated_at)
VALUES
(
    '60000000-0000-4000-a000-000000000100',
    '20000000-0000-4000-a000-000000008219', -- Alex Morgan
    1,
    'React18_Portfolio_AlexMorgan.zip',
    'https://storage.learnsphere.edu/submissions/asn100_alex.zip',
    CURRENT_TIMESTAMP - INTERVAL '9 days',
    'completed',
    98.00,
    'Outstanding work Alex! The micro-animations and component modularity were exceptionally well-executed.',
    '10000000-0000-4000-a000-000000001044',
    CURRENT_TIMESTAMP - INTERVAL '8 days'
),
(
    '60000000-0000-4000-a000-000000000101',
    '20000000-0000-4000-a000-000000008219', -- Alex Morgan
    1,
    'CNN_PyTorch_Model_AlexMorgan.ipynb',
    'https://storage.learnsphere.edu/submissions/asn101_alex.ipynb',
    CURRENT_TIMESTAMP - INTERVAL '1 day',
    'pending',
    NULL,
    NULL,
    NULL,
    NULL
);

-- =============================================================================
-- 6. SEED QUIZZES, QUESTIONS, OPTIONS & ATTEMPTS
-- =============================================================================

INSERT INTO quizzes (id, quiz_code, course_id, title, description, duration_minutes, passing_percentage, created_by)
VALUES
(
    '70000000-0000-4000-a000-000000000501',
    'QZ-501',
    '30000000-0000-4000-a000-000000000401',
    'Neural Networks & Backpropagation Quiz',
    'Evaluates understanding of activation functions, loss gradients, and pooling operations.',
    15,
    70.00,
    '10000000-0000-4000-a000-000000001042'
),
(
    '70000000-0000-4000-a000-000000000502',
    'QZ-502',
    '30000000-0000-4000-a000-000000000205',
    'React Server Components & Hooks Quiz',
    'Evaluates useEffect, useMemo, custom hooks, and server components.',
    20,
    75.00,
    '10000000-0000-4000-a000-000000001044'
);

-- Questions for QZ-501
INSERT INTO quiz_questions (id, quiz_id, question_order, question_text, explanation, points)
VALUES
(
    '80000000-0000-4000-a000-000000000001',
    '70000000-0000-4000-a000-000000000501',
    1,
    'Which activation function is most commonly used in hidden layers of Deep Neural Networks to prevent vanishing gradients?',
    'ReLU outputs zero for negative inputs and identity for positive inputs, preventing derivative saturation.',
    10
),
(
    '80000000-0000-4000-a000-000000000002',
    '70000000-0000-4000-a000-000000000501',
    2,
    'What is the primary role of the Backpropagation algorithm?',
    'Backpropagation applies the chain rule backward from loss to compute gradients for parameter updates.',
    10
),
(
    '80000000-0000-4000-a000-000000000003',
    '70000000-0000-4000-a000-000000000501',
    3,
    'In Convolutional Neural Networks, what does a Max Pooling layer do?',
    'Max pooling takes the maximum value in a window grid, downsampling features while preserving translation invariance.',
    10
);

-- Options for QZ-501 Question 1
INSERT INTO quiz_options (question_id, option_text, option_order, is_correct) VALUES
('80000000-0000-4000-a000-000000000001', 'Sigmoid', 1, FALSE),
('80000000-0000-4000-a000-000000000001', 'ReLU (Rectified Linear Unit)', 2, TRUE),
('80000000-0000-4000-a000-000000000001', 'Softmax', 3, FALSE),
('80000000-0000-4000-a000-000000000001', 'Tanh', 4, FALSE);

-- Options for QZ-501 Question 2
INSERT INTO quiz_options (question_id, option_text, option_order, is_correct) VALUES
('80000000-0000-4000-a000-000000000002', 'To compute loss directly without gradients', 1, FALSE),
('80000000-0000-4000-a000-000000000002', 'To update network weights by calculating loss gradients via the chain rule', 2, TRUE),
('80000000-0000-4000-a000-000000000002', 'To randomly shuffle training samples', 3, FALSE),
('80000000-0000-4000-a000-000000000002', 'To compress input images into lower dimensions', 4, FALSE);

-- Options for QZ-501 Question 3
INSERT INTO quiz_options (question_id, option_text, option_order, is_correct) VALUES
('80000000-0000-4000-a000-000000000003', 'Increases spatial resolution of feature maps', 1, FALSE),
('80000000-0000-4000-a000-000000000003', 'Reduces spatial dimensions while preserving dominant features', 2, TRUE),
('80000000-0000-4000-a000-000000000003', 'Adds bias parameters to zero padding', 3, FALSE),
('80000000-0000-4000-a000-000000000003', 'Applies a linear transformation across channels', 4, FALSE);

-- Quiz Attempt for Alex Morgan
INSERT INTO quiz_attempts (id, quiz_id, student_id, attempt_number, started_at, completed_at, score_percentage, total_score, xp_earned, status)
VALUES
(
    '90000000-0000-4000-a000-000000000001',
    '70000000-0000-4000-a000-000000000502',
    '20000000-0000-4000-a000-000000008219',
    1,
    CURRENT_TIMESTAMP - INTERVAL '5 days',
    CURRENT_TIMESTAMP - INTERVAL '5 days' + INTERVAL '12 minutes',
    100.00,
    100.00,
    250,
    'completed'
);

-- =============================================================================
-- 7. SEED ACHIEVEMENTS & GAMIFICATION XP LOGS
-- =============================================================================

INSERT INTO achievements (id, title, description, icon, requirement)
VALUES
('a0000000-0000-4000-a000-000000000001', '14-Day Streak Master', 'Logged in and completed learning tasks for 14 consecutive days.', '🔥', '14 Consecutive Days'),
('a0000000-0000-4000-a000-000000000002', 'AI Wizard', 'Scored 95%+ on 5 AI Neural Network Quizzes.', '🧠', '5 Quizzes Scored 95%+'),
('a0000000-0000-4000-a000-000000000003', 'Speed Demon', 'Submitted 3 assignments at least 48 hours before deadline.', '⚡', '3 Early Submissions'),
('a0000000-0000-4000-a000-000000000004', 'Code Titan', 'Completed 50 coding challenges in the interactive workbench.', '💻', '42/50 Completed'),
('a0000000-0000-4000-a000-000000000005', 'Knowledge Pioneer', 'Helped 15 fellow classmates in discussion forums.', '🌟', '11/15 Helped'),
('a0000000-0000-4000-a000-000000000006', 'Polyglot Engineer', 'Completed certifications across 3 different domains.', '🏆', '3 Domains Certified');

-- User Achievements for Alex Morgan
INSERT INTO user_achievements (user_id, achievement_id, unlocked_at)
VALUES
('20000000-0000-4000-a000-000000008219', 'a0000000-0000-4000-a000-000000000001', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('20000000-0000-4000-a000-000000008219', 'a0000000-0000-4000-a000-000000000002', CURRENT_TIMESTAMP - INTERVAL '8 days'),
('20000000-0000-4000-a000-000000008219', 'a0000000-0000-4000-a000-000000000003', CURRENT_TIMESTAMP - INTERVAL '12 days'),
('20000000-0000-4000-a000-000000008219', 'a0000000-0000-4000-a000-000000000006', CURRENT_TIMESTAMP - INTERVAL '20 days');

-- XP Audit Transactions for Alex Morgan
INSERT INTO xp_transactions (user_id, xp_amount, source_type, earned_at)
VALUES
('20000000-0000-4000-a000-000000008219', 250, 'quiz', CURRENT_TIMESTAMP - INTERVAL '1 day'),
('20000000-0000-4000-a000-000000008219', 500, 'assignment', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('20000000-0000-4000-a000-000000008219', 300, 'streak', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('20000000-0000-4000-a000-000000008219', 200, 'badge', CURRENT_TIMESTAMP - INTERVAL '5 days');

-- =============================================================================
-- 8. SEED ANNOUNCEMENTS, CALENDAR EVENTS & CERTIFICATES
-- =============================================================================

INSERT INTO announcements (author_id, title, category, content, is_pinned, created_at)
VALUES
(
    '10000000-0000-4000-a000-000000001042',
    'Upcoming National AI Hackathon 2026',
    'Event',
    'Registrations are now open for the Annual LearnSphere National AI Hackathon with $50,000 in cloud credits and prizes!',
    TRUE,
    CURRENT_TIMESTAMP - INTERVAL '2 hours'
),
(
    '00000000-0000-4000-a000-000000000001',
    'Mid-Term Exam Schedule & Guidelines Released',
    'Academic',
    'Please review the updated examination timetable. All mid-term exams will be conducted on the LearnSphere secure test module.',
    TRUE,
    CURRENT_TIMESTAMP - INTERVAL '1 day'
),
(
    '10000000-0000-4000-a000-000000001043',
    'Guest Lecture: Generative AI at Scale by OpenAI Engineers',
    'Webinar',
    'Join us live this Thursday at 4:00 PM EST for an exclusive workshop on deploying transformer models in production.',
    FALSE,
    CURRENT_TIMESTAMP - INTERVAL '3 days'
);

INSERT INTO academic_events (title, description, event_date, start_time, end_time, time_slot_display, category, color_code, course_id, created_by)
VALUES
(
    'CNN PyTorch Assignment Deadline',
    'Final code submission for CIFAR-10 classifier',
    CURRENT_DATE + INTERVAL '1 day',
    '23:59:00',
    '23:59:00',
    '11:59 PM',
    'Assignment',
    '#ef4444',
    '30000000-0000-4000-a000-000000000401',
    '10000000-0000-4000-a000-000000001042'
),
(
    'Live Faculty Q&A: Deep Learning',
    'Office hours and review session',
    CURRENT_DATE + INTERVAL '3 days',
    '14:00:00',
    '15:30:00',
    '2:00 PM - 3:30 PM',
    'Session',
    '#4f46e5',
    '30000000-0000-4000-a000-000000000401',
    '10000000-0000-4000-a000-000000001042'
),
(
    'LearnSphere National AI Hackathon',
    '24-hour building event',
    CURRENT_DATE + INTERVAL '6 days',
    '09:00:00',
    '18:00:00',
    'All Day',
    'Hackathon',
    '#f59e0b',
    NULL,
    '00000000-0000-4000-a000-000000000001'
),
(
    'React 18 & Next.js Mid-Term Exam',
    'Online multiple choice & coding test',
    CURRENT_DATE + INTERVAL '9 days',
    '10:00:00',
    '12:00:00',
    '10:00 AM - 12:00 PM',
    'Exam',
    '#7c3aed',
    '30000000-0000-4000-a000-000000000205',
    '10000000-0000-4000-a000-000000001044'
);

INSERT INTO certificates (student_id, course_id, certificate_code, title, issuer, issue_date, pdf_url)
VALUES
(
    '20000000-0000-4000-a000-000000008219',
    '30000000-0000-4000-a000-000000000401',
    'LS-CERT-99481',
    'Advanced Artificial Intelligence & Neural Networks',
    'LearnSphere AI Institute',
    '2026-07-15',
    'https://storage.learnsphere.edu/certificates/ls-cert-99481.pdf'
),
(
    '20000000-0000-4000-a000-000000008219',
    '30000000-0000-4000-a000-000000000205',
    'LS-CERT-88210',
    'Full-Stack Web Development with React 18 & Next.js',
    'Meta & LearnSphere',
    '2026-05-20',
    'https://storage.learnsphere.edu/certificates/ls-cert-88210.pdf'
),
(
    '20000000-0000-4000-a000-000000008219',
    '30000000-0000-4000-a000-000000000108',
    'LS-CERT-77102',
    'Python for Data Science & Machine Learning',
    'Python Software Foundation',
    '2026-01-10',
    'https://storage.learnsphere.edu/certificates/ls-cert-77102.pdf'
);

INSERT INTO resource_library (name, description, resource_type, file_url, file_size, category, uploader_id)
VALUES
(
    'PyTorch_Deep_Learning_Cheatsheet.pdf',
    'Tensor operations and layer reference',
    'PDF',
    'https://storage.learnsphere.edu/resources/pytorch_cheatsheet.pdf',
    '3.4 MB',
    'Cheatsheet',
    '10000000-0000-4000-a000-000000001042'
),
(
    'Transformer_Attention_Mechanisms_Lecture.mp4',
    'Full HD lecture recording on self-attention',
    'VIDEO',
    'https://storage.learnsphere.edu/resources/transformer_lecture.mp4',
    '420 MB',
    'Lecture',
    '10000000-0000-4000-a000-000000001042'
),
(
    'CNN_CIFAR10_Starter_Code.zip',
    'PyTorch boilerplate starter code',
    'ZIP',
    'https://storage.learnsphere.edu/resources/cnn_starter.zip',
    '12 MB',
    'Code Starter',
    '10000000-0000-4000-a000-000000001042'
),
(
    'Official PyTorch Documentation & Tutorials',
    'External documentation link',
    'LINK',
    'https://pytorch.org/docs/stable/index.html',
    'Link',
    'Docs',
    '10000000-0000-4000-a000-000000001042'
);

COMMIT;

-- =============================================================================
-- SEED DATA INSERTED SUCCESSFULLY
-- =============================================================================

-- Auto-Generated 122 Student Portal Accounts
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000001', '125UIT001', 'Aarthi M', 'aarthi001@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 4, 5120) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000001', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000002', '125UIT002', 'Abinisha  T', 'abinisha002@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 7, 5240) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000002', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000003', '125UIT003', 'Abisake M', 'abisake003@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 10, 5360) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000003', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000004', '125UIT004', 'Ajay D', 'ajay004@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 13, 5480) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000004', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000005', '125UIT005', 'Ajay R', 'ajay005@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 16, 5600) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000005', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000006', '125UIT006', 'Akaash M', 'akaash006@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 19, 5720) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000006', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000007', '125UIT007', 'Akila V', 'akila007@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 22, 5840) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000007', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000008', '125UIT008', 'Alwin Richard C', 'alwin008@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 25, 5960) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000008', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000009', '125UIT009', 'Andruce Ajay A', 'andruce009@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 3, 6080) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000009', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000010', '125UIT010', 'Anitha R', 'anitha010@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 6, 6200) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000010', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000011', '125UIT011', 'Anu E', 'anu011@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 9, 6320) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000011', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000012', '125UIT012', 'Anusri A', 'anusri012@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 12, 6440) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000012', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000013', '125UIT013', 'Arjun Kumar B', 'arjun013@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 15, 6560) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000013', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000014', '125UIT014', 'Arjun M', 'arjun014@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 18, 6680) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000014', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000016', '125UIT016', 'Arun Prasath R A', 'arun016@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 24, 6920) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000016', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000017', '125UIT017', 'Balaji M', 'balaji017@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 2, 7040) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000017', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000018', '125UIT018', 'Brundha D', 'brundha018@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 5, 7160) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000018', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000019', '125UIT019', 'Dhanapriya K', 'dhanapriya019@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 8, 7280) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000019', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000020', '125UIT020', 'Dhanush G', 'dhanush020@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 11, 7400) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000020', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000021', '125UIT021', 'Dhanusha G', 'dhanusha021@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 14, 7520) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000021', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000022', '125UIT022', 'Dhanusri S S', 'dhanusri022@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 17, 7640) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000022', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000023', '125UIT023', 'Dharshan S', 'dharshan023@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 20, 7760) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000023', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000024', '125UIT024', 'Divyadharshini S', 'divyadharshini024@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 23, 7880) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000024', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000025', '125UIT025', 'Divyasri S U', 'divyasri025@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 1, 8000) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000025', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000026', '125UIT026', 'Elakiya S', 'elakiya026@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 4, 8120) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000026', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000027', '125UIT027', 'Enbathamizhan R', 'enbathamizhan027@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 7, 8240) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000027', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000028', '125UIT028', 'Gandhi Dass T', 'gandhi028@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 10, 8360) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000028', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000029', '125UIT029', 'Gokulnath B', 'gokulnath029@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 13, 8480) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000029', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000030', '125UIT030', 'Gopika C P', 'gopika030@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 16, 8600) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000030', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000031', '125UIT031', 'Gowtham V', 'gowtham031@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 19, 8720) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000031', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000032', '125UIT032', 'Hari Prasath S', 'hari032@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 22, 8840) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000032', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000033', '125UIT033', 'Harini P', 'harini033@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 25, 8960) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000033', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000034', '125UIT034', 'Haris R', 'haris034@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 3, 9080) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000034', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000035', '125UIT035', 'Harish V', 'harish035@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 6, 9200) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000035', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000036', '125UIT036', 'Hemasree S V', 'hemasree036@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 9, 9320) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000036', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000037', '125UIT037', 'Iniya V', 'iniya037@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 12, 9440) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000037', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000038', '125UIT038', 'Jayanthan M S', 'jayanthan038@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 15, 9560) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000038', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000039', '125UIT039', 'Jayasri S', 'jayasri039@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 18, 9680) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000039', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000040', '125UIT040', 'Jayasurya J', 'jayasurya040@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 21, 9800) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000040', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000041', '125UIT041', 'Jojish D', 'jojish041@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 24, 9920) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000041', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000042', '125UIT042', 'Kabilan N', 'kabilan042@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 2, 10040) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000042', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000043', '125UIT043', 'Kalaiselvan A', 'kalaiselvan043@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 5, 10160) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000043', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000044', '125UIT044', 'Kalaiselvan A', 'kalaiselvan044@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 8, 10280) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000044', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000045', '125UIT045', 'Kamalesh J', 'kamalesh045@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 11, 10400) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000045', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000046', '125UIT046', 'Karsan P', 'karsan046@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 14, 10520) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000046', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000047', '125UIT047', 'Kavidharshan D', 'kavidharshan047@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 17, 10640) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000047', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000048', '125UIT048', 'Kaviprasath P', 'kaviprasath048@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 20, 10760) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000048', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000049', '125UIT049', 'Kaviya M D', 'kaviya049@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 23, 10880) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000049', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000050', '125UIT050', 'Kaviyashree K', 'kaviyashree050@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 1, 11000) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000050', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000052', '125UIT052', 'Keerthika M', 'keerthika052@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 7, 11240) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000052', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000053', '125UIT053', 'Keerthika V', 'keerthika053@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 10, 11360) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000053', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000051', '125UIT051', 'Keerthivasan Y', 'keerthivasan051@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 4, 11120) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000051', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000054', '125UIT054', 'Kishor S', 'kishor054@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 13, 11480) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000054', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000055', '125UIT055', 'Kishore M', 'kishore055@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 16, 11600) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000055', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000056', '125UIT056', 'Laveena Sree D', 'laveena056@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 19, 11720) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000056', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000057', '125UIT057', 'Lohit S M', 'lohit057@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 22, 11840) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000057', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000058', '125UIT058', 'Madhan D', 'madhan058@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 25, 11960) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000058', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000059', '125UIT059', 'Madhumitha P', 'madhumitha059@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 3, 12080) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000059', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000060', '125UIT060', 'Manikandan M', 'manikandan060@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 6, 12200) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000060', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000061', '125UIT061', 'Manisha N', 'manisha061@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 9, 12320) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000061', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000062', '125UIT062', 'Megala K', 'megala062@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 12, 12440) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000062', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000063', '125UIT063', 'Melsan J', 'melsan063@gmail.com', 'Student', 'B.Tech IT (Section A)', '4th Semester', 15, 12560) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000063', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000064', '25UIT0064', 'Menosh J', 'menosh064@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 18, 12680) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000064', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000065', '25UIT0065', 'Mohan Prasath S', 'mohan065@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 21, 12800) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000065', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000066', '25UIT0066', 'Monish S', 'monish066@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 24, 12920) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000066', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000067', '25UIT0067', 'Mouleeswaran M', 'mouleeswaran067@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 2, 13040) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000067', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000068', '25UIT0068', 'Mukesh S P', 'mukesh068@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 5, 13160) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000068', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000069', '25UIT0069', 'Nalin Kumar K M', 'nalin069@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 8, 13280) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000069', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000070', '25UIT0070', 'Narmadha Devi P', 'narmadha070@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 11, 13400) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000070', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000071', '25UIT0071', 'Nihal Ahamed V A', 'nihal071@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 14, 13520) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000071', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000072', '25UIT0072', 'Nikitha Sri S', 'nikitha072@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 17, 13640) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000072', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000073', '25UIT0073', 'Nirmal B', 'nirmal073@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 20, 13760) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000073', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000074', '25UIT0074', 'Nishanth J', 'nishanth074@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 23, 13880) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000074', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000075', '25UIT0075', 'Nithersana Shree S', 'nithersana075@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 1, 14000) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000075', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000076', '25UIT0076', 'Parthasarathy R', 'parthasarathy076@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 4, 14120) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000076', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000077', '25UIT0077', 'Pradeepa P', 'pradeepa077@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 7, 14240) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000077', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000078', '25UIT0078', 'Prajan Kumar M', 'prajan078@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 10, 14360) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000078', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000079', '25UIT0079', 'Praveena V S', 'praveena079@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 13, 14480) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000079', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000080', '25UIT0080', 'Preethi S', 'preethi080@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 16, 14600) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000080', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000081', '25UIT0081', 'Priyadharshini M S', 'priyadharshini081@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 19, 14720) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000081', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000082', '25UIT0082', 'Raghuraj S', 'raghuraj082@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 22, 14840) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000082', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000083', '25UIT0083', 'Rakshana S', 'rakshana083@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 25, 14960) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000083', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000084', '25UIT0084', 'Renugasri M', 'renugasri084@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 3, 15080) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000084', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000085', '25UIT0085', 'Sakthipriyan K', 'sakthipriyan085@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 6, 15200) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000085', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000086', '25UIT0086', 'Sakthivelan M', 'sakthivelan086@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 9, 15320) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000086', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000088', '25UIT0088', 'Santhiya I', 'santhiya088@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 15, 15560) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000088', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000089', '25UIT0089', 'Sasikumar V', 'sasikumar089@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 18, 15680) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000089', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000090', '25UIT0090', 'Sathish R', 'sathish090@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 21, 15800) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000090', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000091', '25UIT0091', 'Sathishkumar S', 'sathishkumar091@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 24, 15920) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000091', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000093', '25UIT0093', 'Savinesh P', 'savinesh093@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 5, 16160) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000093', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000094', '25UIT0094', 'Sethunarayanan V', 'sethunarayanan094@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 8, 16280) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000094', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000095', '25UIT0095', 'Sethupathi S', 'sethupathi095@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 11, 16400) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000095', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000096', '25UIT0096', 'Shahith S', 'shahith096@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 14, 16520) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000096', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000097', '25UIT0097', 'Sham S', 'sham097@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 17, 16640) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000097', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000098', '25UIT0098', 'Sham S', 'sham098@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 20, 16760) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000098', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000099', '25UIT0099', 'Shifa T', 'shifa099@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 23, 16880) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000099', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000100', '25UIT0100', 'Shiva Shakthi S', 'shiva100@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 1, 17000) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000100', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000101', '25UIT0101', 'Shruthi S', 'shruthi101@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 4, 17120) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000101', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000102', '25UIT0102', 'Sidheswaran S', 'sidheswaran102@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 7, 17240) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000102', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000103', '25UIT0103', 'Siva K', 'siva103@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 10, 17360) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000103', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000104', '25UIT0104', 'Sree Samesh U', 'sree104@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 13, 17480) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000104', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000105', '25UIT0105', 'Sreetharan V', 'sreetharan105@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 16, 17600) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000105', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000106', '25UIT0106', 'Sridhar A', 'sridhar106@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 19, 17720) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000106', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000107', '25UIT0107', 'Srimathi R', 'srimathi107@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 22, 17840) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000107', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000108', '25UIT0108', 'Srisanth N', 'srisanth108@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 25, 17960) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000108', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000109', '25UIT0109', 'Sugapriya P', 'sugapriya109@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 3, 18080) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000109', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000110', '25UIT0110', 'Sushma S', 'sushma110@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 6, 18200) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000110', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000111', '25UIT0111', 'Sushmitta S', 'sushmitta111@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 9, 18320) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000111', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000112', '25UIT0112', 'Swetha G', 'swetha112@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 12, 18440) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000112', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000113', '25UIT0113', 'Tamil Arasi M', 'tamil113@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 15, 18560) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000113', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000114', '25UIT0114', 'Vanitha Shree R V', 'vanitha114@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 18, 18680) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000114', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000115', '25UIT0115', 'Venkatesan V', 'venkatesan115@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 21, 18800) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000115', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000116', '25UIT0116', 'Vetriselvan G', 'vetriselvan116@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 24, 18920) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000116', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000117', '25UIT0117', 'Vignesh P', 'vignesh117@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 2, 19040) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000117', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000118', '25UIT0118', 'Vignesh S', 'vignesh118@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 5, 19160) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000118', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000119', '25UIT0119', 'Vijay Kumar V', 'vijay119@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 8, 19280) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000119', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000120', '25UIT0120', 'Vinitha I', 'vinitha120@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 11, 19400) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000120', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000121', '25UIT0121', 'Vinthamizharuvi P', 'vinthamizharuvi121@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 14, 19520) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000121', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000122', '25UIT0122', 'Vishal P', 'vishal122@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 17, 19640) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000122', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000123', '25UIT0123', 'Yaalapathy S', 'yaalapathy123@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 20, 19760) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000123', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000124', '25UIT0124', 'Yashika S', 'yashika124@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 23, 19880) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000124', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
INSERT INTO users (id, user_code, name, email, role, department, semester, streak_days, total_xp) VALUES ('20000000-0000-4000-a000-000000000125', '25UIT0125', 'Yogeshwaran M', 'yogeshwaran125@gmail.com', 'Student', 'B.Tech IT (Section B)', '4th Semester', 1, 20000) ON CONFLICT (email) DO NOTHING;
INSERT INTO user_auth (user_id, password_hash) VALUES ('20000000-0000-4000-a000-000000000125', '/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3') ON CONFLICT (user_id) DO NOTHING;
