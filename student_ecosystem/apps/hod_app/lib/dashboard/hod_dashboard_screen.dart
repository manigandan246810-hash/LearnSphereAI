import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import '../theme/hod_theme.dart';
import '../providers/hod_provider.dart';
import '../management/course_management_screen.dart';
import '../management/staff_management_screen.dart';
import '../management/student_registry_screen.dart';
import '../attendance/attendance_audit_screen.dart';
import '../reports/daily_reports_screen.dart';
import '../auth/hod_login_screen.dart';

class HodDashboardScreen extends StatefulWidget {
  const HodDashboardScreen({super.key});

  @override
  State<HodDashboardScreen> createState() => _HodDashboardScreenState();
}

class _HodDashboardScreenState extends State<HodDashboardScreen> {
  int _selectedIndex = 0;
  final _searchCtrl = TextEditingController();

  final List<_NavItem> _navItems = [
    _NavItem(Icons.dashboard_rounded, 'Dashboard'),
    _NavItem(Icons.book_rounded, 'Courses'),
    _NavItem(Icons.badge_rounded, 'Staff'),
    _NavItem(Icons.people_rounded, 'Students'),
    _NavItem(Icons.fact_check_rounded, 'Attendance'),
    _NavItem(Icons.bar_chart_rounded, 'Reports'),
  ];

  @override
  void dispose() {
    _searchCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<HodProvider>();

    Widget body;
    switch (_selectedIndex) {
      case 1:
        body = const CourseManagementScreen();
        break;
      case 2:
        body = const StaffManagementScreen();
        break;
      case 3:
        body = const StudentRegistryScreen();
        break;
      case 4:
        body = const AttendanceAuditScreen();
        break;
      case 5:
        body = const DailyReportsScreen();
        break;
      default:
        body = _DashboardHome(prov: prov);
    }

    return Scaffold(
      body: Row(
        children: [
          // ── Sidebar navigation ───────────────────────────────────────────
          _SideNav(
            items: _navItems,
            selected: _selectedIndex,
            onSelect: (i) => setState(() => _selectedIndex = i),
            onLogout: () => Navigator.of(context).pushReplacement(
              MaterialPageRoute(builder: (_) => const HodLoginScreen()),
            ),
          ),
          // ── Main content ─────────────────────────────────────────────────
          Expanded(
            child: Column(
              children: [
                _TopBar(
                  title: _navItems[_selectedIndex].label,
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

// ─── Sidebar ──────────────────────────────────────────────────────────────────
class _SideNav extends StatelessWidget {
  final List<_NavItem> items;
  final int selected;
  final ValueChanged<int> onSelect;
  final VoidCallback onLogout;

  const _SideNav({
    required this.items,
    required this.selected,
    required this.onSelect,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 220,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF001A33), Color(0xFF002952)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(20, 32, 20, 8),
            child: Row(children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: HodTheme.accentGold.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(
                      color: HodTheme.accentGold.withOpacity(0.4), width: 1),
                ),
                child: const Icon(Icons.school_rounded,
                    color: HodTheme.accentGold, size: 20),
              ),
              const SizedBox(width: 10),
              Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Text('Academic',
                    style: GoogleFonts.inter(
                        color: Colors.white,
                        fontSize: 13,
                        fontWeight: FontWeight.w700)),
                Text('Admin',
                    style: GoogleFonts.inter(
                        color: Colors.white54, fontSize: 11)),
              ]),
            ]),
          ),
          Container(
            margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            height: 1,
            color: Colors.white10,
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Text('MENU',
                style: GoogleFonts.inter(
                    color: Colors.white30,
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 1.5)),
          ),
          const SizedBox(height: 8),
          ...items.asMap().entries.map((e) => _NavTile(
                item: e.value,
                isSelected: selected == e.key,
                onTap: () => onSelect(e.key),
              )),
          const Spacer(),
          Container(
            margin: const EdgeInsets.fromLTRB(20, 0, 20, 16),
            height: 1,
            color: Colors.white10,
          ),
          ListTile(
            leading: const Icon(Icons.logout_rounded,
                color: Colors.white38, size: 18),
            title: Text('Logout',
                style: GoogleFonts.inter(
                    color: Colors.white38,
                    fontSize: 13,
                    fontWeight: FontWeight.w500)),
            onTap: onLogout,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
          ),
          const SizedBox(height: 16),
        ],
      ),
    );
  }
}

