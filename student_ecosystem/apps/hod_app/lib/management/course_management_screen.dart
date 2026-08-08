import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:shared_models/shared_models.dart';
import '../theme/hod_theme.dart';
import '../providers/hod_provider.dart';

class CourseManagementScreen extends StatefulWidget {
  const CourseManagementScreen({super.key});

  @override
  State<CourseManagementScreen> createState() =>
      _CourseManagementScreenState();
}

class _CourseManagementScreenState extends State<CourseManagementScreen> {
  void _showCourseDialog({Course? existing}) {
    final titleCtrl =
        TextEditingController(text: existing?.title ?? '');
    final codeCtrl =
        TextEditingController(text: existing?.code ?? '');
    final descCtrl =
        TextEditingController(text: existing?.description ?? '');
    final deptCtrl =
        TextEditingController(text: existing?.department ?? 'Computer Science');
    final credCtrl = TextEditingController(
        text: existing?.credits.toString() ?? '3');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(existing == null ? 'Add New Course' : 'Edit Course',
            style: GoogleFonts.inter(
                fontWeight: FontWeight.w700, color: HodTheme.textPrimary)),
        content: SizedBox(
          width: 500,
          child: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                _Field('Course Title', titleCtrl),
                const SizedBox(height: 12),
                Row(children: [
                  Expanded(child: _Field('Course Code', codeCtrl)),
                  const SizedBox(width: 12),
                  Expanded(child: _Field('Credits', credCtrl, keyboard: TextInputType.number)),
                ]),
                const SizedBox(height: 12),
                _Field('Department', deptCtrl),
                const SizedBox(height: 12),
                _Field('Description', descCtrl, maxLines: 3),
              ],
            ),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel',
                style: GoogleFonts.inter(color: HodTheme.textMuted)),
          ),
          ElevatedButton(
            onPressed: () {
              final prov = context.read<HodProvider>();
              if (existing == null) {
                prov.addCourse(Course(
                  id: DateTime.now().millisecondsSinceEpoch.toString(),
                  title: titleCtrl.text,
                  code: codeCtrl.text,
                  description: descCtrl.text,
                  department: deptCtrl.text,
                  staffId: '',
                  staffName: 'TBA',
                  credits: int.tryParse(credCtrl.text) ?? 3,
                  semester: 6,
                ));
              } else {
                prov.updateCourse(
                    existing.id,
                    existing.copyWith(
                      title: titleCtrl.text,
                      description: descCtrl.text,
                    ));
              }
              Navigator.pop(ctx);
            },
            child: Text(existing == null ? 'Add Course' : 'Save Changes'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<HodProvider>();
    final courses = prov.filteredCourses;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Course Management',
                    style: GoogleFonts.inter(
                        fontSize: 20,
                        fontWeight: FontWeight.w700,
                        color: HodTheme.textPrimary)),
                Text('${courses.length} courses registered',
                    style: GoogleFonts.roboto(
                        fontSize: 13, color: HodTheme.textSecondary)),
              ]),
              const Spacer(),
              ElevatedButton.icon(
                onPressed: () => _showCourseDialog(),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('Add Course'),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: HodTheme.borderLight),
            ),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                headingTextStyle: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: HodTheme.textMuted,
                    letterSpacing: 0.8),
                dataTextStyle: GoogleFonts.roboto(
                    fontSize: 13, color: HodTheme.textPrimary),
                columnSpacing: 32,
                columns: const [
                  DataColumn(label: Text('COURSE TITLE')),
                  DataColumn(label: Text('CODE')),
                  DataColumn(label: Text('DEPARTMENT')),
                  DataColumn(label: Text('CREDITS')),
                  DataColumn(label: Text('FACULTY')),
                  DataColumn(label: Text('STUDENTS')),
                  DataColumn(label: Text('STATUS')),
                  DataColumn(label: Text('ACTIONS')),
                ],
                rows: courses.map<DataRow>((c) {
                  final studentCount = prov.students
                      .where((s) => s.enrolledCourseIds.contains(c.id))
                      .length;
                  return DataRow(cells: [
                    DataCell(ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 220),
                      child: Text(c.title,
                          style: GoogleFonts.inter(
                              fontWeight: FontWeight.w600,
                              color: HodTheme.steelBlue),
                          overflow: TextOverflow.ellipsis),
                    )),
                    DataCell(Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: HodTheme.navy.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(c.code,
                          style: GoogleFonts.inter(
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              color: HodTheme.navy)),
                    )),
                    DataCell(Text(c.department)),
                    DataCell(Text('${c.credits} cr')),
                    DataCell(Text(c.staffName,
                        style: GoogleFonts.roboto(
                            fontSize: 12, color: HodTheme.textSecondary))),
                    DataCell(Text(studentCount.toString())),
                    DataCell(Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: c.isActive
                            ? HodTheme.successGreen.withOpacity(0.1)
                            : HodTheme.errorRed.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(c.isActive ? 'Active' : 'Inactive',
                          style: GoogleFonts.inter(
                              color: c.isActive
                                  ? HodTheme.successGreen
                                  : HodTheme.errorRed,
                              fontSize: 11,
                              fontWeight: FontWeight.w600)),
                    )),
                    DataCell(Row(
                      children: [
                        IconButton(
                          icon: const Icon(Icons.edit_outlined,
                              size: 16, color: HodTheme.steelBlue),
                          tooltip: 'Edit',
                          onPressed: () => _showCourseDialog(existing: c),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete_outline,
                              size: 16, color: HodTheme.errorRed),
                          tooltip: 'Delete',
                          onPressed: () => _confirmDelete(context, c.id,
                              c.title, prov.deleteCourse),
                        ),
                      ],
                    )),
                  ]);
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class StaffManagementScreen extends StatefulWidget {
  const StaffManagementScreen({super.key});

  @override
  State<StaffManagementScreen> createState() => _StaffManagementScreenState();
}

