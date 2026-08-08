import 'package:flutter/material.dart';
import 'package:shared_models/shared_models.dart';

class StudentProvider extends ChangeNotifier {
  final _data = MockData.instance;

  // For demo purposes, we log in as the first student 'st1' (Arjun Patel)
  Student get currentStudent => _data.students.firstWhere((s) => s.id == 'st1');

  List<Course> get enrolledCourses => _data.courses
      .where((c) => currentStudent.enrolledCourseIds.contains(c.id))
      .toList();

  List<Course> get allCourses => List.unmodifiable(_data.courses);

  List<Assignment> get myAssignments => _data.assignments
      .where((a) => currentStudent.enrolledCourseIds.contains(a.courseId))
      .toList();

  List<McqTest> get myMcqTests => _data.mcqTests
      .where((t) => currentStudent.enrolledCourseIds.contains(t.courseId))
      .toList();

  // ─── Search & Filters ─────────────────────────────────────────────────────
  String _searchQuery = '';
  String get searchQuery => _searchQuery;

  List<String> _selectedTags = [];
  List<String> get selectedTags => _selectedTags;

  void setSearch(String q) {
    _searchQuery = q.toLowerCase();
    notifyListeners();
  }

  void toggleTag(String tag) {
    if (_selectedTags.contains(tag)) {
      _selectedTags.remove(tag);
    } else {
      _selectedTags.add(tag);
    }
    notifyListeners();
  }

  void clearFilters() {
    _searchQuery = '';
    _selectedTags.clear();
    notifyListeners();
  }

  List<Course> get filteredCatalog {
    return _data.courses.where((c) {
      final matchesSearch = _searchQuery.isEmpty ||
          c.title.toLowerCase().contains(_searchQuery) ||
          c.code.toLowerCase().contains(_searchQuery) ||
          c.description.toLowerCase().contains(_searchQuery);

      final matchesTags = _selectedTags.isEmpty ||
          _selectedTags.any((tag) => c.tags.contains(tag));

      return matchesSearch && matchesTags;
    }).toList();
  }

  List<String> get allUniqueTags {
    final tags = <String>{};
    for (final c in _data.courses) {
      tags.addAll(c.tags);
    }
    return tags.toList();
  }

  // ─── Course Enrollment ───────────────────────────────────────────────────
  void enrollInCourse(String courseId) {
    final sIdx = _data.students.indexWhere((s) => s.id == currentStudent.id);
    if (sIdx != -1) {
      final s = _data.students[sIdx];
      if (!s.enrolledCourseIds.contains(courseId)) {
        final newList = [...s.enrolledCourseIds, courseId];
        _data.students[sIdx] = s.copyWith(enrolledCourseIds: newList);
        notifyListeners();
      }
    }
  }

  // ─── Assignment Submissions ──────────────────────────────────────────────
  List<AssignmentSubmission> getMySubmissionsForAssignment(String assignmentId) {
    final assignment = _data.assignments.firstWhere((a) => a.id == assignmentId);
    return assignment.submissions.where((sub) => sub.studentId == currentStudent.id).toList();
  }

  void submitAssignment(String assignmentId, String fileName) {
    final aIdx = _data.assignments.indexWhere((a) => a.id == assignmentId);
    if (aIdx != -1) {
      final a = _data.assignments[aIdx];
      
      // Remove any previous submission for this student
      final updatedSubmissions = List<AssignmentSubmission>.from(a.submissions)
        ..removeWhere((sub) => sub.studentId == currentStudent.id);

      final newSub = AssignmentSubmission(
        id: 'sub_${DateTime.now().millisecondsSinceEpoch}',
        assignmentId: assignmentId,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        fileName: fileName,
        submittedAt: DateTime.now(),
      );

      updatedSubmissions.add(newSub);
      _data.assignments[aIdx] = a.copyWith(submissions: updatedSubmissions);
      notifyListeners();
    }
  }

  // ─── MCQ Attempts ────────────────────────────────────────────────────────
  McqAttempt? getMyAttemptForTest(String testId) {
    final test = _data.mcqTests.firstWhere((t) => t.id == testId);
    final match = test.attempts.where((a) => a.studentId == currentStudent.id);
    return match.isEmpty ? null : match.first;
  }

