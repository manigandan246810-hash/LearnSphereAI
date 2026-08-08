import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:fl_chart/fl_chart.dart';
import '../theme/student_theme.dart';
import '../providers/student_provider.dart';
import '../auth/student_login_screen.dart';
import '../courses/course_discovery_screen.dart';
import '../courses/course_viewer_screen.dart';
import '../timetable/timetable_screen.dart';

class StudentDashboardScreen extends StatefulWidget {
  const StudentDashboardScreen({super.key});

  @override
  State<StudentDashboardScreen> createState() => _StudentDashboardScreenState();
}

class _StudentDashboardScreenState extends State<StudentDashboardScreen> {
  int _idx = 0;
  final _searchCtrl = TextEditingController();

  final _navItems = const [
    _Nav(Icons.dashboard_rounded, 'Dashboard'),
    _Nav(Icons.search_rounded, 'Discover Courses'),
    _Nav(Icons.auto_stories_rounded, 'Course Workspace'),
    _Nav(Icons.calendar_month_rounded, 'Academic Timetable'),
  ];

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<StudentProvider>();

    Widget body;
    switch (_idx) {
      case 1:
        body = const CourseDiscoveryScreen();
        break;
      case 2:
        body = const CourseViewerScreen();
        break;
      case 3:
        body = const TimetableScreen();
        break;
      default:
        body = _StudentHome(prov: prov);
    }

    return Scaffold(
      body: Row(
        children: [
          _StudentSideNav(
            items: _navItems,
            selected: _idx,
            onSelect: (i) => setState(() => _idx = i),
            studentName: prov.currentStudent.name,
            rollNumber: prov.currentStudent.rollNumber,
            onLogout: () => Navigator.of(context).pushReplacement(
              MaterialPageRoute(builder: (_) => const StudentLoginScreen()),
            ),
          ),
          Expanded(
            child: Column(
              children: [
                _StudentTopBar(
                  title: _navItems[_idx].label,
                  searchCtrl: _searchCtrl,
                  onSearch: prov.setSearch,
                ),
                Expanded(child: body),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StudentHome extends StatelessWidget {
  final StudentProvider prov;
  const _StudentHome({required this.prov});

  @override
  Widget build(BuildContext context) {
    final today = DateFormat('EEEE, dd MMMM').format(DateTime.now());
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Welcome Back, ${prov.currentStudent.name}',
                      style: GoogleFonts.inter(
                          fontSize: 22,
                          fontWeight: FontWeight.w700,
                          color: StudentTheme.textPrimary)),
                  Text(today,
                      style: GoogleFonts.roboto(
                          fontSize: 13, color: StudentTheme.textSecondary)),
                ],
              ),
              const Spacer(),
              // Study Streak Banner
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: StudentTheme.accentGold.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: StudentTheme.accentGold.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.local_fire_department_rounded, color: StudentTheme.accentGold, size: 20),
                    const SizedBox(width: 8),
                    Text(
                      '${prov.studyStreak} Day Study Streak!',
                      style: GoogleFonts.inter(
                        color: const Color(0xFFC46500),
                        fontWeight: FontWeight.w700,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // KPI Box Row
          Row(
            children: [
              _KpiBox('Enrolled Courses', prov.enrolledCourses.length.toString(),
                  Icons.auto_stories_rounded, StudentTheme.steelBlue),
              const SizedBox(width: 14),
              _KpiBox('Pending Assignments', prov.myAssignments.where((a) => !a.isOverdue && prov.getMySubmissionsForAssignment(a.id).isEmpty).length.toString(),
                  Icons.assignment_rounded, StudentTheme.accentCyan),
              const SizedBox(width: 14),
              _KpiBox('Attendance Rate', '${prov.currentStudent.attendancePercentage.toStringAsFixed(1)}%',
                  Icons.fact_check_rounded, prov.currentStudent.isLowAttendance ? StudentTheme.errorRed : StudentTheme.successGreen),
              const SizedBox(width: 14),
              _KpiBox('Active Tests', prov.myMcqTests.where((t) => t.isActive && prov.getMyAttemptForTest(t.id) == null).length.toString(),
                  Icons.quiz_rounded, StudentTheme.accentIndigo),
            ],
          ),
          const SizedBox(height: 24),

          // Lower Panel (Chart + Enrolled list)
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 6,
                child: _StudyHoursChart(weeklyMins: prov.weeklyProgressMinutes),
              ),
              const SizedBox(width: 16),
              Expanded(
                flex: 4,
                child: _MyEnrolledCourses(courses: prov.enrolledCourses),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Deadlines Panel
          _RecentDeadlinesList(prov: prov),
        ],
      ),
    );
  }
}

class _KpiBox extends StatelessWidget {
  final String label, value;
  final IconData icon;
  final Color color;
  const _KpiBox(this.label, this.value, this.icon, this.color);

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: StudentTheme.borderLight),
          boxShadow: [
            BoxShadow(
                color: color.withOpacity(0.04),
                blurRadius: 10,
                offset: const Offset(0, 3))
          ],
        ),
        child: Row(children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Icon(icon, color: color, size: 22),
          ),
          const SizedBox(width: 14),
          Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Text(value,
                style: GoogleFonts.inter(
                    fontSize: 24,
                    fontWeight: FontWeight.w700,
                    color: StudentTheme.textPrimary)),
            Text(label,
                style: GoogleFonts.roboto(
                    fontSize: 11, color: StudentTheme.textSecondary)),
          ]),
        ]),
      ),
    );
  }
}

