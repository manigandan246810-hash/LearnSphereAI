import 'student.dart';
import 'staff.dart';
import 'course.dart';
import 'attendance.dart';
import 'assignment.dart';
import 'mcq.dart';

/// Central mock data store — simulates a backend database.
/// All three apps read/write from this singleton in demo mode.
class MockData {
  MockData._();
  static final MockData instance = MockData._();

  // ─── Auth credentials (isolated per role) ───────────────────────────────
  static const hodEmail = 'hod@admin.edu';
  static const hodPassword = 'HOD@2024';
  static const staffEmail = 'staff@faculty.edu';
  static const staffPassword = 'Staff@2024';
  static const studentEmail = 'student@campus.edu';
  static const studentPassword = 'Student@2024';

  // ─── Staff ───────────────────────────────────────────────────────────────
  final List<Staff> staff = [
    Staff(
      id: 's1',
      name: 'Dr. Ananya Krishnan',
      email: 'staff@faculty.edu',
      employeeId: 'EMP001',
      department: 'Computer Science',
      designation: 'Associate Professor',
      assignedCourseIds: ['c1', 'c2'],
    ),
    Staff(
      id: 's2',
      name: 'Prof. Rahul Mehta',
      email: 'rahul@faculty.edu',
      employeeId: 'EMP002',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      assignedCourseIds: ['c3'],
    ),
    Staff(
      id: 's3',
      name: 'Dr. Priya Nair',
      email: 'priya@faculty.edu',
      employeeId: 'EMP003',
      department: 'Electronics',
      designation: 'Professor',
      assignedCourseIds: ['c4'],
    ),
  ];

  // ─── Students ────────────────────────────────────────────────────────────
  final List<Student> students = [
    Student(
      id: 'st1',
      name: 'Arjun Patel',
      email: 'student@campus.edu',
      rollNumber: 'CS2021001',
      department: 'Computer Science',
      semester: 6,
      tempPassword: 'Student@2024',
      enrolledCourseIds: ['c1', 'c2', 'c3'],
      attendancePercentage: 88.5,
    ),
    Student(
      id: 'st2',
      name: 'Shreya Reddy',
      email: 'shreya@campus.edu',
      rollNumber: 'CS2021002',
      department: 'Computer Science',
      semester: 6,
      tempPassword: 'Temp#5521',
      enrolledCourseIds: ['c1', 'c2'],
      attendancePercentage: 72.0,
    ),
    Student(
      id: 'st3',
      name: 'Karan Singh',
      email: 'karan@campus.edu',
      rollNumber: 'CS2021003',
      department: 'Computer Science',
      semester: 6,
      tempPassword: 'Temp#8834',
      enrolledCourseIds: ['c1', 'c3'],
      attendancePercentage: 95.0,
    ),
    Student(
      id: 'st4',
      name: 'Meera Iyer',
      email: 'meera@campus.edu',
      rollNumber: 'CS2021004',
      department: 'Computer Science',
      semester: 6,
      tempPassword: 'Temp#2267',
      enrolledCourseIds: ['c2', 'c3'],
      attendancePercentage: 68.0,
    ),
    Student(
      id: 'st5',
      name: 'Rohan Gupta',
      email: 'rohan@campus.edu',
      rollNumber: 'CS2021005',
      department: 'Computer Science',
      semester: 6,
      tempPassword: 'Temp#9912',
      enrolledCourseIds: ['c1'],
      attendancePercentage: 91.0,
    ),
  ];

  // ─── Courses ─────────────────────────────────────────────────────────────
  final List<Course> courses = [
    Course(
      id: 'c1',
      title: 'Advanced Data Structures & Algorithms',
      code: 'CS601',
      description:
          'In-depth coverage of trees, graphs, dynamic programming, and competitive algorithmic paradigms used in real-world engineering systems.',
      department: 'Computer Science',
      staffId: 's1',
      staffName: 'Dr. Ananya Krishnan',
      credits: 4,
      semester: 6,
      tags: ['Algorithms', 'Data Structures', 'Programming', 'Core'],
      modules: [
        CourseModule(id: 'm1', title: 'Introduction to Complexity', type: 'video', url: 'https://example.com/video1'),
        CourseModule(id: 'm2', title: 'Binary Search Trees — Notes', type: 'pdf', url: 'https://example.com/pdf1'),
        CourseModule(id: 'm3', title: 'Graph Algorithms Lecture', type: 'video', url: 'https://example.com/video2'),
      ],
    ),
    Course(
      id: 'c2',
      title: 'Database Management Systems',
      code: 'CS602',
      description:
          'Relational algebra, SQL, normalization, transaction management, indexing, and NoSQL paradigms for enterprise data engineering.',
      department: 'Computer Science',
      staffId: 's1',
      staffName: 'Dr. Ananya Krishnan',
      credits: 3,
      semester: 6,
      tags: ['Database', 'SQL', 'NoSQL', 'Core'],
      modules: [
        CourseModule(id: 'm4', title: 'ER Diagrams Lecture', type: 'video', url: 'https://example.com/video3'),
        CourseModule(id: 'm5', title: 'SQL Advanced — Notes', type: 'notes', url: 'https://example.com/notes1'),
      ],
    ),
    Course(
      id: 'c3',
      title: 'Operating Systems Design',
      code: 'CS603',
      description:
          'Process scheduling, memory management, file systems, synchronization primitives, and kernel architecture in modern OS design.',
      department: 'Computer Science',
      staffId: 's2',
      staffName: 'Prof. Rahul Mehta',
      credits: 4,
      semester: 6,
      tags: ['OS', 'Systems', 'Kernel', 'Core'],
      modules: [
        CourseModule(id: 'm6', title: 'Process Scheduling', type: 'video', url: 'https://example.com/video4'),
      ],
    ),
    Course(
      id: 'c4',
      title: 'Digital Signal Processing',
      code: 'EC501',
      description:
          'Fourier transforms, Z-transforms, filter design, digital signal representation and processing for communication systems.',
      department: 'Electronics',
      staffId: 's3',
      staffName: 'Dr. Priya Nair',
      credits: 3,
      semester: 5,
      tags: ['Signal Processing', 'Electronics', 'DSP'],
      modules: [],
    ),
  ];

