import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:provider/provider.dart';
import '../theme/hod_theme.dart';
import '../providers/hod_provider.dart';

class DailyReportsScreen extends StatelessWidget {
  const DailyReportsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<HodProvider>();
    final attRates = prov.weeklyAttendanceRates;
    final subRates = prov.weeklySubmissionRates;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Daily Reports & Analytics',
              style: GoogleFonts.inter(
                  fontSize: 20,
                  fontWeight: FontWeight.w700,
                  color: HodTheme.textPrimary)),
          Text(
              'System-wide performance metrics and departmental engagement data',
              style: GoogleFonts.roboto(
                  fontSize: 13, color: HodTheme.textSecondary)),
          const SizedBox(height: 24),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: _ChartCard(
                  title: '7-Day Attendance Rate',
                  subtitle: 'Department-wide daily attendance %',
                  chart: _AttendanceBarChart(data: attRates),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: _ChartCard(
                  title: 'Assignment Submission Rate',
                  subtitle: 'Submissions per day this week',
                  chart: _SubmissionLineChart(data: subRates),
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 4,
                child: _ChartCard(
                  title: 'Course Enrollment Distribution',
                  subtitle: 'Students per active course',
                  chart: _EnrollmentPieChart(
                    courses: prov.courses,
                    students: prov.students,
                  ),
                ),
              ),
              const SizedBox(width: 16),
              Expanded(
                flex: 6,
                child: _PerformanceMetricsCard(prov: prov),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _ChartCard extends StatelessWidget {
  final String title, subtitle;
  final Widget chart;

  const _ChartCard(
      {required this.title,
      required this.subtitle,
      required this.chart});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: HodTheme.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: HodTheme.textPrimary)),
          const SizedBox(height: 4),
          Text(subtitle,
              style: GoogleFonts.roboto(
                  fontSize: 12, color: HodTheme.textSecondary)),
          const SizedBox(height: 24),
          SizedBox(height: 200, child: chart),
        ],
      ),
    );
  }
}

class _AttendanceBarChart extends StatelessWidget {
  final List<double> data;
  const _AttendanceBarChart({required this.data});

  @override
  Widget build(BuildContext context) {
    final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: 100,
        barTouchData: BarTouchData(
          touchTooltipData: BarTouchTooltipData(
            getTooltipItem: (group, _, rod, __) => BarTooltipItem(
              '${rod.toY.toStringAsFixed(1)}%',
              GoogleFonts.inter(
                  color: Colors.white,
                  fontSize: 11,
                  fontWeight: FontWeight.w600),
            ),
          ),
        ),
        titlesData: FlTitlesData(
          show: true,
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (v, _) => Padding(
                padding: const EdgeInsets.only(top: 6),
                child: Text(days[v.toInt() % days.length],
                    style: GoogleFonts.inter(
                        fontSize: 10, color: HodTheme.textMuted)),
              ),
            ),
          ),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 36,
              getTitlesWidget: (v, _) => Text('${v.toInt()}%',
                  style: GoogleFonts.inter(
                      fontSize: 9, color: HodTheme.textMuted)),
            ),
          ),
          topTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        gridData: FlGridData(
          show: true,
          horizontalInterval: 25,
          getDrawingHorizontalLine: (_) =>
              const FlLine(color: HodTheme.borderLight, strokeWidth: 1),
          drawVerticalLine: false,
        ),
        borderData: FlBorderData(show: false),
        barGroups: data.asMap().entries.map((e) {
          final isLow = e.value < 75;
          return BarChartGroupData(
            x: e.key,
            barRods: [
              BarChartRodData(
                toY: e.value,
                color: isLow ? HodTheme.accentGold : HodTheme.steelBlue,
                width: 22,
                borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(4)),
              ),
            ],
          );
        }).toList(),
      ),
    );
  }
}

class _SubmissionLineChart extends StatelessWidget {
  final List<double> data;
  const _SubmissionLineChart({required this.data});