  void submitMcqAttempt(String testId, Map<String, int> answers, int score) {
    final tIdx = _data.mcqTests.indexWhere((t) => t.id == testId);
    if (tIdx != -1) {
      final t = _data.mcqTests[tIdx];

      // Remove any previous attempts
      final updatedAttempts = List<McqAttempt>.from(t.attempts)
        ..removeWhere((att) => att.studentId == currentStudent.id);

      final newAttempt = McqAttempt(
        id: 'att_${DateTime.now().millisecondsSinceEpoch}',
        testId: testId,
        studentId: currentStudent.id,
        studentName: currentStudent.name,
        answers: answers,
        score: score,
        submittedAt: DateTime.now(),
      );

      updatedAttempts.add(newAttempt);
      _data.mcqTests[tIdx] = t.copyWith(attempts: updatedAttempts);
      notifyListeners();
    }
  }

  // ─── Timetable & Deadlines Generation ────────────────────────────────────
  List<TimetableItem> get myTimetable {
    final items = <TimetableItem>[];
    
    // Add lecture times (simulated based on course index)
    int dayOffset = 0;
    for (final c in enrolledCourses) {
      final days = _getDaysForCourse(dayOffset);
      for (final d in days) {
        items.add(TimetableItem(
          title: '${c.code} Lecture',
          subtitle: 'Dr. ${c.staffName.split(' ').last} • Room ${100 + dayOffset * 10}',
          time: '10:00 AM - 11:30 AM',
          dayOfWeek: d,
          type: TimetableItemType.lecture,
        ));
      }
      dayOffset++;
    }

    // Add assignment deadlines
    for (final a in myAssignments) {
      final isSubmitted = getMySubmissionsForAssignment(a.id).isNotEmpty;
      items.add(TimetableItem(
        title: a.title,
        subtitle: 'Deadline for ${a.courseName.split(' ').first}',
        time: '${a.deadline.hour.toString().padLeft(2, '0')}:${a.deadline.minute.toString().padLeft(2, '0')}',
        dayOfWeek: _dayName(a.deadline.weekday),
        type: TimetableItemType.deadline,
        isCompleted: isSubmitted,
        dueDate: a.deadline,
      ));
    }

    // Add scheduled quizzes
    for (final t in myMcqTests) {
      final isAttempted = getMyAttemptForTest(t.id) != null;
      items.add(TimetableItem(
        title: t.title,
        subtitle: '${t.questions.length} MCQ Questions • ${t.durationMinutes} mins',
        time: '${t.scheduledAt.hour.toString().padLeft(2, '0')}:${t.scheduledAt.minute.toString().padLeft(2, '0')}',
        dayOfWeek: _dayName(t.scheduledAt.weekday),
        type: TimetableItemType.quiz,
        isCompleted: isAttempted,
        dueDate: t.scheduledAt,
      ));
    }

    // Sort by type (deadlines and quizzes first, then lectures)
    items.sort((a, b) {
      if (a.type != b.type) {
        return a.type.index.compareTo(b.type.index);
      }
      return a.title.compareTo(b.title);
    });

    return items;
  }

  List<String> _getDaysForCourse(int offset) {
    final list = [
      ['Monday', 'Wednesday'],
      ['Tuesday', 'Thursday'],
      ['Monday', 'Friday'],
      ['Wednesday', 'Friday'],
    ];
    return list[offset % list.length];
  }

  String _dayName(int weekday) {
    switch (weekday) {
      case 1: return 'Monday';
      case 2: return 'Tuesday';
      case 3: return 'Wednesday';
      case 4: return 'Thursday';
      case 5: return 'Friday';
      case 6: return 'Saturday';
      default: return 'Sunday';
    }
  }

  // ─── Streaks & Mock Study Metrics ───────────────────────────────────────
  int get studyStreak => 7; // 7-day study streak
  
  double get curriculumProgressPercentage {
    // Total modules count vs completed modules (simulated as 85%)
    return 0.85;
  }

  List<double> get weeklyProgressMinutes {
    // Mon to Sun minutes spent studying
    return [45.0, 60.0, 90.0, 30.0, 120.0, 40.0, 75.0];
  }
}

enum TimetableItemType { deadline, quiz, lecture }

class TimetableItem {
  final String title;
  final String subtitle;
  final String time;
  final String dayOfWeek;
  final TimetableItemType type;
  final bool isCompleted;
  final DateTime? dueDate;

  TimetableItem({
    required this.title,
    required this.subtitle,
    required this.time,
    required this.dayOfWeek,
    required this.type,
    this.isCompleted = false,
    this.dueDate,
  });
}
