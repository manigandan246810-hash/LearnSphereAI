import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:shared_models/shared_models.dart';
import '../theme/hod_theme.dart';
import '../providers/hod_provider.dart';

class AttendanceAuditScreen extends StatelessWidget {
  const AttendanceAuditScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<HodProvider>();
    final records = prov.attendanceRecords;
    final lowStudents =
        prov.students.where((s) => s.isLowAttendance).toList();

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Attendance Audit',
              style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: HodTheme.textPrimary)),
          Text('Department-wide attendance monitoring and chronic absenteeism flags',
              style: GoogleFonts.roboto(
                  fontSize: 13, color: HodTheme.textSecondary)),
          const SizedBox(height: 24),
          // Summary stats
          Row(children: [
            _StatBox(
                label: 'Today\'s Sessions',
                value: records.length.toString(),
                color: HodTheme.steelBlue),
            const SizedBox(width: 16),
            _StatBox(
                label: 'Students Present',
                value: records.fold(0, (s, r) => s + r.presentCount).toString(),
                color: HodTheme.successGreen),
            const SizedBox(width: 16),
            _StatBox(
                label: 'Chronic Absentees',
                value: lowStudents.length.toString(),
                color: HodTheme.errorRed),
            const SizedBox(width: 16),
            _StatBox(
                label: 'Dept. Avg. Attendance',
                value:
                    '${(prov.students.fold(0.0, (s, st) => s + st.attendancePercentage) / (prov.students.isNotEmpty ? prov.students.length : 1)).toStringAsFixed(1)}%',
                color: HodTheme.accentCyan),
          ]),
          const SizedBox(height: 24),
          // Today's class sessions
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: HodTheme.borderLight),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Text("Today's Class Sessions",
                      style: GoogleFonts.inter(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: HodTheme.textPrimary)),
                ),
                const Divider(height: 1, color: HodTheme.borderLight),
                ...records.map((r) => _AttendanceSessionTile(record: r)),
              ],
            ),
          ),
          const SizedBox(height: 20),
          // Chronic absentees
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border:
                  Border.all(color: HodTheme.accentGold.withOpacity(0.35)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Row(children: [
                    const Icon(Icons.warning_amber_rounded,
                        color: HodTheme.accentGold, size: 20),
                    const SizedBox(width: 8),
                    Text('Chronic Absenteeism — Below 75%',
                        style: GoogleFonts.inter(
                            fontSize: 15,
                            fontWeight: FontWeight.w700,
                            color: HodTheme.textPrimary)),
                  ]),
                ),
                const Divider(height: 1, color: HodTheme.borderLight),
                if (lowStudents.isEmpty)
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Text('No chronic absentees — excellent!',
                        style: GoogleFonts.roboto(
                            fontSize: 13, color: HodTheme.textMuted)),
                  ),
                ...lowStudents.map((s) => Padding(
                      padding: const EdgeInsets.symmetric(
                          horizontal: 20, vertical: 14),
                      child: Row(children: [
                        CircleAvatar(
                          radius: 20,
                          backgroundColor:
                              HodTheme.errorRed.withOpacity(0.1),
                          child: Text(s.name[0],
                              style: GoogleFonts.inter(
                                  color: HodTheme.errorRed,
                                  fontWeight: FontWeight.w700)),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(s.name,
                                  style: GoogleFonts.inter(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                      color: HodTheme.textPrimary)),
                              Text(
                                  '${s.rollNumber} • ${s.department} • Sem ${s.semester}',
                                  style: GoogleFonts.roboto(
                                      fontSize: 12,
                                      color: HodTheme.textSecondary)),
                            ],
                          ),
                        ),
                        _AttendanceBadge(
                            percentage: s.attendancePercentage),
                      ]),
                    )),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _AttendanceSessionTile extends StatelessWidget {
  final AttendanceRecord record;
  const _AttendanceSessionTile({required this.record});

  @override
  Widget build(BuildContext context) {
    final pct = record.attendanceRate;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      decoration: const BoxDecoration(
          border:
              Border(bottom: BorderSide(color: HodTheme.borderLight))),
      child: Row(children: [
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: HodTheme.steelBlue.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: const Icon(Icons.class_rounded,
              color: HodTheme.steelBlue, size: 22),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(record.courseName,
                  style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: HodTheme.textPrimary)),
              Text(
                  '${DateFormat('dd MMM yyyy').format(record.date)}  •  ${record.presentCount}/${record.totalCount} present',
                  style: GoogleFonts.roboto(
                      fontSize: 12, color: HodTheme.textSecondary)),
            ],
          ),
        ),
        Column(crossAxisAlignment: CrossAxisAlignment.end, children: [
          Text('${pct.toStringAsFixed(1)}%',
              style: GoogleFonts.inter(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: pct >= 75
                      ? HodTheme.successGreen
                      : HodTheme.errorRed)),
          Text('Attendance rate',
              style: GoogleFonts.roboto(
                  fontSize: 11, color: HodTheme.textMuted)),
        ]),
        const SizedBox(width: 16),
        SizedBox(
          width: 120,
          child: LinearProgressIndicator(
            value: pct / 100,
            backgroundColor: HodTheme.borderLight,
            valueColor: AlwaysStoppedAnimation(
                pct >= 75 ? HodTheme.successGreen : HodTheme.errorRed),
            minHeight: 6,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
      ]),
    );
  }
}

class _StatBox extends StatelessWidget {
  final String label, value;
  final Color color;
  const _StatBox(
      {required this.label, required this.value, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: color.withOpacity(0.25)),
        ),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(value,
              style: GoogleFonts.inter(
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: color)),
          const SizedBox(height: 4),
          Text(label,
              style: GoogleFonts.roboto(
                  fontSize: 12, color: HodTheme.textSecondary)),
        ]),
      ),
    );
  }
}

class _AttendanceBadge extends StatelessWidget {
  final double percentage;
  const _AttendanceBadge({required this.percentage});

  @override
  Widget build(BuildContext context) {
    final color =
        percentage >= 75 ? HodTheme.successGreen : HodTheme.errorRed;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(6),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text('${percentage.toStringAsFixed(1)}%',
          style: GoogleFonts.inter(
              fontSize: 14, fontWeight: FontWeight.w700, color: color)),
    );
  }
}
