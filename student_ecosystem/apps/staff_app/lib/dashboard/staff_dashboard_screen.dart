import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../theme/staff_theme.dart';
import '../providers/staff_provider.dart';
import '../auth/staff_login_screen.dart';
import '../onboarding/bulk_onboarding_screen.dart';
import '../attendance/attendance_manager_screen.dart';
import '../content/content_hub_screen.dart';
import '../assignments/assignment_hub_screen.dart';
import '../mcq/mcq_builder_screen.dart';

class StaffDashboardScreen extends StatefulWidget {
  const StaffDashboardScreen({super.key});

  @override
  State<StaffDashboardScreen> createState() => _StaffDashboardScreenState();
}

class _StaffDashboardScreenState extends State<StaffDashboardScreen> {
  int _idx = 0;
  final _searchCtrl = TextEditingController();

  final _navItems = const [
    _Nav(Icons.dashboard_rounded, 'Dashboard'),
    _Nav(Icons.upload_file_rounded, 'Onboarding'),
    _Nav(Icons.fact_check_rounded, 'Attendance'),
    _Nav(Icons.video_library_rounded, 'Content Hub'),
    _Nav(Icons.assignment_rounded, 'Assignments'),
    _Nav(Icons.quiz_rounded, 'MCQ Builder'),
  ];

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<StaffProvider>();

    Widget body;
    switch (_idx) {
      case 1:
        body = const BulkOnboardingScreen();
        break;
      case 2:
        body = const AttendanceManagerScreen();
        break;
      case 3:
        body = const ContentHubScreen();
        break;
      case 4:
        body = const AssignmentHubScreen();
        break;
      case 5:
        body = const McqBuilderScreen();
        break;
      default:
        body = _StaffHome(prov: prov);
    }

    return Scaffold(
      body: Row(
        children: [
          _StaffSideNav(
            items: _navItems,
            selected: _idx,
            onSelect: (i) => setState(() => _idx = i),
            staffName: prov.currentStaff.name,
            onLogout: () => Navigator.of(context).pushReplacement(
              MaterialPageRoute(builder: (_) => const StaffLoginScreen()),
            ),
          ),
          Expanded(
            child: Column(
              children: [
                _StaffTopBar(
                  title: _navItems[_idx].label,
                  searchCtrl: _searchCtrl,
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

class _StaffHome extends StatelessWidget {
  final StaffProvider prov;
  const _StaffHome({required this.prov});

  @override
  Widget build(BuildContext context) {
    final today = DateFormat('EEEE, dd MMMM').format(DateTime.now());
    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Welcome back, ${prov.currentStaff.name.split(' ').last}',
              style: GoogleFonts.inter(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                  color: StaffTheme.textPrimary)),
          Text(today,
              style: GoogleFonts.roboto(
                  fontSize: 13, color: StaffTheme.textSecondary)),
          const SizedBox(height: 24),
          Row(children: [
            _KpiBox('My Courses', prov.myCourses.length.toString(),
                Icons.book_rounded, StaffTheme.steelBlue),
            const SizedBox(width: 14),
            _KpiBox('Total Students', prov.allStudents.length.toString(),
                Icons.people_rounded, StaffTheme.teal),
            const SizedBox(width: 14),
            _KpiBox('Open Assignments', prov.assignments
                    .where((a) => !a.isOverdue)
                    .length
                    .toString(),
                Icons.assignment_rounded, StaffTheme.successGreen),
            const SizedBox(width: 14),
            _KpiBox('Active MCQ Tests', prov.mcqTests
                    .where((t) => t.isActive)
                    .length
                    .toString(),
                Icons.quiz_rounded, StaffTheme.accentGold),
          ]),
          const SizedBox(height: 24),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(flex: 5, child: _MyCoursesList(courses: prov.myCourses)),
              const SizedBox(width: 16),
              Expanded(flex: 5, child: _QuickActions()),
            ],
          ),
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
          border: Border.all(color: StaffTheme.borderLight),
          boxShadow: [
            BoxShadow(
                color: color.withOpacity(0.05),
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
                    fontSize: 26,
                    fontWeight: FontWeight.w700,
                    color: StaffTheme.textPrimary)),
            Text(label,
                style: GoogleFonts.roboto(
                    fontSize: 12, color: StaffTheme.textSecondary)),
          ]),
        ]),
      ),
    );
  }
}

class _MyCoursesList extends StatelessWidget {
  final List courses;
  const _MyCoursesList({required this.courses});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: StaffTheme.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Text('My Courses',
                style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: StaffTheme.textPrimary)),
          ),
          const Divider(height: 1, color: StaffTheme.borderLight),
          ...courses.map((c) => Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 20, vertical: 14),
                decoration: const BoxDecoration(
                    border: Border(
                        bottom:
                            BorderSide(color: StaffTheme.borderLight))),
                child: Row(children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: StaffTheme.steelBlue.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: Text(c.code,
                          style: GoogleFonts.inter(
                              fontSize: 9,
                              fontWeight: FontWeight.w800,
                              color: StaffTheme.steelBlue)),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(c.title,
                              style: GoogleFonts.inter(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: StaffTheme.textPrimary),
                              overflow: TextOverflow.ellipsis),
                          Text('${c.credits} credits • Sem ${c.semester}',
                              style: GoogleFonts.roboto(
                                  fontSize: 11,
                                  color: StaffTheme.textMuted)),
                        ]),
                  ),
                  Text('${c.modules.length} modules',
                      style: GoogleFonts.inter(
                          fontSize: 12,
                          color: StaffTheme.steelBlue,
                          fontWeight: FontWeight.w500)),
                ]),
              )),
        ],
      ),
    );
  }
}

