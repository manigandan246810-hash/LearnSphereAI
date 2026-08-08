import 'package:flutter/material.dart';
import 'package:shared_models/shared_models.dart';
import 'package:uuid/uuid.dart';

class StaffProvider extends ChangeNotifier {
  final _data = MockData.instance;
  final _uuid = const Uuid();

  // The currently logged-in staff member (always s1 in demo)
  Staff get currentStaff => _data.staff.first;

  List<Course> get myCourses => _data.courses
      .where((c) => currentStaff.assignedCourseIds.contains(c.id))
      .toList();

  List<Student> get allStudents => List.unmodifiable(_data.students);
  List<AttendanceRecord> get attendanceRecords =>
      List.unmodifiable(_data.attendanceRecords);
  List<Assignment> get assignments =>
      List.unmodifiable(_data.assignments);
  List<McqTest> get mcqTests => List.unmodifiable(_data.mcqTests);

  // ─── CSV Onboarding ───────────────────────────────────────────────────────
  List<Student> _onboardedStudents = [];
  List<Student> get onboardedStudents => _onboardedStudents;

  void setOnboardedStudents(List<Student> students) {
    _onboardedStudents = students;
    for (final s in students) {
      _data.students.add(s);
    }
    notifyListeners();
  }

  String generateTempPassword() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    final rand = DateTime.now().millisecondsSinceEpoch;
    return 'Tmp#${chars[rand % chars.length]}${rand % 9000 + 1000}';
  }

  // ─── Attendance ───────────────────────────────────────────────────────────
  void submitAttendance(String courseId, String courseName,
      Map<String, AttendanceStatus> statusMap) {
    final record = AttendanceRecord(
      id: _uuid.v4(),
      courseId: courseId,
      courseName: courseName,
      staffId: currentStaff.id,
      date: DateTime.now(),
      studentStatus: statusMap,
    );
    _data.attendanceRecords.add(record);

    // Update each student's attendance percentage (simplified)
    for (final entry in statusMap.entries) {
      final idx = _data.students.indexWhere((s) => s.id == entry.key);
      if (idx != -1) {
        final s = _data.students[idx];
        final totalRecords = _data.attendanceRecords
            .where((r) => r.studentStatus.containsKey(s.id))
            .length;
        final presentCount = _data.attendanceRecords
            .where((r) =>
                r.studentStatus[s.id] == AttendanceStatus.present)
            .length;
        final newPct = totalRecords > 0
            ? (presentCount / totalRecords) * 100
            : 100.0;
        _data.students[idx] = s.copyWith(attendancePercentage: newPct);
      }
    }
    notifyListeners();
  }

  // ─── Content Module ───────────────────────────────────────────────────────
  void addCourseModule(String courseId, CourseModule module) {
    final idx = _data.courses.indexWhere((c) => c.id == courseId);
    if (idx != -1) {
      final updated = _data.courses[idx].copyWith(
          modules: [..._data.courses[idx].modules, module]);
      _data.courses[idx] = updated;
      notifyListeners();
    }
  }

  // ─── Assignments ──────────────────────────────────────────────────────────
  void addAssignment(Assignment a) {
    _data.assignments.add(a);
    notifyListeners();
  }

  void gradeSubmission(String assignmentId, String submissionId,
      int marks, String feedback) {
    final aIdx =
        _data.assignments.indexWhere((a) => a.id == assignmentId);
    if (aIdx != -1) {
      final a = _data.assignments[aIdx];
      final subs = a.submissions.map((sub) {
        if (sub.id == submissionId) {
          sub.marksAwarded = marks;
          sub.rubricFeedback = feedback;
          sub.isGraded = true;
        }
        return sub;
      }).toList();
      _data.assignments[aIdx] = a.copyWith(submissions: subs);
      notifyListeners();
    }
  }

  // ─── MCQ ─────────────────────────────────────────────────────────────────
  void addMcqTest(McqTest test) {
    _data.mcqTests.add(test);
    notifyListeners();
  }
}
