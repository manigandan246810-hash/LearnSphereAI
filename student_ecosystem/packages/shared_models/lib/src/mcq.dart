class McqTest {
  final String id;
  final String courseId;
  final String courseName;
  final String staffId;
  final String title;
  final List<McqQuestion> questions;
  final int durationMinutes;
  final DateTime scheduledAt;
  final bool isActive;
  final List<McqAttempt> attempts;

  McqTest({
    required this.id,
    required this.courseId,
    required this.courseName,
    required this.staffId,
    required this.title,
    required this.questions,
    required this.durationMinutes,
    required this.scheduledAt,
    this.isActive = true,
    this.attempts = const [],
  });

  int get totalMarks => questions.length;

  McqTest copyWith({List<McqAttempt>? attempts, bool? isActive}) {
    return McqTest(
      id: id,
      courseId: courseId,
      courseName: courseName,
      staffId: staffId,
      title: title,
      questions: questions,
      durationMinutes: durationMinutes,
      scheduledAt: scheduledAt,
      isActive: isActive ?? this.isActive,
      attempts: attempts ?? this.attempts,
    );
  }
}

class McqQuestion {
  final String id;
  final String prompt;
  final List<String> options;
  final int correctOptionIndex;

  McqQuestion({
    required this.id,
    required this.prompt,
    required this.options,
    required this.correctOptionIndex,
  });
}

class McqAttempt {
  final String id;
  final String testId;
  final String studentId;
  final String studentName;
  final Map<String, int> answers; // questionId → chosen option index
  final int score;
  final DateTime submittedAt;

  McqAttempt({
    required this.id,
    required this.testId,
    required this.studentId,
    required this.studentName,
    required this.answers,
    required this.score,
    DateTime? submittedAt,
  }) : submittedAt = submittedAt ?? DateTime.now();

  double get percentage => (score / answers.length) * 100;
}
