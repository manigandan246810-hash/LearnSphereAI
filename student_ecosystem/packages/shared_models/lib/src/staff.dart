class Staff {
  final String id;
  final String name;
  final String email;
  final String employeeId;
  final String department;
  final String designation;
  final List<String> assignedCourseIds;
  final DateTime joinedAt;
  bool isActive;

  Staff({
    required this.id,
    required this.name,
    required this.email,
    required this.employeeId,
    required this.department,
    required this.designation,
    this.assignedCourseIds = const [],
    DateTime? joinedAt,
    this.isActive = true,
  }) : joinedAt = joinedAt ?? DateTime.now();

  Staff copyWith({
    String? name,
    String? email,
    String? department,
    String? designation,
    List<String>? assignedCourseIds,
    bool? isActive,
  }) {
    return Staff(
      id: id,
      name: name ?? this.name,
      email: email ?? this.email,
      employeeId: employeeId,
      department: department ?? this.department,
      designation: designation ?? this.designation,
      assignedCourseIds: assignedCourseIds ?? this.assignedCourseIds,
      joinedAt: joinedAt,
      isActive: isActive ?? this.isActive,
    );
  }
}
