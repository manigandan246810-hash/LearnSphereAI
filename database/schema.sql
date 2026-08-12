-- =============================================================================
-- LEARNsphere AI - PostgreSQL Database Schema
-- Architecture: Production-Grade Normalized LMS Schema
-- Engine: PostgreSQL 13+ (Uses native gen_random_uuid())
-- =============================================================================

-- Enable UUID extension if required
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up existing schema objects if re-running
DROP TABLE IF EXISTS resource_library CASCADE;
DROP TABLE IF EXISTS certificates CASCADE;
DROP TABLE IF EXISTS academic_events CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS xp_transactions CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS quiz_answers CASCADE;
DROP TABLE IF EXISTS quiz_attempts CASCADE;
DROP TABLE IF EXISTS quiz_options CASCADE;
DROP TABLE IF EXISTS quiz_questions CASCADE;
DROP TABLE IF EXISTS quizzes CASCADE;
DROP TABLE IF EXISTS assignment_submissions CASCADE;
DROP TABLE IF EXISTS assignment_rubrics CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS lesson_progress CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS course_modules CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS user_skills CASCADE;
DROP TABLE IF EXISTS user_auth CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP FUNCTION IF EXISTS update_updated_at_column CASCADE;

-- =============================================================================
-- TRIGGER FUNCTION: Automatic updated_at Timestamps
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 1. USERS & AUTHENTICATION
-- =============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. STU-88219, FAC-1042, ADM-0001
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('Student', 'Faculty', 'Admin')),
    department VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    semester VARCHAR(50), -- e.g., '6th Semester' (Students)
    bio TEXT,
    faculty_title VARCHAR(100), -- e.g., 'Professor & Head of AI' (Faculty)
    office_hours VARCHAR(100), -- e.g., 'Mon/Wed 2:00 PM - 4:00 PM' (Faculty)
    github_url TEXT,
    linkedin_url TEXT,
    streak_days INTEGER NOT NULL DEFAULT 0 CHECK (streak_days >= 0),
    total_xp INTEGER NOT NULL DEFAULT 0 CHECK (total_xp >= 0),
    current_goal TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE user_auth (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    password_reset_token VARCHAR(255) UNIQUE,
    token_expires_at TIMESTAMPTZ
);

CREATE TABLE user_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_name VARCHAR(50) NOT NULL,
    proficiency_level VARCHAR(30) DEFAULT 'Intermediate', -- e.g., 'Beginner', 'Intermediate', 'Expert'
    CONSTRAINT unique_user_skill UNIQUE (user_id, skill_name)
);

-- =============================================================================
-- 2. COURSES & CURRICULUM HIERARCHY (Courses -> Modules -> Lessons)
-- =============================================================================

CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. CS-401, CS-302
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL, -- e.g., 'AI & Data Science', 'Software Engineering'
    instructor_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    cover_image_url TEXT,
    difficulty VARCHAR(30) NOT NULL DEFAULT 'Intermediate' CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Draft', 'Archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_courses_updated_at
BEFORE UPDATE ON courses
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE course_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    is_bookmarked BOOLEAN NOT NULL DEFAULT FALSE,
    is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
    CONSTRAINT unique_student_course_enrollment UNIQUE (student_id, course_id)
);

CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL CHECK (week_number > 0),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_course_week UNIQUE (course_id, week_number)
);

CREATE TRIGGER set_course_modules_updated_at
BEFORE UPDATE ON course_modules
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT,
    video_url TEXT,
    notes_pdf_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 1,
    duration_minutes INTEGER DEFAULT 45,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_lessons_updated_at
BEFORE UPDATE ON lessons
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE lesson_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('completed', 'in-progress', 'upcoming')),
    progress_percentage NUMERIC(5,2) NOT NULL DEFAULT 0.00 CHECK (progress_percentage BETWEEN 0 AND 100),
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_lesson UNIQUE (student_id, lesson_id)
);

-- =============================================================================
-- 3. ASSIGNMENTS, RUBRICS & EVALUATIONS
-- =============================================================================

CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. ASN-101
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    instructions TEXT NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    max_marks INTEGER NOT NULL DEFAULT 100 CHECK (max_marks > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_assignments_updated_at
BEFORE UPDATE ON assignments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE assignment_rubrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    criteria_text VARCHAR(255) NOT NULL,
    max_points INTEGER NOT NULL CHECK (max_points > 0),
    display_order INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    submission_attempt INTEGER NOT NULL DEFAULT 1,
    submitted_file_name VARCHAR(255),
    submitted_file_url TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'late', 'accepted', 'rejected')),
    earned_marks NUMERIC(5,2) CHECK (earned_marks >= 0),
    feedback_comments TEXT,
    evaluated_by UUID REFERENCES users(id) ON DELETE SET NULL,
    evaluated_at TIMESTAMPTZ,
    CONSTRAINT unique_student_assignment_attempt UNIQUE (assignment_id, student_id, submission_attempt)
);