class _StaffManagementScreenState extends State<StaffManagementScreen> {
  void _showStaffDialog({Staff? existing}) {
    final nameCtrl = TextEditingController(text: existing?.name ?? '');
    final emailCtrl = TextEditingController(text: existing?.email ?? '');
    final empIdCtrl =
        TextEditingController(text: existing?.employeeId ?? '');
    final deptCtrl = TextEditingController(
        text: existing?.department ?? 'Computer Science');
    final desigCtrl = TextEditingController(
        text: existing?.designation ?? 'Assistant Professor');

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(existing == null ? 'Add Staff Member' : 'Edit Staff',
            style: GoogleFonts.inter(
                fontWeight: FontWeight.w700, color: HodTheme.textPrimary)),
        content: SizedBox(
          width: 460,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              _Field('Full Name', nameCtrl),
              const SizedBox(height: 12),
              _Field('Email Address', emailCtrl,
                  keyboard: TextInputType.emailAddress),
              const SizedBox(height: 12),
              Row(children: [
                Expanded(child: _Field('Employee ID', empIdCtrl)),
                const SizedBox(width: 12),
                Expanded(child: _Field('Designation', desigCtrl)),
              ]),
              const SizedBox(height: 12),
              _Field('Department', deptCtrl),
            ],
          ),
        ),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text('Cancel',
                  style: GoogleFonts.inter(color: HodTheme.textMuted))),
          ElevatedButton(
            onPressed: () {
              final prov = context.read<HodProvider>();
              if (existing == null) {
                prov.addStaff(Staff(
                  id: DateTime.now().millisecondsSinceEpoch.toString(),
                  name: nameCtrl.text,
                  email: emailCtrl.text,
                  employeeId: empIdCtrl.text,
                  department: deptCtrl.text,
                  designation: desigCtrl.text,
                ));
              } else {
                prov.updateStaff(
                    existing.id,
                    existing.copyWith(
                        name: nameCtrl.text,
                        email: emailCtrl.text,
                        designation: desigCtrl.text));
              }
              Navigator.pop(ctx);
            },
            child: Text(existing == null ? 'Add Staff' : 'Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<HodProvider>();
    final staffList = prov.filteredStaff;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(children: [
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Staff Management',
                  style: GoogleFonts.inter(
                      fontSize: 20,
                      fontWeight: FontWeight.w700,
                      color: HodTheme.textPrimary)),
              Text('${staffList.length} faculty members',
                  style: GoogleFonts.roboto(
                      fontSize: 13, color: HodTheme.textSecondary)),
            ]),
            const Spacer(),
            ElevatedButton.icon(
              onPressed: () => _showStaffDialog(),
              icon: const Icon(Icons.add, size: 16),
              label: const Text('Add Staff'),
            ),
          ]),
          const SizedBox(height: 20),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: HodTheme.borderLight),
            ),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                headingTextStyle: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: HodTheme.textMuted,
                    letterSpacing: 0.8),
                columnSpacing: 32,
                columns: const [
                  DataColumn(label: Text('NAME')),
                  DataColumn(label: Text('EMPLOYEE ID')),
                  DataColumn(label: Text('EMAIL')),
                  DataColumn(label: Text('DESIGNATION')),
                  DataColumn(label: Text('DEPARTMENT')),
                  DataColumn(label: Text('COURSES')),
                  DataColumn(label: Text('ACTIONS')),
                ],
                rows: staffList.map<DataRow>((s) => DataRow(cells: [
                      DataCell(Text(s.name,
                          style: GoogleFonts.inter(
                              fontWeight: FontWeight.w600,
                              color: HodTheme.steelBlue))),
                      DataCell(Text(s.employeeId)),
                      DataCell(Text(s.email,
                          style: GoogleFonts.roboto(
                              fontSize: 12,
                              color: HodTheme.textSecondary))),
                      DataCell(Text(s.designation)),
                      DataCell(Text(s.department)),
                      DataCell(Text(s.assignedCourseIds.length.toString())),
                      DataCell(Row(children: [
                        IconButton(
                          icon: const Icon(Icons.edit_outlined,
                              size: 16, color: HodTheme.steelBlue),
                          onPressed: () => _showStaffDialog(existing: s),
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete_outline,
                              size: 16, color: HodTheme.errorRed),
                          onPressed: () => _confirmDelete(
                              context, s.id, s.name, prov.deleteStaff),
                        ),
                      ])),
                    ])).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class StudentRegistryScreen extends StatefulWidget {
  const StudentRegistryScreen({super.key});

  @override
  State<StudentRegistryScreen> createState() =>
      _StudentRegistryScreenState();
}