class _NavTile extends StatelessWidget {
  final _NavItem item;
  final bool isSelected;
  final VoidCallback onTap;

  const _NavTile(
      {required this.item, required this.isSelected, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      margin: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
      decoration: BoxDecoration(
        color: isSelected
            ? HodTheme.steelBlue.withOpacity(0.3)
            : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
        border: isSelected
            ? Border.all(color: HodTheme.steelBlue.withOpacity(0.5), width: 1)
            : null,
      ),
      child: ListTile(
        leading: Icon(item.icon,
            color: isSelected ? HodTheme.accentCyan : Colors.white38,
            size: 18),
        title: Text(item.label,
            style: GoogleFonts.inter(
                color: isSelected ? Colors.white : Colors.white54,
                fontSize: 13,
                fontWeight:
                    isSelected ? FontWeight.w600 : FontWeight.w400)),
        onTap: onTap,
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
        dense: true,
      ),
    );
  }
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────
class _TopBar extends StatelessWidget {
  final String title;
  final TextEditingController searchCtrl;
  final ValueChanged<String> onSearch;

  const _TopBar(
      {required this.title,
      required this.searchCtrl,
      required this.onSearch});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 64,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: HodTheme.borderLight)),
      ),
      child: Row(
        children: [
          Text(title,
              style: GoogleFonts.inter(
                  fontSize: 17,
                  fontWeight: FontWeight.w700,
                  color: HodTheme.textPrimary)),
          const Spacer(),
          SizedBox(
            width: 280,
            height: 36,
            child: TextField(
              controller: searchCtrl,
              onChanged: onSearch,
              style: GoogleFonts.roboto(fontSize: 13, color: HodTheme.textPrimary),
              decoration: InputDecoration(
                hintText: 'Search courses, staff, students…',
                hintStyle: GoogleFonts.roboto(
                    fontSize: 13, color: HodTheme.textMuted),
                prefixIcon: const Icon(Icons.search, size: 16,
                    color: HodTheme.textMuted),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide:
                        const BorderSide(color: HodTheme.borderLight)),
                enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide:
                        const BorderSide(color: HodTheme.borderLight)),
                focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(8),
                    borderSide:
                        const BorderSide(color: HodTheme.steelBlue, width: 1.5)),
                filled: true,
                fillColor: HodTheme.blueprintBg,
              ),
            ),
          ),
          const SizedBox(width: 16),
          CircleAvatar(
            radius: 18,
            backgroundColor: HodTheme.navy,
            child: Text('H',
                style: GoogleFonts.inter(
                    color: Colors.white,
                    fontSize: 14,
                    fontWeight: FontWeight.w700)),
          ),
        ],
      ),
    );
  }
}

// ─── Dashboard Home ────────────────────────────────────────────────────────────
class _DashboardHome extends StatelessWidget {
  final HodProvider prov;
  const _DashboardHome({required this.prov});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Good Morning, Dr. HOD',
              style: GoogleFonts.inter(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: HodTheme.textPrimary)),
          const SizedBox(height: 4),
          Text('Here\'s today\'s departmental overview',
              style: GoogleFonts.roboto(
                  fontSize: 13, color: HodTheme.textSecondary)),
          const SizedBox(height: 24),
          // KPI cards
          Row(
            children: [
              _KpiCard(
                label: 'Total Students',
                value: prov.totalStudents.toString(),
                icon: Icons.people_rounded,
                color: HodTheme.steelBlue,
                sub: '+2 this week',
              ),
              const SizedBox(width: 16),
              _KpiCard(
                label: 'Faculty Members',
                value: prov.totalStaff.toString(),
                icon: Icons.badge_rounded,
                color: const Color(0xFF006633),
                sub: 'All active',
              ),
              const SizedBox(width: 16),
              _KpiCard(
                label: 'Active Courses',
                value: prov.totalCourses.toString(),
                icon: Icons.book_rounded,
                color: const Color(0xFF660033),
                sub: 'Sem 6 & 5',
              ),
              const SizedBox(width: 16),
              _KpiCard(
                label: 'Low Attendance',
                value: prov.lowAttendanceCount.toString(),
                icon: Icons.warning_amber_rounded,
                color: const Color(0xFFAA5500),
                sub: 'Below 75%',
                isWarning: true,
              ),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                flex: 6,
                child: _RecentActivityCard(),
              ),
              const SizedBox(width: 16),
              Expanded(
                flex: 4,
                child: _LowAttendanceCard(students: prov.students
                    .where((s) => s.isLowAttendance)
                    .toList()),
              ),
            ],
          ),
          const SizedBox(height: 16),
          _StaffActivityCard(staff: prov.staff),
        ],
      ),
    );
  }
}

