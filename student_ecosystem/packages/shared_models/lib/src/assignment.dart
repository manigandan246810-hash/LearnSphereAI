class Assignment {
  final String id;
  final String courseId;
  final String courseName;
  final String staffId;
  final String title;
  final String description;
  final DateTime deadline;
  final int maxMarks;
  final List<AssignmentSubmission> submissions;
  final DateTime createdAt;

  Assignment({
    required this.id,
    required this.courseId,
    required this.courseName,
    required this.staffId,
    required this.title,
    required this.description,
    required this.deadline,
    required this.maxMarks,
    this.submissions = const [],
    DateTime? createdAt,
  }) : createdAt = createdAt ?? DateTime.now();

  bool get isOverdue => DateTime.now().isAfter(deadline);

  Assignment copyWith({List<AssignmentSubmission>? submissions}) {
    return Assignment(
      id: id,
      courseId: courseId,
      courseName: courseName,
      staffId: staffId,
      title: title,
      description: description,
      deadline: deadline,
      maxMarks: maxMarks,
      submissions: submissions ?? this.submissions,
      createdAt: createdAt,
    );
  }
}

class AssignmentSubmission {
  final String id;
  final String assignmentId;
  final String studentId;
  final String studentName;
  final String fileName;
  final DateTime submittedAt;
  int? marksAwarded;
  String? rubricFeedback;
  bool isGraded;

  AssignmentSubmission({
    required this.id,
    required this.assignmentId,
    required this.studentId,
    required this.studentName,
    required this.fileName,
    DateTime? submittedAt,
    this.marksAwarded,
    this.rubricFeedback,
    this.isGraded = false,
  }) : submittedAt = submittedAt ?? DateTime.now();
}