class _StudentRegistryScreenState extends State<StudentRegistryScreen> {
  @override
  Widget build(BuildContext context) {
    final prov = context.watch<HodProvider>();
    final studentList = prov.filteredStudents;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Student Registry',
              style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: HodTheme.textPrimary)),
          Text('${studentList.length} enrolled students across all courses',
              style: GoogleFonts.roboto(
                  fontSize: 13, color: HodTheme.textSecondary)),
          const SizedBox(height: 20),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: HodTheme.borderLight),
            ),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: DataTable(
                headingTextStyle: GoogleFonts.inter(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: HodTheme.textMuted,
                    letterSpacing: 0.8),
                columnSpacing: 32,
                columns: const [
                  DataColumn(label: Text('STUDENT NAME')),
                  DataColumn(label: Text('ROLL NO.')),
                  DataColumn(label: Text('EMAIL')),
                  DataColumn(label: Text('SEMESTER')),
                  DataColumn(label: Text('COURSES')),
                  DataColumn(label: Text('ATTENDANCE')),
                  DataColumn(label: Text('STATUS')),
                  DataColumn(label: Text('ACTIONS')),
                ],
                rows: studentList.map<DataRow>((s) {
                  final attColor = s.isLowAttendance
                      ? HodTheme.errorRed
                      : HodTheme.successGreen;
                  return DataRow(cells: [
                    DataCell(Text(s.name,
                        style: GoogleFonts.inter(
                            fontWeight: FontWeight.w600,
                            color: HodTheme.steelBlue))),
                    DataCell(Text(s.rollNumber)),
                    DataCell(Text(s.email,
                        style: GoogleFonts.roboto(
                            fontSize: 12,
                            color: HodTheme.textSecondary))),
                    DataCell(Text('Sem ${s.semester}')),
                    DataCell(
                        Text(s.enrolledCourseIds.length.toString())),
                    DataCell(Row(children: [
                      if (s.isLowAttendance)
                        const Padding(
                          padding: EdgeInsets.only(right: 4),
                          child: Icon(Icons.warning_amber_rounded,
                              size: 14, color: HodTheme.accentGold),
                        ),
                      Text(
                          '${s.attendancePercentage.toStringAsFixed(1)}%',
                          style: GoogleFonts.inter(
                              fontSize: 12,
                              fontWeight: FontWeight.w700,
                              color: attColor)),
                    ])),
                    DataCell(Container(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: s.isActive
                            ? HodTheme.successGreen.withOpacity(0.1)
                            : HodTheme.errorRed.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(s.isActive ? 'Active' : 'Inactive',
                          style: GoogleFonts.inter(
                              color: s.isActive
                                  ? HodTheme.successGreen
                                  : HodTheme.errorRed,
                              fontSize: 11,
                              fontWeight: FontWeight.w600)),
                    )),
                    DataCell(Row(children: [
                      IconButton(
                        icon: const Icon(Icons.delete_outline,
                            size: 16, color: HodTheme.errorRed),
                        onPressed: () => _confirmDelete(
                            context, s.id, s.name, prov.deleteStudent),
                      ),
                    ])),
                  ]);
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ─── Shared helpers ────────────────────────────────────────────────────────────
Widget _Field(String label, TextEditingController ctrl,
    {int maxLines = 1,
    TextInputType keyboard = TextInputType.text}) {
  return TextField(
    controller: ctrl,
    maxLines: maxLines,
    keyboardType: keyboard,
    style: GoogleFonts.roboto(fontSize: 13, color: HodTheme.textPrimary),
    decoration: InputDecoration(
      labelText: label,
      labelStyle: GoogleFonts.inter(fontSize: 12, color: HodTheme.textSecondary),
      border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: HodTheme.borderLight)),
      enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: HodTheme.borderLight)),
      focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide:
              const BorderSide(color: HodTheme.steelBlue, width: 1.5)),
      contentPadding:
          const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
      filled: true,
      fillColor: HodTheme.blueprintBg,
    ),
  );
}

void _confirmDelete(BuildContext context, String id, String name,
    void Function(String) deleteFunc) {
  showDialog(
    context: context,
    builder: (ctx) => AlertDialog(
      title: Text('Confirm Delete',
          style: GoogleFonts.inter(
              fontWeight: FontWeight.w700, color: HodTheme.errorRed)),
      content: Text('Remove "$name" permanently? This cannot be undone.',
          style: GoogleFonts.roboto(color: HodTheme.textPrimary)),
      actions: [
        TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancel',
                style: GoogleFonts.inter(color: HodTheme.textMuted))),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: HodTheme.errorRed),
          onPressed: () {
            deleteFunc(id);
            Navigator.pop(ctx);
          },
          child: const Text('Delete'),
        ),
      ],
    ),
  );
}
