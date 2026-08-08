class AttendanceRecord {
  final String id;
  final String courseId;
  final String courseName;
  final String staffId;
  final DateTime date;
  final Map<String, AttendanceStatus> studentStatus; // studentId → status

  AttendanceRecord({
    required this.id,
    required this.courseId,
    required this.courseName,
    required this.staffId,
    required this.date,
    this.studentStatus = const {},
  });

  int get presentCount =>
      studentStatus.values.where((s) => s == AttendanceStatus.present).length;
  int get absentCount =>
      studentStatus.values.where((s) => s == AttendanceStatus.absent).length;
  int get totalCount => studentStatus.length;
  double get attendanceRate =>
      totalCount > 0 ? (presentCount / totalCount) * 100 : 0.0;
}

enum AttendanceStatus { present, absent, late }

class StudentAttendanceSummary {
  final String studentId;
  final String studentName;
  final String courseId;
  final int totalClasses;
  final int attended;

  StudentAttendanceSummary({
    required this.studentId,
    required this.studentName,
    required this.courseId,
    required this.totalClasses,
    required this.attended,
  });

  double get percentage =>
      totalClasses > 0 ? (attended / totalClasses) * 100 : 0.0;
  bool get isLow => percentage < 75.0;
}