class _StudyHoursChart extends StatelessWidget {
  final List<double> weeklyMins;
  const _StudyHoursChart({required this.weeklyMins});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 310,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: StudentTheme.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Study Engagement Activity',
              style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: StudentTheme.textPrimary)),
          Text('Minutes logged per day studying course materials.',
              style: GoogleFonts.roboto(fontSize: 11, color: StudentTheme.textMuted)),
          const SizedBox(height: 24),
          Expanded(
            child: BarChart(
              BarChartData(
                alignment: BarChartAlignment.spaceAround,
                maxY: 150,
                barTouchData: BarTouchData(enabled: true),
                titlesData: FlTitlesData(
                  show: true,
                  bottomTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      getTitlesWidget: (val, _) {
                        final days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                        if (val.toInt() >= 0 && val.toInt() < days.length) {
                          return Text(days[val.toInt()], style: GoogleFonts.roboto(fontSize: 10, color: StudentTheme.textMuted));
                        }
                        return const Text('');
                      },
                    ),
                  ),
                  leftTitles: AxisTitles(
                    sideTitles: SideTitles(
                      showTitles: true,
                      reservedSize: 28,
                      getTitlesWidget: (val, _) {
                        if (val % 30 == 0) {
                          return Text(val.toInt().toString(), style: GoogleFonts.roboto(fontSize: 9, color: StudentTheme.textMuted));
                        }
                        return const Text('');
                      },
                    ),
                  ),
                  topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                  rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                ),
                gridData: FlGridData(
                  show: true,
                  horizontalInterval: 30,
                  drawVerticalLine: false,
                  getDrawingHorizontalLine: (_) => const FlLine(color: StudentTheme.borderLight, strokeWidth: 1),
                ),
                borderData: FlBorderData(show: false),
                barGroups: weeklyMins.asMap().entries.map((e) {
                  return BarChartGroupData(
                    x: e.key,
                    barRods: [
                      BarChartRodData(
                        toY: e.value,
                        color: StudentTheme.steelBlue,
                        width: 16,
                        borderRadius: BorderRadius.circular(4),
                        backDrawRodData: BackgroundBarChartRodData(
                          show: true,
                          toY: 150,
                          color: StudentTheme.blueprintBg,
                        ),
                      ),
                    ],
                  );
                }).toList(),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MyEnrolledCourses extends StatelessWidget {
  final List<Course> courses;
  const _MyEnrolledCourses({required this.courses});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 310,
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: StudentTheme.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Text('My Active Courses',
                style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: StudentTheme.textPrimary)),
          ),
          const Divider(height: 1, color: StudentTheme.borderLight),
          Expanded(
            child: courses.isEmpty
                ? Center(
                    child: Text('No courses enrolled yet.',
                        style: GoogleFonts.roboto(fontSize: 12, color: StudentTheme.textMuted)),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    itemCount: courses.length,
                    itemBuilder: (context, idx) {
                      final c = courses[idx];
                      return Container(
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: const BoxDecoration(
                          border: Border(bottom: BorderSide(color: StudentTheme.borderLight)),
                        ),
                        child: Row(
                          children: [
                            Container(
                              width: 36,
                              height: 36,
                              decoration: BoxDecoration(
                                color: StudentTheme.steelBlue.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                              ),
                              child: Center(
                                child: Text(c.code,
                                    style: GoogleFonts.inter(
                                        fontSize: 9,
                                        fontWeight: FontWeight.w800,
                                        color: StudentTheme.steelBlue)),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(c.title,
                                      style: GoogleFonts.inter(
                                          fontSize: 12,
                                          fontWeight: FontWeight.w600,
                                          color: StudentTheme.textPrimary),
                                      overflow: TextOverflow.ellipsis),
                                  Text('Instructed by ${c.staffName}',
                                      style: GoogleFonts.roboto(
                                          fontSize: 10,
                                          color: StudentTheme.textSecondary)),
                                ],
                              ),
                            ),
                            const Icon(Icons.arrow_forward_ios_rounded, size: 12, color: StudentTheme.textMuted),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class _RecentDeadlinesList extends StatelessWidget {
  final StudentProvider prov;
  const _RecentDeadlinesList({required this.prov});

  @override
  Widget build(BuildContext context) {
    final pendingAssignments = prov.myAssignments
        .where((a) => !a.isOverdue && prov.getMySubmissionsForAssignment(a.id).isEmpty)
        .toList();

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: StudentTheme.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Text('Upcoming Assignments Due',
                style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    color: StudentTheme.textPrimary)),
          ),
          const Divider(height: 1, color: StudentTheme.borderLight),
          if (pendingAssignments.isEmpty)
            Padding(
              padding: const EdgeInsets.all(20),
              child: Center(
                child: Text('All caught up! No pending assignments.',
                    style: GoogleFonts.roboto(fontSize: 12, color: StudentTheme.textMuted)),
              ),
            )
          else
            ...pendingAssignments.map((a) {
              final dueStr = DateFormat('EEEE, dd MMM yyyy, hh:mm a').format(a.deadline);
              return Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                decoration: const BoxDecoration(
                  border: Border(bottom: BorderSide(color: StudentTheme.borderLight)),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.warning_amber_rounded, color: StudentTheme.accentGold, size: 18),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(a.title,
                              style: GoogleFonts.inter(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: StudentTheme.textPrimary)),
                          Text('${a.courseName} • Max Marks: ${a.maxMarks}',
                              style: GoogleFonts.roboto(
                                  fontSize: 11,
                                  color: StudentTheme.textSecondary)),
                        ],
                      ),
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('DUE LIMIT',
                            style: GoogleFonts.inter(
                                fontSize: 9,
                                fontWeight: FontWeight.w700,
                                color: StudentTheme.errorRed,
                                letterSpacing: 0.5)),
                        Text(dueStr,
                            style: GoogleFonts.roboto(
                                fontSize: 11,
                                color: StudentTheme.textPrimary,
                                fontWeight: FontWeight.w500)),
                      ],
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }
}

class _StudentSideNav extends StatelessWidget {
  final List<_Nav> items;
  final int selected;
  final ValueChanged<int> onSelect;
  final String studentName;
  final String rollNumber;
  final VoidCallback onLogout;

  const _StudentSideNav({
    required this.items,
    required this.selected,
    required this.onSelect,
    required this.studentName,
    required this.rollNumber,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 210,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF001428), Color(0xFF002244)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 28, 18, 8),
            child: Row(children: [
              CircleAvatar(
                radius: 18,
                backgroundColor: StudentTheme.accentCyan.withOpacity(0.2),
                child: Text(studentName[0],
                    style: GoogleFonts.inter(
                        color: StudentTheme.accentCyan,
                        fontWeight: FontWeight.w700,
                        fontSize: 14)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Student Portal',
                        style: GoogleFonts.inter(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600)),
                    Text(rollNumber,
                        style: GoogleFonts.roboto(
                            color: Colors.white38, fontSize: 10),
                        overflow: TextOverflow.ellipsis),
                  ],
                ),
              ),
            ]),
          ),
          Container(
              margin: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
              height: 1,
              color: Colors.white10),
          ...items.asMap().entries.map((e) {
            final isSel = selected == e.key;
            return AnimatedContainer(
              duration: const Duration(milliseconds: 180),
              margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
              decoration: BoxDecoration(
                color: isSel ? StudentTheme.steelBlue.withOpacity(0.25) : Colors.transparent,
                borderRadius: BorderRadius.circular(7),
              ),
              child: ListTile(
                leading: Icon(e.value.icon,
                    color: isSel ? StudentTheme.accentCyan : Colors.white38,
                    size: 17),
                title: Text(e.value.label,
                    style: GoogleFonts.inter(
                        color: isSel ? Colors.white : Colors.white54,
                        fontSize: 12,
                        fontWeight: isSel ? FontWeight.w600 : FontWeight.w400)),
                onTap: () => onSelect(e.key),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 10, vertical: 0),
                dense: true,
              ),
            );
          }),
          const Spacer(),
          Container(
              margin: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
              height: 1,
              color: Colors.white10),
          ListTile(
            leading: const Icon(Icons.logout_rounded,
                color: Colors.white30, size: 16),
            title: Text('Logout',
                style: GoogleFonts.inter(
                    color: Colors.white30,
                    fontSize: 12,
                    fontWeight: FontWeight.w500)),
            onTap: onLogout,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 18, vertical: 4),
          ),
          const SizedBox(height: 12),
        ],
      ),
    );
  }
}