  // ─── Attendance Records ───────────────────────────────────────────────────
  final List<AttendanceRecord> attendanceRecords = [
    AttendanceRecord(
      id: 'att1',
      courseId: 'c1',
      courseName: 'Advanced Data Structures & Algorithms',
      staffId: 's1',
      date: DateTime.now().subtract(const Duration(days: 1)),
      studentStatus: {
        'st1': AttendanceStatus.present,
        'st2': AttendanceStatus.absent,
        'st3': AttendanceStatus.present,
        'st4': AttendanceStatus.absent,
        'st5': AttendanceStatus.present,
      },
    ),
    AttendanceRecord(
      id: 'att2',
      courseId: 'c2',
      courseName: 'Database Management Systems',
      staffId: 's1',
      date: DateTime.now().subtract(const Duration(days: 1)),
      studentStatus: {
        'st1': AttendanceStatus.present,
        'st2': AttendanceStatus.late,
        'st4': AttendanceStatus.absent,
      },
    ),
  ];

  // ─── Assignments ──────────────────────────────────────────────────────────
  final List<Assignment> assignments = [
    Assignment(
      id: 'a1',
      courseId: 'c1',
      courseName: 'Advanced Data Structures & Algorithms',
      staffId: 's1',
      title: 'Implement a Red-Black Tree',
      description:
          'Implement a fully functional Red-Black Tree in any language of your choice. Include insert, delete, and search operations with proper rebalancing. Submit a ZIP with source code and a brief report.',
      deadline: DateTime.now().add(const Duration(days: 5)),
      maxMarks: 50,
      submissions: [
        AssignmentSubmission(
          id: 'sub1',
          assignmentId: 'a1',
          studentId: 'st1',
          studentName: 'Arjun Patel',
          fileName: 'rbt_arjun.zip',
          marksAwarded: 44,
          rubricFeedback: 'Excellent implementation. Minor edge case in deletion rebalancing.',
          isGraded: true,
        ),
      ],
    ),
    Assignment(
      id: 'a2',
      courseId: 'c2',
      courseName: 'Database Management Systems',
      staffId: 's1',
      title: 'SQL Query Optimization Report',
      description:
          'Analyse the given schema and write optimized SQL queries for all 10 scenarios. Include EXPLAIN plan output and performance comparison.',
      deadline: DateTime.now().add(const Duration(days: 3)),
      maxMarks: 30,
      submissions: [],
    ),
  ];

  // ─── MCQ Tests ────────────────────────────────────────────────────────────
  final List<McqTest> mcqTests = [
    McqTest(
      id: 'mcq1',
      courseId: 'c1',
      courseName: 'Advanced Data Structures & Algorithms',
      staffId: 's1',
      title: 'Unit 1 — Trees & Graphs Quiz',
      durationMinutes: 30,
      scheduledAt: DateTime.now().add(const Duration(days: 2)),
      questions: [
        McqQuestion(
          id: 'q1',
          prompt: 'What is the time complexity of searching in a balanced BST?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          correctOptionIndex: 1,
        ),
        McqQuestion(
          id: 'q2',
          prompt: 'Which traversal visits nodes in sorted order for a BST?',
          options: ['Pre-order', 'Post-order', 'In-order', 'Level-order'],
          correctOptionIndex: 2,
        ),
        McqQuestion(
          id: 'q3',
          prompt: 'Dijkstra\'s algorithm finds the shortest path in a graph with:',
          options: ['Negative weights', 'Non-negative weights', 'Any weights', 'Unweighted only'],
          correctOptionIndex: 1,
        ),
        McqQuestion(
          id: 'q4',
          prompt: 'AVL trees maintain balance by ensuring height difference between subtrees is at most:',
          options: ['0', '1', '2', '3'],
          correctOptionIndex: 1,
        ),
        McqQuestion(
          id: 'q5',
          prompt: 'BFS uses which data structure internally?',
          options: ['Stack', 'Queue', 'Heap', 'Tree'],
          correctOptionIndex: 1,
        ),
      ],
      attempts: [
        McqAttempt(
          id: 'att1',
          testId: 'mcq1',
          studentId: 'st1',
          studentName: 'Arjun Patel',
          answers: {'q1': 1, 'q2': 2, 'q3': 1, 'q4': 1, 'q5': 1},
          score: 5,
        ),
        McqAttempt(
          id: 'att2',
          testId: 'mcq1',
          studentId: 'st3',
          studentName: 'Karan Singh',
          answers: {'q1': 1, 'q2': 1, 'q3': 1, 'q4': 0, 'q5': 1},
          score: 3,
        ),
      ],
    ),
  ];

  // ─── Analytics helpers ────────────────────────────────────────────────────
  int get totalStudents => students.length;
  int get totalStaff => staff.length;
  int get totalCourses => courses.length;
  int get lowAttendanceCount =>
      students.where((s) => s.isLowAttendance).length;

  List<double> get weeklyAttendanceRates {
    // Simulated 7-day attendance rates
    return [78.0, 82.5, 79.0, 85.0, 88.5, 91.0, 86.0];
  }

  List<double> get weeklySubmissionRates {
    return [40.0, 55.0, 60.0, 70.0, 65.0, 80.0, 75.0];
  }
}
