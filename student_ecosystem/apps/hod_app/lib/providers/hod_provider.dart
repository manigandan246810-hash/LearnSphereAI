import 'package:flutter/material.dart';
import 'package:shared_models/shared_models.dart';

class HodProvider extends ChangeNotifier {
  final _data = MockData.instance;

  List<Staff> get staff => List.unmodifiable(_data.staff);
  List<Student> get students => List.unmodifiable(_data.students);
  List<Course> get courses => List.unmodifiable(_data.courses);
  List<AttendanceRecord> get attendanceRecords =>
      List.unmodifiable(_data.attendanceRecords);

  int get totalStudents => _data.totalStudents;
  int get totalStaff => _data.totalStaff;
  int get totalCourses => _data.totalCourses;
  int get lowAttendanceCount => _data.lowAttendanceCount;
  List<double> get weeklyAttendanceRates => _data.weeklyAttendanceRates;
  List<double> get weeklySubmissionRates => _data.weeklySubmissionRates;

  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  void setSearch(String q) {
    _searchQuery = q.toLowerCase();
    notifyListeners();
  }

  List<Student> get filteredStudents => _searchQuery.isEmpty
      ? students
      : students.where((s) =>
          s.name.toLowerCase().contains(_searchQuery) ||
          s.email.toLowerCase().contains(_searchQuery) ||
          s.rollNumber.toLowerCase().contains(_searchQuery)).toList();

  List<Staff> get filteredStaff => _searchQuery.isEmpty
      ? staff
      : staff.where((s) =>
          s.name.toLowerCase().contains(_searchQuery) ||
          s.email.toLowerCase().contains(_searchQuery) ||
          s.employeeId.toLowerCase().contains(_searchQuery)).toList();

  List<Course> get filteredCourses => _searchQuery.isEmpty
      ? courses
      : courses.where((c) =>
          c.title.toLowerCase().contains(_searchQuery) ||
          c.code.toLowerCase().contains(_searchQuery) ||
          c.department.toLowerCase().contains(_searchQuery)).toList();

  // ─── CRUD: Course ────────────────────────────────────────────────────────
  void addCourse(Course course) {
    _data.courses.add(course);
    notifyListeners();
  }

  void updateCourse(String id, Course updated) {
    final idx = _data.courses.indexWhere((c) => c.id == id);
    if (idx != -1) {
      _data.courses[idx] = updated;
      notifyListeners();
    }
  }

  void deleteCourse(String id) {
    _data.courses.removeWhere((c) => c.id == id);
    notifyListeners();
  }

  // ─── CRUD: Staff ─────────────────────────────────────────────────────────
  void addStaff(Staff s) {
    _data.staff.add(s);
    notifyListeners();
  }

  void updateStaff(String id, Staff updated) {
    final idx = _data.staff.indexWhere((s) => s.id == id);
    if (idx != -1) {
      _data.staff[idx] = updated;
      notifyListeners();
    }
  }

  void deleteStaff(String id) {
    _data.staff.removeWhere((s) => s.id == id);
    notifyListeners();
  }

  // ─── CRUD: Student ───────────────────────────────────────────────────────
  void addStudent(Student s) {
    _data.students.add(s);
    notifyListeners();
  }

  void updateStudent(String id, Student updated) {
    final idx = _data.students.indexWhere((s) => s.id == id);
    if (idx != -1) {
      _data.students[idx] = updated;
      notifyListeners();
    }
  }

  void deleteStudent(String id) {
    _data.students.removeWhere((s) => s.id == id);
    notifyListeners();
  }
}