  @override
  Widget build(BuildContext context) {
    return LineChart(
      LineChartData(
        minY: 0,
        maxY: 100,
        lineTouchData: LineTouchData(
          touchTooltipData: LineTouchTooltipData(
            getTooltipItems: (spots) => spots
                .map((s) => LineTooltipItem(
                      '${s.y.toStringAsFixed(0)}%',
                      GoogleFonts.inter(
                          color: Colors.white,
                          fontSize: 11,
                          fontWeight: FontWeight.w600),
                    ))
                .toList(),
          ),
        ),
        titlesData: FlTitlesData(
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (v, _) {
                const d = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
                return Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(d[v.toInt() % d.length],
                      style: GoogleFonts.inter(
                          fontSize: 10, color: HodTheme.textMuted)),
                );
              },
            ),
          ),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 36,
              getTitlesWidget: (v, _) => Text('${v.toInt()}%',
                  style: GoogleFonts.inter(
                      fontSize: 9, color: HodTheme.textMuted)),
            ),
          ),
          topTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles:
              const AxisTitles(sideTitles: SideTitles(showTitles: false)),
        ),
        gridData: FlGridData(
          show: true,
          horizontalInterval: 25,
          getDrawingHorizontalLine: (_) =>
              const FlLine(color: HodTheme.borderLight, strokeWidth: 1),
          drawVerticalLine: false,
        ),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: data
                .asMap()
                .entries
                .map((e) => FlSpot(e.key.toDouble(), e.value))
                .toList(),
            isCurved: true,
            color: HodTheme.accentCyan,
            barWidth: 2.5,
            dotData: FlDotData(
              show: true,
              getDotPainter: (_, __, ___, ____) => FlDotCirclePainter(
                radius: 4,
                color: HodTheme.accentCyan,
                strokeColor: Colors.white,
                strokeWidth: 2,
              ),
            ),
            belowBarData: BarAreaData(
              show: true,
              color: HodTheme.accentCyan.withOpacity(0.08),
            ),
          ),
        ],
      ),
    );
  }
}

class _EnrollmentPieChart extends StatelessWidget {
  final List courses;
  final List students;
  const _EnrollmentPieChart(
      {required this.courses, required this.students});

  @override
  Widget build(BuildContext context) {
    final colors = [
      HodTheme.steelBlue,
      HodTheme.accentCyan,
      HodTheme.accentGold,
      HodTheme.successGreen,
      HodTheme.errorRed,
    ];

    return PieChart(
      PieChartData(
        sectionsSpace: 2,
        centerSpaceRadius: 50,
        sections: courses.asMap().entries.map((e) {
          final count =
              students.where((s) => s.enrolledCourseIds.contains(e.value.id)).length;
          return PieChartSectionData(
            value: count.toDouble(),
            title: e.value.code,
            color: colors[e.key % colors.length],
            radius: 55,
            titleStyle: GoogleFonts.inter(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: Colors.white),
          );
        }).toList(),
      ),
    );
  }
}

class _PerformanceMetricsCard extends StatelessWidget {
  final HodProvider prov;
  const _PerformanceMetricsCard({required this.prov});

  @override
  Widget build(BuildContext context) {
    final metrics = [
      _Metric('Overall Dept. Avg. Attendance', '${(prov.students.fold(0.0, (s, st) => s + st.attendancePercentage) / (prov.students.isNotEmpty ? prov.students.length : 1)).toStringAsFixed(1)}%', HodTheme.steelBlue),
      _Metric('Active Courses', prov.totalCourses.toString(), HodTheme.accentCyan),
      _Metric('Total Enrolled Students', prov.totalStudents.toString(), HodTheme.successGreen),
      _Metric('Faculty Members', prov.totalStaff.toString(), HodTheme.navy),
      _Metric('Students Below 75% Attendance', prov.lowAttendanceCount.toString(), HodTheme.errorRed),
      _Metric('Assignments Posted Today', '2', HodTheme.accentGold),
    ];

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: HodTheme.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Performance Metrics Summary',
              style: GoogleFonts.inter(
                  fontSize: 15,
                  fontWeight: FontWeight.w700,
                  color: HodTheme.textPrimary)),
          const SizedBox(height: 4),
          Text('Today\'s departmental snapshot',
              style: GoogleFonts.roboto(
                  fontSize: 12, color: HodTheme.textSecondary)),
          const SizedBox(height: 20),
          ...metrics.map((m) => Padding(
                padding: const EdgeInsets.only(bottom: 12),
                child: Row(children: [
                  Container(
                    width: 8,
                    height: 8,
                    decoration: BoxDecoration(
                      color: m.color,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(m.label,
                        style: GoogleFonts.roboto(
                            fontSize: 13,
                            color: HodTheme.textSecondary)),
                  ),
                  Text(m.value,
                      style: GoogleFonts.inter(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: m.color)),
                ]),
              )),
        ],
      ),
    );
  }
}

class _Metric {
  final String label, value;
  final Color color;
  const _Metric(this.label, this.value, this.color);
}
