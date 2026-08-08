class Student {
  final String id;
  final String name;
  final String email;
  final String rollNumber;
  final String department;
  final int semester;
  final String tempPassword;
  final List<String> enrolledCourseIds;
  final double attendancePercentage;
  final DateTime createdAt;
  bool isActive;

  Student({
    required this.id,
    required this.name,
    required this.email,
    required this.rollNumber,
    required this.department,
    required this.semester,
    required this.tempPassword,
    this.enrolledCourseIds = const [],
    this.attendancePercentage = 100.0,
    DateTime? createdAt,
    this.isActive = true,
  }) : createdAt = createdAt ?? DateTime.now();

  bool get isLowAttendance => attendancePercentage < 75.0;

  Student copyWith({
    String? name,
    String? email,
    String? rollNumber,
    String? department,
    int? semester,
    List<String>? enrolledCourseIds,
    double? attendancePercentage,
    bool? isActive,
  }) {
    return Student(
      id: id,
      name: name ?? this.name,
      email: email ?? this.email,
      rollNumber: rollNumber ?? this.rollNumber,
      department: department ?? this.department,
      semester: semester ?? this.semester,
      tempPassword: tempPassword,
      enrolledCourseIds: enrolledCourseIds ?? this.enrolledCourseIds,
      attendancePercentage: attendancePercentage ?? this.attendancePercentage,
      createdAt: createdAt,
      isActive: isActive ?? this.isActive,
    );
  }

  Map<String, dynamic> toMap() => {
    'id': id,
    'name': name,
    'email': email,
    'rollNumber': rollNumber,
    'department': department,
    'semester': semester,
    'tempPassword': tempPassword,
    'attendancePercentage': attendancePercentage,
    'isActive': isActive,
  };

  factory Student.fromCsvRow(List<dynamic> row, String tempPassword) {
    return Student(
      id: DateTime.now().millisecondsSinceEpoch.toString() + row[0].toString(),
      name: row[0].toString().trim(),
      email: row[1].toString().trim(),
      rollNumber: row[2].toString().trim(),
      department: row.length > 3 ? row[3].toString().trim() : 'Engineering',
      semester: row.length > 4 ? int.tryParse(row[4].toString()) ?? 1 : 1,
      tempPassword: tempPassword,
    );
  }
}