class _StudentTopBar extends StatelessWidget {
  final String title;
  final TextEditingController searchCtrl;
  final ValueChanged<String> onSearch;
  const _StudentTopBar({required this.title, required this.searchCtrl, required this.onSearch});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(horizontal: 22),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: StudentTheme.borderLight)),
      ),
      child: Row(children: [
        Text(title,
            style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: StudentTheme.textPrimary)),
        const Spacer(),
        SizedBox(
          width: 260,
          height: 34,
          child: TextField(
            controller: searchCtrl,
            onChanged: onSearch,
            style: GoogleFonts.roboto(fontSize: 13, color: StudentTheme.textPrimary),
            decoration: InputDecoration(
              hintText: 'Search courses, tags, materials…',
              hintStyle: GoogleFonts.roboto(
                  fontSize: 12, color: StudentTheme.textMuted),
              prefixIcon:
                  const Icon(Icons.search, size: 16, color: StudentTheme.textMuted),
              contentPadding: const EdgeInsets.symmetric(vertical: 6),
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: StudentTheme.borderLight)),
              enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: StudentTheme.borderLight)),
              focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide:
                      const BorderSide(color: StudentTheme.steelBlue, width: 1.5)),
              filled: true,
              fillColor: StudentTheme.blueprintBg,
            ),
          ),
        ),
      ]),
    );
  }
}

class _Nav {
  final IconData icon;
  final String label;
  const _Nav(this.icon, this.label);
}