class _KpiCard extends StatelessWidget {
  final String label, value, sub;
  final IconData icon;
  final Color color;
  final bool isWarning;

  const _KpiCard({
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
    required this.sub,
    this.isWarning = false,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
              color: isWarning
                  ? HodTheme.accentGold.withOpacity(0.4)
                  : HodTheme.borderLight),
          boxShadow: [
            BoxShadow(
                color: color.withOpacity(0.06),
                blurRadius: 12,
                offset: const Offset(0, 4))
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: color.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Icon(icon, color: color, size: 20),
                ),
                if (isWarning)
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: HodTheme.accentGold.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text('ALERT',
                        style: GoogleFonts.inter(
                            color: HodTheme.accentGold,
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 1)),
                  ),
              ],
            ),
            const SizedBox(height: 16),
            Text(value,
                style: GoogleFonts.inter(
                    fontSize: 32,
                    fontWeight: FontWeight.w700,
                    color: HodTheme.textPrimary)),
            const SizedBox(height: 4),
            Text(label,
                style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                    color: HodTheme.textPrimary)),
            const SizedBox(height: 2),
            Text(sub,
                style: GoogleFonts.roboto(
                    fontSize: 11, color: HodTheme.textMuted)),
          ],
        ),
      ),
    );
  }
}

class _RecentActivityCard extends StatelessWidget {
  final List<_Activity> activities = const [
    _Activity('Dr. Ananya Krishnan', 'Marked attendance for CS601', '10 min ago', Icons.fact_check_rounded),
    _Activity('Prof. Rahul Mehta', 'Posted assignment: OS Design Lab', '1 hr ago', Icons.assignment_rounded),
    _Activity('System', 'CSV onboarding: 12 new students added', '2 hrs ago', Icons.people_rounded),
    _Activity('Dr. Priya Nair', 'Uploaded DSP lecture notes (PDF)', '3 hrs ago', Icons.upload_file_rounded),
    _Activity('System', 'MCQ test results published for CS601', '5 hrs ago', Icons.quiz_rounded),
  ];

  @override
  Widget build(BuildContext context) {
    return Container(
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
            child: Row(
              children: [
                Text('Recent System Activity',
                    style: GoogleFonts.inter(
                        fontSize: 15,
                        fontWeight: FontWeight.w700,
                        color: HodTheme.textPrimary)),
                const Spacer(),
                Text('Today',
                    style: GoogleFonts.roboto(
                        fontSize: 12, color: HodTheme.textMuted)),
              ],
            ),
          ),
          const Divider(height: 1, color: HodTheme.borderLight),
          ...activities.map((a) => _ActivityTile(activity: a)),
        ],
      ),
    );
  }
}

class _Activity {
  final String actor, action, time;
  final IconData icon;
  const _Activity(this.actor, this.action, this.time, this.icon);
}