-- =============================================================================
-- 4. QUIZZES, QUESTIONS, OPTIONS & ATTEMPTS
-- =============================================================================

CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_code VARCHAR(30) UNIQUE NOT NULL, -- e.g. QZ-501
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 15 CHECK (duration_minutes > 0),
    passing_percentage NUMERIC(5,2) NOT NULL DEFAULT 70.00,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_quizzes_updated_at
BEFORE UPDATE ON quizzes
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_order INTEGER NOT NULL DEFAULT 1,
    explanation TEXT,
    points INTEGER NOT NULL DEFAULT 10 CHECK (points > 0)
);

CREATE TABLE quiz_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    option_order INTEGER NOT NULL DEFAULT 1,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL DEFAULT 1,
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    score_percentage NUMERIC(5,2) DEFAULT 0.00,
    total_score NUMERIC(5,2) DEFAULT 0.00,
    xp_earned INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed', 'timed-out')),
    selected_answers TEXT
);

CREATE TABLE quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES quiz_options(id) ON DELETE CASCADE,
    is_correct BOOLEAN NOT NULL DEFAULT FALSE,
    points_earned NUMERIC(5,2) NOT NULL DEFAULT 0.00
);

-- =============================================================================
-- 5. GAMIFICATION & XP TRANSACTIONS
-- =============================================================================

CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(100) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon VARCHAR(10) NOT NULL, -- e.g. 🔥, 🧠, ⚡, 💻
    requirement VARCHAR(100) NOT NULL
);

CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_achievement UNIQUE (user_id, achievement_id)
);

CREATE TABLE xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    xp_amount INTEGER NOT NULL CHECK (xp_amount != 0),
    source_type VARCHAR(30) NOT NULL CHECK (source_type IN ('quiz', 'assignment', 'streak', 'badge', 'bonus')),
    source_id UUID, -- References quiz_attempts.id, assignment_submissions.id, etc.
    earned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 6. ANNOUNCEMENTS, CALENDAR & ASSETS
-- =============================================================================

CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'Academic' CHECK (category IN ('Academic', 'Event', 'Webinar', 'Exam Alert')),
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_announcements_updated_at
BEFORE UPDATE ON announcements
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE academic_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    time_slot_display VARCHAR(50), -- e.g. '11:59 PM', '2:00 PM - 3:30 PM'
    category VARCHAR(30) NOT NULL CHECK (category IN ('Assignment', 'Session', 'Exam', 'Hackathon')),
    color_code VARCHAR(20) DEFAULT '#4f46e5',
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    certificate_code VARCHAR(50) UNIQUE NOT NULL, -- e.g. LS-CERT-99481
    title VARCHAR(200) NOT NULL,
    issuer VARCHAR(100) NOT NULL DEFAULT 'LearnSphere AI Institute',
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_student_course_certificate UNIQUE (student_id, course_id)
);

CREATE TABLE resource_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    resource_type VARCHAR(30) NOT NULL CHECK (resource_type IN ('PDF', 'VIDEO', 'ZIP', 'LINK')),
    file_url TEXT NOT NULL,
    file_size VARCHAR(30), -- e.g. '3.4 MB'
    category VARCHAR(50) NOT NULL, -- e.g. 'Cheatsheet', 'Lecture', 'Code Starter'
    uploader_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- PERFORMANCE INDEXES
-- =============================================================================

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_total_xp ON users(total_xp DESC);
CREATE INDEX idx_user_skills_user ON user_skills(user_id);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_enrollments_student ON course_enrollments(student_id);
CREATE INDEX idx_enrollments_course ON course_enrollments(course_id);
CREATE INDEX idx_modules_course ON course_modules(course_id, week_number);
CREATE INDEX idx_lessons_module ON lessons(module_id);
CREATE INDEX idx_lesson_progress_student ON lesson_progress(student_id, lesson_id);
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_submissions_assignment ON assignment_submissions(assignment_id);
CREATE INDEX idx_submissions_student ON assignment_submissions(student_id);
CREATE INDEX idx_submissions_status ON assignment_submissions(status);
CREATE INDEX idx_quizzes_course ON quizzes(course_id);
CREATE INDEX idx_quiz_questions_quiz ON quiz_questions(quiz_id, question_order);
CREATE INDEX idx_quiz_options_question ON quiz_options(question_id);
CREATE INDEX idx_quiz_attempts_student ON quiz_attempts(student_id, quiz_id);
CREATE INDEX idx_xp_transactions_user_date ON xp_transactions(user_id, earned_at DESC);
CREATE INDEX idx_announcements_created ON announcements(created_at DESC);
CREATE INDEX idx_academic_events_date ON academic_events(event_date);
CREATE INDEX idx_certificates_student ON certificates(student_id);
CREATE INDEX idx_resources_category ON resource_library(category);

-- =============================================================================
-- DATABASE SCHEMA COMPLETED SUCCESSFULLY
-- =============================================================================
