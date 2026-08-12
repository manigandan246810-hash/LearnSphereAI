import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve('database/db.json');

// Helper to load DB
function loadDb() {
  if (!fs.existsSync(DB_FILE)) {
    return {};
  }
  try {
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.error('Error reading database file:', err);
    return {};
  }
}

// Helper to save DB
function saveDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing database file:', err);
  }
}

// Helper to generate UUIDs
function generateUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getAssignmentForWeek(courseCode, weekNumber, db) {
  if (courseCode === 'CS-401' && weekNumber === 4) return db.assignments?.find(a => a.assignment_code === 'ASN-101');
  if (courseCode === 'CS-302' && weekNumber === 2) return db.assignments?.find(a => a.assignment_code === 'ASN-102');
  if (courseCode === 'CS-205' && weekNumber === 1) return db.assignments?.find(a => a.assignment_code === 'ASN-100');
  return null;
}

function getQuizForWeek(courseCode, weekNumber, db) {
  if (courseCode === 'CS-401' && weekNumber === 3) return db.quizzes?.find(q => q.quiz_code === 'QZ-501');
  if (courseCode === 'CS-205' && weekNumber === 2) return db.quizzes?.find(q => q.quiz_code === 'QZ-502');
  return null;
}

class MockPool {
  on(event, handler) {
    // No-op for mock compatibility
  }

  async connect() {
    return {
      query: (sql, params) => this.query(sql, params),
      release: () => {}
    };
  }

  async query(sqlText, params = []) {
    const db = loadDb();
    const sql = sqlText.replace(/\s+/g, ' ').trim();
    const sqlLower = sql.toLowerCase();

    // 1. HEALTH CHECK
    if (sqlLower.includes('select 1 + 1 as health_check')) {
      return { rows: [{ health_check: 2 }], rowCount: 1 };
    }

    // 2. AUTH / USER LOGIN
    if (sqlLower.includes('from users u join user_auth a on u.id = a.user_id')) {
      const email = params[0];
      const role = params[0];
      
      let user = null;
      if (sqlLower.includes('u.email = $1')) {
        user = db.users?.find(u => u.email === email);
      } else if (sqlLower.includes('u.role = $1')) {
        const targetRole = role === 'Student' ? 'Student' : 'Faculty';
        user = db.users?.find(u => u.role === targetRole);
      }

      if (!user) {
        return { rows: [], rowCount: 0 };
      }

      const auth = db.user_auth?.find(a => a.user_id === user.id);
      return {
        rows: [{ ...user, password_hash: auth?.password_hash || '$2a$12$e8x9/K.1J82g1wK9xH5V8uW3ZgqL7F9bA1cD3e5f7g8h9i0j1k2l3' }],
        rowCount: 1
      };
    }

    // 3. USER SKILLS
    if (sqlLower.includes('select skill_name from user_skills')) {
      const userId = params[0];
      const skills = db.user_skills?.filter(s => s.user_id === userId) || [];
      return { rows: skills, rowCount: skills.length };
    }

    // 4. USER PROFILE BY ID
    if (sqlLower.includes('select * from users where id = $1')) {
      const userId = params[0];
      const user = db.users?.find(u => u.id === userId);
      return { rows: user ? [user] : [], rowCount: user ? 1 : 0 };
    }

    // 5. USER RANK / STATS
    if (sqlLower.includes('dense_rank() over')) {
      const userId = params[0];
      const students = (db.users?.filter(u => u.role === 'Student') || [])
        .sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0));
      
