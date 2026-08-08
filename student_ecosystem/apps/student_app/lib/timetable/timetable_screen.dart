import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:shared_models/shared_models.dart';
import '../theme/student_theme.dart';
import '../providers/student_provider.dart';

class TimetableScreen extends StatefulWidget {
  const TimetableScreen({super.key});

  @override
  State<TimetableScreen> createState() => _TimetableScreenState();
}

class _TimetableScreenState extends State<TimetableScreen>
    with SingleTickerProviderStateMixin {
  late TabController _dayTabCtrl;
  final List<String> _days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  int _todayIdx = 0;

  @override
  void initState() {
    super.initState();
    // Set default tab to current day of week if weekday is 1-5
    final wd = DateTime.now().weekday;
    if (wd >= 1 && wd <= 5) {
      _todayIdx = wd - 1;
    }
    _dayTabCtrl = TabController(initialIndex: _todayIdx, length: 5, vsync: this);
  }

  @override
  void dispose() {
    _dayTabCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<StudentProvider>();
    final timetable = prov.myTimetable;

    return Container(
      color: StudentTheme.blueprintBg,
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Timeline Info Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: StudentTheme.borderLight),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Academic Schedule & Timeline',
                          style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: StudentTheme.navy)),
                      const SizedBox(height: 4),
                      Text(
                          'Track scheduled course lectures alongside live assignment deadlines and quiz timings.',
                          style: GoogleFonts.roboto(
                              fontSize: 13, color: StudentTheme.textSecondary)),
                    ],
                  ),
                ),
                const SizedBox(width: 24),
                const Icon(Icons.calendar_month_rounded, color: StudentTheme.steelBlue, size: 36),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Day Selection TabBar
          TabBar(
            controller: _dayTabCtrl,
            labelColor: StudentTheme.steelBlue,
            unselectedLabelColor: StudentTheme.textMuted,
            indicatorColor: StudentTheme.steelBlue,
            dividerColor: StudentTheme.borderLight,
            labelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600),
            tabs: _days.map((d) => Tab(text: d)).toList(),
          ),
          const SizedBox(height: 20),

          // Timeline body
          Expanded(
            child: TabBarView(
              controller: _dayTabCtrl,
              children: _days.map((d) {
                final dayItems = timetable.where((item) => item.dayOfWeek == d).toList();

                if (dayItems.isEmpty) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Icon(Icons.event_busy_rounded, size: 54, color: StudentTheme.textMuted.withOpacity(0.3)),
                        const SizedBox(height: 12),
                        Text('No events or classes scheduled for $d.',
                            style: GoogleFonts.roboto(fontSize: 12, color: StudentTheme.textMuted)),
                      ],
                    ),
                  );
                }

                return ListView.builder(
                  itemCount: dayItems.length,
                  itemBuilder: (context, idx) {
                    final item = dayItems[idx];
                    IconData icon = Icons.school_rounded;
                    Color color = StudentTheme.steelBlue;
                    String badge = 'LECTURE';

                    if (item.type == TimetableItemType.deadline) {
                      icon = Icons.assignment_rounded;
                      color = StudentTheme.accentGold;
                      badge = 'DEADLINE';
                    } else if (item.type == TimetableItemType.quiz) {
                      icon = Icons.quiz_rounded;
                      color = StudentTheme.accentIndigo;
                      badge = 'EXAM / MCQ';
                    }

                    return Card(
                      margin: const EdgeInsets.only(bottom: 12),
                      color: Colors.white,
                      child: Padding(
                        padding: const EdgeInsets.all(16),
                        child: Row(
                          children: [
                            CircleAvatar(
                              backgroundColor: color.withOpacity(0.1),
                              child: Icon(icon, color: color, size: 18),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: color.withOpacity(0.12),
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          badge,
                                          style: GoogleFonts.inter(
                                            color: color,
                                            fontSize: 8,
                                            fontWeight: FontWeight.w800,
                                            letterSpacing: 0.5,
                                          ),
                                        ),
                                      ),
                                      if (item.isCompleted) ...[
                                        const SizedBox(width: 8),
                                        Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                          decoration: BoxDecoration(
                                            color: StudentTheme.successGreen.withOpacity(0.12),
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            'COMPLETED',
                                            style: GoogleFonts.inter(
                                              color: StudentTheme.successGreen,
                                              fontSize: 8,
                                              fontWeight: FontWeight.w800,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ],
                                  ),
                                  const SizedBox(height: 6),
                                  Text(item.title,
                                      style: GoogleFonts.inter(
                                          fontSize: 14,
                                          fontWeight: FontWeight.w700,
                                          color: StudentTheme.textPrimary)),
                                  Text(item.subtitle,
                                      style: GoogleFonts.roboto(
                                          fontSize: 11, color: StudentTheme.textSecondary)),
                                ],
                              ),
                            ),
                            const SizedBox(width: 16),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              children: [
                                Text(
                                  item.time,
                                  style: GoogleFonts.robotoMono(
                                      fontSize: 13,
                                      fontWeight: FontWeight.w700,
                                      color: StudentTheme.textPrimary),
                                ),
                                if (item.dueDate != null)
                                  Text(
                                    DateFormat('dd MMM').format(item.dueDate!),
                                    style: GoogleFonts.roboto(
                                        fontSize: 10, color: StudentTheme.textMuted),
                                  ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }
}
