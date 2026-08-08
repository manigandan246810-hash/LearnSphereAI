import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:shared_models/shared_models.dart';
import '../theme/staff_theme.dart';
import '../providers/staff_provider.dart';

class AttendanceManagerScreen extends StatefulWidget {
  const AttendanceManagerScreen({super.key});

  @override
  State<AttendanceManagerScreen> createState() => _AttendanceManagerScreenState();
}

class _AttendanceManagerScreenState extends State<AttendanceManagerScreen> {
  Course? _selectedCourse;
  final Map<String, AttendanceStatus> _statusMap = {};
  bool _initialized = false;

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<StaffProvider>();
    final courses = prov.myCourses;

    if (courses.isEmpty) {
      return Container(
        color: StaffTheme.blueprintBg,
        child: Center(
          child: Text('No courses assigned to this faculty.',
              style: GoogleFonts.inter(color: StaffTheme.textSecondary, fontSize: 14)),
        ),
      );
    }

    if (!_initialized && _selectedCourse == null) {
      _selectedCourse = courses.first;
      _resetStatusMap(prov);
      _initialized = true;
    }

    // Filter students enrolled in the selected course
    final courseStudents = prov.allStudents
        .where((s) => s.enrolledCourseIds.contains(_selectedCourse!.id))
        .toList();

    final todayStr = DateFormat('EEEE, dd MMMM yyyy').format(DateTime.now());