class _QuickActions extends StatelessWidget {
  const _QuickActions();

  @override
  Widget build(BuildContext context) {
    final actions = [
      _QA('Bulk Student Upload', 'Import CSV/Excel file', Icons.upload_file_rounded, StaffTheme.steelBlue, 1),
      _QA('Mark Attendance', 'Start batch attendance', Icons.fact_check_rounded, StaffTheme.teal, 2),
      _QA('Upload Content', 'Add video or notes', Icons.video_library_rounded, StaffTheme.accentTeal, 3),
      _QA('New Assignment', 'Post homework', Icons.assignment_add, StaffTheme.successGreen, 4),
      _QA('Create MCQ Test', 'Build a quiz', Icons.quiz_rounded, StaffTheme.accentGold, 5),
    ];

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: StaffTheme.borderLight),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(20),
            child: Text('Quick Actions',
                style: GoogleFonts.inter(
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    color: StaffTheme.textPrimary)),
          ),
          const Divider(height: 1, color: StaffTheme.borderLight),
          ...actions.map((a) {
            final dashboard = context
                .findAncestorStateOfType<_StaffDashboardScreenState>();
            return InkWell(
              onTap: () => dashboard?.setState(() => dashboard._idx = a.navIdx),
              child: Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 20, vertical: 14),
                decoration: const BoxDecoration(
                    border: Border(
                        bottom:
                            BorderSide(color: StaffTheme.borderLight))),
                child: Row(children: [
                  Container(
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: a.color.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Icon(a.icon, color: a.color, size: 18),
                  ),
                  const SizedBox(width: 14),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(a.label,
                          style: GoogleFonts.inter(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: StaffTheme.textPrimary)),
                      Text(a.sub,
                          style: GoogleFonts.roboto(
                              fontSize: 11, color: StaffTheme.textMuted)),
                    ],
                  ),
                  const Spacer(),
                  const Icon(Icons.chevron_right_rounded,
                      size: 18, color: StaffTheme.textMuted),
                ]),
              ),
            );
          }),
        ],
      ),
    );
  }
}

class _QA {
  final String label, sub;
  final IconData icon;
  final Color color;
  final int navIdx;
  const _QA(this.label, this.sub, this.icon, this.color, this.navIdx);
}

class _StaffSideNav extends StatelessWidget {
  final List<_Nav> items;
  final int selected;
  final ValueChanged<int> onSelect;
  final String staffName;
  final VoidCallback onLogout;

  const _StaffSideNav({
    required this.items,
    required this.selected,
    required this.onSelect,
    required this.staffName,
    required this.onLogout,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 210,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF001833), Color(0xFF002855)],
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
                backgroundColor: StaffTheme.accentTeal.withOpacity(0.2),
                child: Text(staffName[0],
                    style: GoogleFonts.inter(
                        color: StaffTheme.accentTeal,
                        fontWeight: FontWeight.w700,
                        fontSize: 14)),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Faculty Portal',
                        style: GoogleFonts.inter(
                            color: Colors.white,
                            fontSize: 12,
                            fontWeight: FontWeight.w600)),
                    Text('Dr. Staff',
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
                color: isSel ? StaffTheme.steelBlue.withOpacity(0.25) : Colors.transparent,
                borderRadius: BorderRadius.circular(7),
              ),
              child: ListTile(
                leading: Icon(e.value.icon,
                    color: isSel ? StaffTheme.accentTeal : Colors.white38,
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

class _StaffTopBar extends StatelessWidget {
  final String title;
  final TextEditingController searchCtrl;
  const _StaffTopBar({required this.title, required this.searchCtrl});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 60,
      padding: const EdgeInsets.symmetric(horizontal: 22),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: StaffTheme.borderLight)),
      ),
      child: Row(children: [
        Text(title,
            style: GoogleFonts.inter(
                fontSize: 16,
                fontWeight: FontWeight.w700,
                color: StaffTheme.textPrimary)),
        const Spacer(),
        SizedBox(
          width: 260,
          height: 34,
          child: TextField(
            controller: searchCtrl,
            style: GoogleFonts.roboto(fontSize: 13, color: StaffTheme.textPrimary),
            decoration: InputDecoration(
              hintText: 'Search students, courses…',
              hintStyle: GoogleFonts.roboto(
                  fontSize: 12, color: StaffTheme.textMuted),
              prefixIcon:
                  const Icon(Icons.search, size: 16, color: StaffTheme.textMuted),
              contentPadding: const EdgeInsets.symmetric(vertical: 6),
              border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: StaffTheme.borderLight)),
              enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide: const BorderSide(color: StaffTheme.borderLight)),
              focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(8),
                  borderSide:
                      const BorderSide(color: StaffTheme.steelBlue, width: 1.5)),
              filled: true,
              fillColor: StaffTheme.blueprintBg,
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