class _ActivityTile extends StatelessWidget {
  final _Activity activity;
  const _ActivityTile({required this.activity});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: const BoxDecoration(
          border: Border(bottom: BorderSide(color: HodTheme.borderLight))),
      child: Row(children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: HodTheme.steelBlue.withOpacity(0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(activity.icon,
              size: 16, color: HodTheme.steelBlue),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(activity.actor,
                  style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: HodTheme.textPrimary)),
              Text(activity.action,
                  style: GoogleFonts.roboto(
                      fontSize: 12, color: HodTheme.textSecondary)),
            ],
          ),
        ),
        Text(activity.time,
            style: GoogleFonts.roboto(
                fontSize: 11, color: HodTheme.textMuted)),
      ]),
    );
  }
}

class _LowAttendanceCard extends StatelessWidget {
  final List students;
  const _LowAttendanceCard({required this.students});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: HodTheme.accentGold.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Row(children: [
              const Icon(Icons.warning_amber_rounded,
                  color: HodTheme.accentGold, size: 18),
              const SizedBox(width: 8),
              Text('Low Attendance Alerts',
                  style: GoogleFonts.inter(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: HodTheme.textPrimary)),
            ]),
          ),
          const Divider(height: 1, color: HodTheme.borderLight),
          if (students.isEmpty)
            Padding(
              padding: const EdgeInsets.all(20),
              child: Text('All students above 75%',
                  style: GoogleFonts.roboto(
                      fontSize: 13, color: HodTheme.textMuted)),
            ),
          ...students.map((s) => Padding(
                padding: const EdgeInsets.symmetric(
                    horizontal: 20, vertical: 12),
                child: Row(children: [
                  CircleAvatar(
                    radius: 16,
                    backgroundColor: HodTheme.errorRed.withOpacity(0.1),
                    child: Text(s.name[0],
                        style: GoogleFonts.inter(
                            color: HodTheme.errorRed,
                            fontSize: 12,
                            fontWeight: FontWeight.w700)),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(s.name,
                              style: GoogleFonts.inter(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: HodTheme.textPrimary)),
                          Text(s.rollNumber,
                              style: GoogleFonts.roboto(
                                  fontSize: 11,
                                  color: HodTheme.textMuted)),
                        ]),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: HodTheme.errorRed.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                        '${s.attendancePercentage.toStringAsFixed(1)}%',
                        style: GoogleFonts.inter(
                            color: HodTheme.errorRed,
                            fontSize: 11,
                            fontWeight: FontWeight.w700)),
                  ),
                ]),
              )),
        ],
      ),
    );
  }
}

class _StaffActivityCard extends StatelessWidget {
  final List staff;
  const _StaffActivityCard({required this.staff});

  @override
  Widget build(BuildContext context) {
    return Container(
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
            child: Text('Faculty Overview',
                style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: HodTheme.textPrimary)),
          ),
          const Divider(height: 1, color: HodTheme.borderLight),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: DataTable(
              headingTextStyle: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: HodTheme.textMuted,
                  letterSpacing: 0.8),
              dataTextStyle: GoogleFonts.roboto(
                  fontSize: 13, color: HodTheme.textPrimary),
              columnSpacing: 40,
              columns: const [
                DataColumn(label: Text('NAME')),
                DataColumn(label: Text('EMPLOYEE ID')),
                DataColumn(label: Text('DESIGNATION')),
                DataColumn(label: Text('DEPARTMENT')),
                DataColumn(label: Text('COURSES')),
                DataColumn(label: Text('STATUS')),
              ],
              rows: staff
                  .map<DataRow>((s) => DataRow(cells: [
                        DataCell(Text(s.name,
                            style: GoogleFonts.inter(
                                fontWeight: FontWeight.w600,
                                color: HodTheme.steelBlue))),
                        DataCell(Text(s.employeeId)),
                        DataCell(Text(s.designation)),
                        DataCell(Text(s.department)),
                        DataCell(Text(
                            s.assignedCourseIds.length.toString())),
                        DataCell(Container(
                          padding: const EdgeInsets.symmetric(
                              horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: HodTheme.successGreen.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text('Active',
                              style: GoogleFonts.inter(
                                  color: HodTheme.successGreen,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600)),
                        )),
                      ]))
                  .toList(),
            ),
          ),
        ],
      ),
    );
  }
}

class _NavItem {
  final IconData icon;
  final String label;
  const _NavItem(this.icon, this.label);
}