    return Container(
      color: StaffTheme.blueprintBg,
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header Card with Course Selection & Date
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: StaffTheme.borderLight),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Digital Register',
                          style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: StaffTheme.navy)),
                      const SizedBox(height: 4),
                      Text(todayStr,
                          style: GoogleFonts.roboto(
                              fontSize: 13, color: StaffTheme.textSecondary)),
                    ],
                  ),
                ),
                const SizedBox(width: 24),
                // Dropdown to select course
                SizedBox(
                  width: 280,
                  height: 42,
                  child: DropdownButtonFormField<Course>(
                    value: _selectedCourse,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      filled: true,
                      fillColor: Colors.white,
                    ),
                    items: courses
                        .map((c) => DropdownMenuItem(
                              value: c,
                              child: Text(
                                '${c.code} — ${c.title}',
                                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600),
                                overflow: TextOverflow.ellipsis,
                              ),
                            ))
                        .toList(),
                    onChanged: (Course? val) {
                      if (val != null) {
                        setState(() {
                          _selectedCourse = val;
                          _resetStatusMap(prov);
                        });
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Action bar (Mark All Present, Submit)
          Row(
            children: [
              OutlinedButton.icon(
                onPressed: () => _markAll(AttendanceStatus.present, courseStudents),
                icon: const Icon(Icons.check_circle_outline_rounded, size: 16),
                label: const Text('Mark All Present'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: StaffTheme.steelBlue,
                  side: const BorderSide(color: StaffTheme.steelBlue),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
              ),
              const SizedBox(width: 12),
              OutlinedButton.icon(
                onPressed: () => _markAll(AttendanceStatus.absent, courseStudents),
                icon: const Icon(Icons.highlight_off_rounded, size: 16),
                label: const Text('Clear All / Reset'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: StaffTheme.textSecondary,
                  side: const BorderSide(color: StaffTheme.borderLight),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                ),
              ),
              const Spacer(),
              ElevatedButton.icon(
                onPressed: () => _submit(prov),
                icon: const Icon(Icons.send_rounded, size: 16),
                label: const Text('Submit Attendance Log'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: StaffTheme.successGreen,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Student Registry Attendance Grid
          Expanded(
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: StaffTheme.borderLight),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16),
                    child: Text(
                      'Enrolled Students (${courseStudents.length})',
                      style: GoogleFonts.inter(
                          fontSize: 14, fontWeight: FontWeight.w700, color: StaffTheme.textPrimary),
                    ),
                  ),
                  const Divider(height: 1, color: StaffTheme.borderLight),
                  Expanded(
                    child: ListView.separated(
                      padding: const EdgeInsets.all(8),
                      itemCount: courseStudents.length,
                      separatorBuilder: (_, __) => const SizedBox(height: 8),
                      itemBuilder: (context, idx) {
                        final s = courseStudents[idx];
                        final status = _statusMap[s.id] ?? AttendanceStatus.absent;
                        final isLow = s.isLowAttendance;

                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          decoration: BoxDecoration(
                            color: isLow ? StaffTheme.warningAmber.withOpacity(0.04) : StaffTheme.surfaceCard,
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(
                                color: isLow ? StaffTheme.warningAmber.withOpacity(0.3) : StaffTheme.borderLight),
                          ),
                          child: Row(
                            children: [
                              CircleAvatar(
                                radius: 18,
                                backgroundColor: isLow ? StaffTheme.warningAmber.withOpacity(0.15) : StaffTheme.steelBlue.withOpacity(0.1),
                                child: Text(
                                  s.name[0],
                                  style: GoogleFonts.inter(
                                      color: isLow ? StaffTheme.warningAmber : StaffTheme.steelBlue,
                                      fontWeight: FontWeight.w700,
                                      fontSize: 13),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(s.name,
                                            style: GoogleFonts.inter(
                                                fontSize: 13,
                                                fontWeight: FontWeight.w600,
                                                color: StaffTheme.textPrimary)),
                                        if (isLow) ...[
                                          const SizedBox(width: 8),
                                          Container(
                                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                            decoration: BoxDecoration(
                                              color: StaffTheme.errorRed.withOpacity(0.1),
                                              borderRadius: BorderRadius.circular(4),
                                            ),
                                            child: Text(
                                              'LOW ATTENDANCE: ${s.attendancePercentage.toStringAsFixed(1)}%',
                                              style: GoogleFonts.inter(
                                                  color: StaffTheme.errorRed,
                                                  fontSize: 9,
                                                  fontWeight: FontWeight.w700),
                                            ),
                                          ),
                                        ],
                                      ],
                                    ),
                                    Text('${s.rollNumber} • General Attendance: ${s.attendancePercentage.toStringAsFixed(1)}%',
                                        style: GoogleFonts.roboto(
                                            fontSize: 11, color: StaffTheme.textSecondary)),
                                  ],
                                ),
                              ),
                              // Toggle group
                              Row(
                                children: [
                                  _statusButton(s.id, AttendanceStatus.present, 'PRESENT', StaffTheme.successGreen),
                                  const SizedBox(width: 6),
                                  _statusButton(s.id, AttendanceStatus.late, 'LATE', StaffTheme.accentGold),
                                  const SizedBox(width: 6),
                                  _statusButton(s.id, AttendanceStatus.absent, 'ABSENT', StaffTheme.errorRed),
                                ],
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _statusButton(String studentId, AttendanceStatus status, String label, Color color) {
    final active = _statusMap[studentId] == status;
    return InkWell(
      onTap: () {
        setState(() {
          _statusMap[studentId] = status;
        });
      },
      borderRadius: BorderRadius.circular(6),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
        decoration: BoxDecoration(
          color: active ? color : Colors.transparent,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: active ? color : StaffTheme.borderLight),
        ),
        child: Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: active ? Colors.white : StaffTheme.textMuted,
            letterSpacing: 0.5,
          ),
        ),
      ),
    );
  }

  void _resetStatusMap(StaffProvider prov) {
    _statusMap.clear();
    if (_selectedCourse == null) return;
    final courseStudents = prov.allStudents
        .where((s) => s.enrolledCourseIds.contains(_selectedCourse!.id));
    for (final s in courseStudents) {
      _statusMap[s.id] = AttendanceStatus.present; // default to present
    }
  }

  void _markAll(AttendanceStatus status, List<Student> students) {
    setState(() {
      for (final s in students) {
        _statusMap[s.id] = status;
      }
    });
  }

  void _submit(StaffProvider prov) {
    if (_selectedCourse == null) return;
    prov.submitAttendance(_selectedCourse!.id, _selectedCourse!.title, _statusMap);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Attendance recorded successfully for ${_selectedCourse!.code}.'),
        backgroundColor: StaffTheme.successGreen,
      ),
    );
  }
}