      const index = students.findIndex(s => s.id === userId);
      const rank = index === -1 ? 2 : index + 1;
      return {
        rows: [{ rank, total_students: students.length }],
        rowCount: 1
      };
    }

    // 6. COURSES & ENROLLMENTS & DYNAMIC PROGRESS
    if (sqlLower.includes('select') && sqlLower.includes('from courses c') && sqlLower.includes('instructor_id')) {
      const studentCode = params[0] || 'STU-88219';
      const student = db.users?.find(u => u.user_code === studentCode || u.id === studentCode);
      const studentId = student ? student.id : null;

      const courses = db.courses || [];
      const rows = courses.map(c => {
        const instructor = db.users?.find(u => u.id === c.instructor_id);
        const ce = db.course_enrollments?.find(e => e.course_id === c.id && e.student_id === studentId);
        
        // Calculate enrolled count
        const enrolledCount = db.course_enrollments?.filter(e => e.course_id === c.id).length || 1;

        // DYNAMIC PROGRESS CALCULATION (REQUISITES 3 & 13)
        // Required activities: lessons (video + reading), quizzes, assignments
        const courseLessons = db.lessons?.filter(l => {
          const mod = db.course_modules?.find(m => m.id === l.module_id);
          return mod && mod.course_id === c.id;
        }) || [];
        const courseQuizzes = db.quizzes?.filter(q => q.course_id === c.id) || [];
        const courseAssignments = db.assignments?.filter(a => a.course_id === c.id) || [];

        const totalActivities = (courseLessons.length * 2) + courseQuizzes.length + courseAssignments.length;
        
        let completedActivities = 0;
        if (studentId) {
          // Completed lessons (1 point for video watch, 1 point for notes read)
          let completedLessonPoints = 0;
          courseLessons.forEach(l => {
            const progress = db.lesson_progress?.find(p => p.student_id === studentId && p.lesson_id === l.id);
            if (progress) {
              const videoDone = progress.video_completed !== undefined ? !!progress.video_completed : progress.status === 'completed';
              const notesDone = progress.notes_completed !== undefined ? !!progress.notes_completed : progress.status === 'completed';
              if (videoDone) completedLessonPoints += 1;
              if (notesDone) completedLessonPoints += 1;
            }
          });

          // Completed quizzes
          const completedQuizzes = db.quiz_attempts?.filter(a => 
            a.student_id === studentId && 
            a.status === 'completed' &&
            courseQuizzes.some(q => q.id === a.quiz_id)
          ).length || 0;

          // Completed assignments
          const completedAssignments = db.assignment_submissions?.filter(s => 
            s.student_id === studentId && 
            (s.status === 'completed' || s.status === 'accepted') &&
            courseAssignments.some(a => a.id === s.assignment_id)
          ).length || 0;

          completedActivities = completedLessonPoints + completedQuizzes + completedAssignments;
        }

        const progress = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
        
        return {
          uuid: c.id,
          id: c.course_code,
          title: c.title,
          instructor: instructor ? instructor.name : 'Dr. Evelyn Vance',
          category: c.category,
          description: c.description,
          coverImage: c.cover_image_url,
          difficulty: c.difficulty,
          status: c.status,
          isBookmarked: ce ? !!ce.is_bookmarked : false,
          isFavorite: ce ? !!ce.is_favorite : false,
          enrolledStudents: enrolledCount,
          rating: 4.9,
          totalModules: db.course_modules?.filter(m => m.course_id === c.id).length || 6,
          completedModules: Math.round((progress / 100) * (db.course_modules?.filter(m => m.course_id === c.id).length || 6)),
          progress: progress,
          estimatedTimeLeft: progress === 100 ? '0h 0m' : '2h 45m'
        };
      });

      return { rows, rowCount: rows.length };
    }

    // 7. COURSE MODULES / WEEKLY CURRICULUM
    if (sqlLower.includes('from course_modules cm')) {
      const studentCode = params[0] || 'STU-88219';
      const student = db.users?.find(u => u.user_code === studentCode || u.id === studentCode);
      const studentId = student ? student.id : null;

      const modules = db.course_modules || [];
      const rows = modules.map(m => {
        const course = db.courses?.find(c => c.id === m.course_id);
        const courseCode = course ? course.course_code : '';

        // Find lessons for this module
        const lessons = db.lessons?.filter(l => l.module_id === m.id) || [];
        const lessonsWithProgress = lessons.map(l => {
          const progress = db.lesson_progress?.find(p => p.student_id === studentId && p.lesson_id === l.id);
          const videoCompleted = progress ? (progress.video_completed !== undefined ? !!progress.video_completed : progress.status === 'completed') : false;
          const notesCompleted = progress ? (progress.notes_completed !== undefined ? !!progress.notes_completed : progress.status === 'completed') : false;

          return {
            id: l.id,
            title: l.title,
            videoUrl: l.video_url || '#',
            videoCompleted,
            notesPdf: l.notes_pdf_url || '#',
            notesCompleted
          };
        });

        // Find assignment for this week
        const asn = getAssignmentForWeek(courseCode, m.week_number, db);
        let asnStatus = 'none';
        let asnId = null;
        let asnTitle = '';
        if (asn) {
          asnId = asn.id;
          asnTitle = asn.title;
          const subs = db.assignment_submissions?.filter(s => s.assignment_id === asn.id && s.student_id === studentId) || [];
          if (subs.length > 0) {
            subs.sort((a, b) => b.submission_attempt - a.submission_attempt);
            asnStatus = subs[0].status;
          } else {
            asnStatus = 'pending';
          }
        }

        // Find quiz for this week
        const quiz = getQuizForWeek(courseCode, m.week_number, db);
        let quizStatus = 'none';
        let quizId = null;
        let quizTitle = '';
        let quizScore = 'Locked';
        if (quiz) {
          quizId = quiz.id;
          quizTitle = quiz.title;
          const attempt = db.quiz_attempts?.find(a => a.quiz_id === quiz.id && a.student_id === studentId);
          if (attempt) {
            quizStatus = 'completed';
            const totalQuestions = db.quiz_questions?.filter(q => q.quiz_id === quiz.id).length || 5;
            const correctCount = Math.round((attempt.score_percentage / 100) * totalQuestions);
            quizScore = `${correctCount}/${totalQuestions} (${attempt.score_percentage}%)`;
          } else {
            quizStatus = 'available';
            quizScore = 'Pending';
          }
        }

        // Calculate module status based on checklist items
        let status = 'upcoming';
        const hasLessons = lessonsWithProgress.length > 0;
        const allLessonsDone = lessonsWithProgress.every(l => l.videoCompleted && l.notesCompleted);
        const anyLessonStarted = lessonsWithProgress.some(l => l.videoCompleted || l.notesCompleted);

        const assignmentDone = asnStatus === 'none' || asnStatus === 'completed' || asnStatus === 'accepted';
        const quizDone = quizStatus === 'none' || quizStatus === 'completed';

        if ((!hasLessons || allLessonsDone) && assignmentDone && quizDone) {
          status = 'completed';
        } else if (anyLessonStarted || quizStatus === 'completed' || asnStatus === 'completed') {
          status = 'in-progress';
        }

        return {
          course_id: m.course_id,
          week: m.week_number,
          topic: m.title,
          status,
          lessons: lessonsWithProgress,
          assignment: asn ? { id: asnId, title: asnTitle, status: asnStatus } : null,
          quiz: quiz ? { id: quizId, title: quizTitle, status: quizStatus } : null,
          quizScore
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 8. QUIZZES CATALOG
    if (sqlLower.includes('select') && sqlLower.includes('from quizzes q')) {
      const studentCode = params[0] || 'STU-88219';
      const student = db.users?.find(u => u.user_code === studentCode || u.id === studentCode);
      const studentId = student ? student.id : null;

      const quizzes = db.quizzes || [];
      const rows = quizzes.map(q => {
        const course = db.courses?.find(c => c.id === q.course_id);
        const questionsCount = db.quiz_questions?.filter(qq => qq.quiz_id === q.id).length || 3;
        
        // Find if student has completed this quiz
        const attempt = db.quiz_attempts?.find(qa => qa.quiz_id === q.id && qa.student_id === studentId);
        
        return {
          uuid: q.id,
          id: q.quiz_code,
          title: q.title,
          courseName: course ? course.title : 'General',
          durationMinutes: q.duration_minutes,
          questionsCount: questionsCount,
          avgScore: '85%',
          rank: 3,
          status: attempt ? 'completed' : 'available',
          lastScore: attempt ? `${attempt.score_percentage}%` : null
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 9. QUIZ QUESTIONS
    if (sqlLower.includes('from quiz_questions qq')) {
      const rows = db.quiz_questions?.map(qq => ({
        question_uuid: qq.id,
        quiz_id: qq.quiz_id,
        id: qq.question_order,
        question: qq.question_text,
        explanation: qq.explanation
      })) || [];
      return { rows, rowCount: rows.length };
    }

    // 10. QUIZ OPTIONS
    if (sqlLower.includes('from quiz_options')) {
      const rows = db.quiz_options?.map(qo => ({
        question_id: qo.question_id,
        option_uuid: qo.id,
        option_text: qo.option_text,
        option_order: qo.option_order,
        is_correct: qo.is_correct
      })) || [];
      return { rows, rowCount: rows.length };
    }

    // 11. SUBMISSIONS / ASSIGNMENTS
    if (sqlLower.includes('from assignments a') || (sqlLower.includes('select') && sqlLower.includes('from assignments'))) {
      const studentCode = params[0] || 'STU-88219';
      const student = db.users?.find(u => u.user_code === studentCode || u.id === studentCode);
      const studentId = student ? student.id : null;

      const assignments = db.assignments || [];
      const rows = assignments.map(a => {
        const course = db.courses?.find(c => c.id === a.course_id);
        const subs = db.assignment_submissions?.filter(s => s.assignment_id === a.id && s.student_id === studentId) || [];
        // Sort by attempt descending to get the latest attempt
        subs.sort((x, y) => (y.submission_attempt || 1) - (x.submission_attempt || 1));
        const sub = subs[0];
        
        return {
          uuid: a.id,
          id: a.assignment_code,
          title: a.title,
          instructions: a.instructions,
          dueDate: a.due_date,
          maxMarks: a.max_marks,
          courseName: course ? course.title : 'General',
          status: sub ? sub.status : 'Not Submitted',
          submittedFile: sub ? sub.submitted_file_name : null,
          submittedAt: sub ? sub.submitted_at : null,
          feedback: sub ? sub.feedback_comments : null,
          marksEarned: sub ? sub.earned_marks : null,
          gradedBy: sub ? sub.evaluated_by : null
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 12. ASSIGNMENT RUBRICS
    if (sqlLower.includes('from assignment_rubrics')) {
      const rows = db.assignment_rubrics?.map(r => ({
        assignment_id: r.assignment_id,
        criteria_text: r.criteria_text,
        max_points: r.max_points
      })) || [];
      return { rows, rowCount: rows.length };
    }

    // 13. LEADERBOARD
    if (sqlLower.includes('role = \'student\'') && sqlLower.includes('order by total_xp desc')) {
      const rows = (db.users?.filter(u => u.role === 'Student') || [])
        .sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0))
        .map((u, index) => ({
          rank: index + 1,
          name: u.name,
          total_xp: u.total_xp,
          avatar_url: u.avatar_url
        }));
      return { rows, rowCount: rows.length };
    }

    // 14. ANNOUNCEMENTS
    if (sqlLower.includes('from announcements')) {
      const rows = (db.announcements || []).map(a => {
        const author = db.users?.find(u => u.id === a.author_id);
        return {
          id: a.id,
          title: a.title,
          category: a.category,
          content: a.content,
          isPinned: a.is_pinned,
          authorName: author ? author.name : 'Faculty Member',
          authorAvatar: author ? author.avatar_url : null,
          createdAt: a.created_at
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 15. ACADEMIC EVENTS / CALENDAR
    if (sqlLower.includes('from academic_events')) {
      const rows = (db.academic_events || []).map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        date: e.event_date,
        time: e.time_slot_display,
        category: e.category,
        color: e.color_code
      }));
      return { rows, rowCount: rows.length };
    }

    // 16. RESOURCES
    if (sqlLower.includes('from resource_library')) {
      const rows = (db.resource_library || []).map(r => ({
        id: r.id || generateUuid(),
        name: r.name,
        description: r.description,
        type: r.resource_type,
        fileUrl: r.file_url,
        fileSize: r.file_size,
        category: r.category
      }));
      return { rows, rowCount: rows.length };
    }

    // 17. CERTIFICATES
    if (sqlLower.includes('from certificates')) {
      const studentCode = params[0] || 'STU-88219';
      const student = db.users?.find(u => u.user_code === studentCode || u.id === studentCode);
      const studentId = student ? student.id : null;

      const certs = db.certificates?.filter(c => c.student_id === studentId) || [];
      const rows = certs.map(c => {
        const course = db.courses?.find(co => co.id === c.course_id);
        return {
          id: c.certificate_code,
          title: c.title,
          courseName: course ? course.title : 'General',
          issuer: c.issuer,
          issueDate: c.issue_date,
          pdfUrl: c.pdf_url
        };
      });
      return { rows, rowCount: rows.length };
    }

    // 18. SIMPLE UTILITY GETTERS (first course / first user)
    if (sqlLower.includes('select id from courses limit 1')) {
      const id = db.courses?.[0]?.id || '30000000-0000-4000-a000-000000000401';
      return { rows: [{ id }], rowCount: 1 };
    }
    if (sqlLower.includes('select id from users where role = $1 limit 1')) {
      const targetRole = params[0];
      const user = db.users?.find(u => u.role === targetRole);
      return { rows: user ? [{ id: user.id }] : [], rowCount: user ? 1 : 0 };
    }
    if (sqlLower.includes('select id from users where user_code = $1 or role = $2 limit 1')) {
      const code = params[0];
      const role = params[1];
      const user = db.users?.find(u => u.user_code === code || u.role === role);
      return { rows: user ? [{ id: user.id }] : [], rowCount: user ? 1 : 0 };
    }
    if (sqlLower.includes('select id from users where user_code = $1')) {
      const code = params[0];
      const user = db.users?.find(u => u.user_code === code);
      return { rows: user ? [{ id: user.id }] : [], rowCount: user ? 1 : 0 };
    }
    if (sqlLower.includes('select id from courses where course_code = $1')) {
      const code = params[0];
      const course = db.courses?.find(c => c.course_code === code);
      return { rows: course ? [{ id: course.id }] : [], rowCount: course ? 1 : 0 };
    }
    if (sqlLower.includes('select id from quizzes where quiz_code = $1 or id::text = $1 limit 1')) {
      const code = params[0];
      const quiz = db.quizzes?.find(q => q.quiz_code === code || q.id === code);
      return { rows: quiz ? [{ id: quiz.id }] : [], rowCount: quiz ? 1 : 0 };
    }
    if (sqlLower.includes('select id from assignments where assignment_code = $1 or id::text = $1 limit 1')) {
      const code = params[0];
      const asn = db.assignments?.find(a => a.assignment_code === code || a.id === code);
      return { rows: asn ? [{ id: asn.id }] : [], rowCount: asn ? 1 : 0 };
    }
    if (sqlLower.includes('select id from achievements limit 1')) {
      const id = db.achievements?.[0]?.id || 'a0000000-0000-4000-a000-000000000001';
      return { rows: [{ id }], rowCount: 1 };
    }

    // 19. INSERT COURSE
    if (sqlLower.includes('insert into courses')) {
      const [course_code, title, category, description, instructor_id, cover_image_url] = params;
      const newCourse = {
        id: generateUuid(),
        course_code,
        title,
        category,
        description,
        instructor_id,
        cover_image_url,
        difficulty: 'Intermediate',
        status: 'Active'
      };
      db.courses = db.courses || [];
      db.courses.push(newCourse);
      saveDb(db);
      return { rows: [newCourse], rowCount: 1 };
    }

    // 20. BOOKMARK TOGGLE
    if (sqlLower.includes('insert into course_enrollments') && sqlLower.includes('on conflict')) {
      const [student_id, course_id] = params;
      db.course_enrollments = db.course_enrollments || [];
      let ce = db.course_enrollments.find(e => e.student_id === student_id && e.course_id === course_id);
      if (ce) {
        ce.is_bookmarked = !ce.is_bookmarked;
      } else {
        ce = { student_id, course_id, is_bookmarked: true, is_favorite: false };
        db.course_enrollments.push(ce);
      }
      saveDb(db);
      return { rows: [ce], rowCount: 1 };
    }

    // 21. INSERT ASSIGNMENT
    if (sqlLower.includes('insert into assignments')) {
      const [assignment_code, course_id, faculty_id, title, instructions, due_date, max_marks] = params;
      const newAsn = {
        id: generateUuid(),
        assignment_code,
        course_id,
        faculty_id,
        title,
        instructions,
        due_date,
        max_marks: Number(max_marks) || 100,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.assignments = db.assignments || [];
      db.assignments.push(newAsn);
      saveDb(db);
      return { rows: [newAsn], rowCount: 1 };
    }

    // 22. INSERT ASSIGNMENT SUBMISSION
    if (sqlLower.includes('insert into assignment_submissions')) {
      const assignment_id = params[0];
      const student_id = params[1];
      const submitted_file_name = params[2];
      const submitted_file_url = params[3];
      const status = params[4] || 'pending';
      const submission_attempt = Number(params[5]) || 1;
      
      db.assignment_submissions = db.assignment_submissions || [];

      // Check if that specific attempt exists
      const existingSub = db.assignment_submissions.find(s => 
        s.assignment_id === assignment_id && s.student_id === student_id && s.submission_attempt === submission_attempt
      );

      const sub = {
        id: existingSub ? existingSub.id : generateUuid(),
        assignment_id,
        student_id,
        submission_attempt,
        submitted_file_name,
        submitted_file_url,
        submitted_at: new Date().toISOString(),
        status,
        earned_marks: null,
        feedback_comments: null,
        evaluated_by: null,
        evaluated_at: null
      };

      if (existingSub) {
        Object.assign(existingSub, sub);
      } else {
        db.assignment_submissions.push(sub);
      }
      saveDb(db);
      return { rows: [sub], rowCount: 1 };
    }

    // 22a. SELECT MAX ASSIGNMENT SUBMISSION ATTEMPT
    if (sqlLower.includes('max(submission_attempt)')) {
      const [assignmentId, studentId] = params;
      const subs = db.assignment_submissions?.filter(s => s.assignment_id === assignmentId && s.student_id === studentId) || [];
      const maxAttempt = subs.reduce((max, s) => Math.max(max, s.submission_attempt || 0), 0);
      return { rows: [{ max_attempt: maxAttempt }], rowCount: 1 };
    }

    // 22b. SELECT ASSIGNMENT SUBMISSION HISTORY
    if (sqlLower.includes('from assignment_submissions sub') && sqlLower.includes('attempt')) {
      const [assignmentCode, studentCode] = params;
      
      const student = db.users?.find(u => u.user_code === studentCode || u.id === studentCode);
      const studentId = student ? student.id : null;
      
      const asn = db.assignments?.find(a => a.assignment_code === assignmentCode || a.id === assignmentCode);
      const asnId = asn ? asn.id : null;

      const subs = db.assignment_submissions?.filter(s => s.assignment_id === asnId && s.student_id === studentId) || [];
      const rows = subs.map(s => {
        const grader = db.users?.find(u => u.id === s.graded_by);
        return {
          attempt: s.submission_attempt,
          fileName: s.submitted_file_name,
          submittedAt: s.submitted_at,
          status: s.status,
          earnedMarks: s.earned_marks,
          feedback: s.feedback_comments,
          gradedBy: grader ? grader.name : 'Faculty Reviewer'
        };
      });
      rows.sort((a, b) => b.attempt - a.attempt);

      return { rows, rowCount: rows.length };
    }

    // 23. GRADE SUBMISSION
    if (sqlLower.includes('update assignment_submissions')) {
      // e.g. UPDATE assignment_submissions SET earned_marks = $1, feedback_comments = $2, status = $3, evaluated_at = CURRENT_TIMESTAMP WHERE id = $4
      // params: [marks, feedback, status, submissionId]
      const [marks, feedback, status, submissionId] = params;
      db.assignment_submissions = db.assignment_submissions || [];
      let sub = db.assignment_submissions.find(s => s.id === submissionId);
      if (!sub) {
        // Fallback for studentCode query
        if (params.length === 3) {
          const studentCode = params[2];
          const student = db.users?.find(u => u.user_code === studentCode || u.id === studentCode);
          if (student) {
            const studentSubs = db.assignment_submissions.filter(s => s.student_id === student.id);
            studentSubs.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
            sub = studentSubs[0];
          }
        }
      }
      if (sub) {
        sub.earned_marks = marks !== null ? Number(marks) : null;
        sub.feedback_comments = feedback;
        sub.status = status || 'completed';
        sub.evaluated_at = new Date().toISOString();
        saveDb(db);
        return { rows: [sub], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    // 24. INSERT QUIZ
    if (sqlLower.includes('insert into quizzes')) {
      const [quiz_code, course_id, title, duration_minutes, created_by] = params;
      const newQuiz = {
        id: generateUuid(),
        quiz_code,
        course_id,
        title,
        duration_minutes: Number(duration_minutes) || 15,
        passing_percentage: 70.00,
        created_by,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      db.quizzes = db.quizzes || [];
      db.quizzes.push(newQuiz);
      saveDb(db);
      return { rows: [newQuiz], rowCount: 1 };
    }

    // 25. INSERT QUIZ QUESTION
    if (sqlLower.includes('insert into quiz_questions')) {
      const [quiz_id, question_text, question_order] = params;
      const newQ = {
        id: generateUuid(),
        quiz_id,
        question_text,
        question_order: Number(question_order) || 1,
        explanation: 'AI generated explanation.'
      };
      db.quiz_questions = db.quiz_questions || [];
      db.quiz_questions.push(newQ);
      saveDb(db);
      return { rows: [newQ], rowCount: 1 };
    }

    // 26. INSERT QUIZ OPTION
    if (sqlLower.includes('insert into quiz_options')) {
      const [question_id, option_text, option_order, is_correct] = params;
      const newOpt = {
        id: generateUuid(),
        question_id,
        option_text,
        option_order: Number(option_order) || 1,
        is_correct: !!is_correct
      };
      db.quiz_options = db.quiz_options || [];
      db.quiz_options.push(newOpt);
      saveDb(db);
      return { rows: [newOpt], rowCount: 1 };
    }

    // 27. INSERT QUIZ ATTEMPT
    if (sqlLower.includes('insert into quiz_attempts')) {
      const [quiz_id, student_id, score_percentage, xp_earned, status, selected_answers] = params;
      db.quiz_attempts = db.quiz_attempts || [];
      const prevAttempts = db.quiz_attempts.filter(a => a.quiz_id === quiz_id && a.student_id === student_id);
      const nextAttemptNumber = prevAttempts.length + 1;
      
      const newAttempt = {
        id: generateUuid(),
        quiz_id,
        student_id,
        attempt_number: nextAttemptNumber,
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        score_percentage: Number(score_percentage) || 0,
        total_score: Number(score_percentage) || 0,
        xp_earned: Number(xp_earned) || 0,
        status: status || 'completed',
        selected_answers: selected_answers || '{}'
      };
      db.quiz_attempts.push(newAttempt);
      saveDb(db);
      return { rows: [newAttempt], rowCount: 1 };
    }

    // 27b. SELECT QUIZ ATTEMPTS FOR STUDENT/REVIEW
    if (sqlLower.includes('from quiz_attempts') && (sqlLower.includes('where quiz_id =') || sqlLower.includes('where qa.quiz_id ='))) {
      const [quizId, studentId] = params;
      const attempts = db.quiz_attempts?.filter(a => a.quiz_id === quizId && a.student_id === studentId) || [];
      attempts.sort((a, b) => new Date(b.completed_at) - new Date(a.completed_at));
      return { rows: attempts, rowCount: attempts.length };
    }

    // 28. INSERT XP TRANSACTION
    if (sqlLower.includes('insert into xp_transactions')) {
      const [user_id, xp_amount, source_type, source_id] = params;
      const newTx = {
        id: generateUuid(),
        user_id,
        xp_amount: Number(xp_amount) || 100,
        source_type,
        source_id,
        earned_at: new Date().toISOString()
      };
      db.xp_transactions = db.xp_transactions || [];
      db.xp_transactions.push(newTx);
      saveDb(db);
      return { rows: [newTx], rowCount: 1 };
    }

    // 29. UPDATE USER XP
    if (sqlLower.includes('update users set total_xp = total_xp + $1')) {
      const [xp, userId] = params;
      db.users = db.users || [];
      const user = db.users.find(u => u.id === userId);
      if (user) {
        user.total_xp = (user.total_xp || 0) + Number(xp);
        saveDb(db);
        return { rows: [user], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    // 30. INSERT ANNOUNCEMENT
    if (sqlLower.includes('insert into announcements')) {
      const [author_id, title, category, content, is_pinned] = params;
      const newAnn = {
        id: generateUuid(),
        author_id,
        title,
        category,
        content,
        is_pinned: !!is_pinned,
        created_at: new Date().toISOString()
      };
      db.announcements = db.announcements || [];
      db.announcements.push(newAnn);
      saveDb(db);
      return { rows: [newAnn], rowCount: 1 };
    }

    // 31. INSERT RESOURCE
    if (sqlLower.includes('insert into resource_library')) {
      const [name, description, resource_type, file_url, file_size, category, uploader_id] = params;
      const newRes = {
        id: generateUuid(),
        name,
        description,
        resource_type,
        file_url,
        file_size,
        category,
        uploader_id
      };
      db.resource_library = db.resource_library || [];
      db.resource_library.push(newRes);
      saveDb(db);
      return { rows: [newRes], rowCount: 1 };
    }

    // 32. UNLOCK ACHIEVEMENT
    if (sqlLower.includes('insert into user_achievements')) {
      const [student_id, achievement_id] = params;
      db.user_achievements = db.user_achievements || [];
      const exists = db.user_achievements.some(ua => ua.student_id === student_id && ua.achievement_id === achievement_id);
      if (!exists) {
        const ua = { student_id, achievement_id, unlocked_at: new Date().toISOString() };
        db.user_achievements.push(ua);
        saveDb(db);
        return { rows: [ua], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    // 33. UPDATE LESSON PROGRESS (REQUISITE 3)
    if (sqlLower.includes('update lesson_progress')) {
      const [status, activityType, lessonId, studentCode] = params;
      const student = db.users?.find(u => u.user_code === studentCode || u.id === studentCode);
      const studentId = student ? student.id : null;
      
      if (studentId) {
        db.lesson_progress = db.lesson_progress || [];
        let lp = db.lesson_progress.find(p => p.student_id === studentId && p.lesson_id === lessonId);
        if (!lp) {
          lp = {
            id: generateUuid(),
            student_id: studentId,
            lesson_id: lessonId,
            status: 'in-progress',
            progress_percentage: 0,
            video_completed: false,
            notes_completed: false,
            completed_at: null
          };
          db.lesson_progress.push(lp);
        }
        
        if (activityType === 'video') {
          lp.video_completed = true;
        } else if (activityType === 'notes') {
          lp.notes_completed = true;
        }
        
        if (lp.video_completed && lp.notes_completed) {
          lp.status = 'completed';
          lp.progress_percentage = 100;
          lp.completed_at = new Date().toISOString();
        } else {
          lp.status = 'in-progress';
          lp.progress_percentage = 50;
        }
        
        saveDb(db);
        return { rows: [lp], rowCount: 1 };
      }
      return { rows: [], rowCount: 0 };
    }

    // 34. INSERT COURSE MODULE
    if (sqlLower.includes('insert into course_modules')) {
      const [course_id, week_number, title] = params;
      db.course_modules = db.course_modules || [];
      
      let cm = db.course_modules.find(m => m.course_id === course_id && m.week_number === Number(week_number));
      if (cm) {
        cm.title = title;
      } else {
        cm = {
          id: generateUuid(),
          course_id,
          week_number: Number(week_number),
          title
        };
        db.course_modules.push(cm);
      }
      saveDb(db);
      return { rows: [cm], rowCount: 1 };
    }

    // 35. INSERT LESSON
    if (sqlLower.includes('insert into lessons')) {
      const [module_id, title, video_url, notes_pdf_url, display_order] = params;
      db.lessons = db.lessons || [];

      const newLesson = {
        id: generateUuid(),
        module_id,
        title,
        video_url,
        notes_pdf_url,
        display_order: Number(display_order) || 1
      };
      db.lessons.push(newLesson);
      saveDb(db);
      return { rows: [newLesson], rowCount: 1 };
    }

    console.warn('⚠️ MOCK DB: Unhandled Query Pattern:', sqlText);
    return { rows: [], rowCount: 0 };
  }
}

const pool = new MockPool();
export default pool;
