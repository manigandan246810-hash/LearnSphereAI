class Course {
  final String id;
  final String title;
  final String code;
  final String description;
  final String department;
  final String staffId;
  final String staffName;
  final int credits;
  final int semester;
  final List<String> tags;
  final List<CourseModule> modules;
  final DateTime createdAt;
  bool isActive;

  Course({
    required this.id,
    required this.title,
    required this.code,
    required this.description,
    required this.department,
    required this.staffId,
    required this.staffName,
    required this.credits,
    required this.semester,
    this.tags = const [],
    this.modules = const [],
    DateTime? createdAt,
    this.isActive = true,
  }) : createdAt = createdAt ?? DateTime.now();

  Course copyWith({
    String? title,
    String? description,
    String? staffId,
    String? staffName,
    bool? isActive,
    List<String>? tags,
    List<CourseModule>? modules,
  }) {
    return Course(
      id: id,
      title: title ?? this.title,
      code: code,
      description: description ?? this.description,
      department: department,
      staffId: staffId ?? this.staffId,
      staffName: staffName ?? this.staffName,
      credits: credits,
      semester: semester,
      tags: tags ?? this.tags,
      modules: modules ?? this.modules,
      createdAt: createdAt,
      isActive: isActive ?? this.isActive,
    );
  }
}

class CourseModule {
  final String id;
  final String title;
  final String type; // 'video' | 'notes' | 'pdf'
  final String url;
  final DateTime uploadedAt;

  CourseModule({
    required this.id,
    required this.title,
    required this.type,
    required this.url,
    DateTime? uploadedAt,
  }) : uploadedAt = uploadedAt ?? DateTime.now();
}
