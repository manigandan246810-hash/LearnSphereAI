import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:async';
import 'package:shared_models/shared_models.dart';
import '../theme/student_theme.dart';
import '../providers/student_provider.dart';

class CourseViewerScreen extends StatefulWidget {
  const CourseViewerScreen({super.key});

  @override
  State<CourseViewerScreen> createState() => _CourseViewerScreenState();
}

class _CourseViewerScreenState extends State<CourseViewerScreen>
    with SingleTickerProviderStateMixin {
  Course? _selectedCourse;
  late TabController _tabCtrl;
  bool _initialized = false;

  // Active quiz screen state
  McqTest? _takingQuiz;
  Map<String, int> _quizAnswers = {};
  int _quizTimeSeconds = 0;
  Timer? _quizTimer;
  int _currentQIdx = 0;

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabCtrl.dispose();
    _quizTimer?.cancel();
    super.dispose();
  }

  void _startQuiz(McqTest test) {
    setState(() {
      _takingQuiz = test;
      _quizAnswers = {};
      _currentQIdx = 0;
      _quizTimeSeconds = test.durationMinutes * 60;
    });

    _quizTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (!mounted) return;
      setState(() {
        if (_quizTimeSeconds > 0) {
          _quizTimeSeconds--;
        } else {
          _submitQuiz();
        }
      });
    });
  }

  void _submitQuiz() {
    _quizTimer?.cancel();
    if (_takingQuiz == null) return;

    final test = _takingQuiz!;
    int score = 0;
    for (int i = 0; i < test.questions.length; i++) {
      final q = test.questions[i];
      final chosen = _quizAnswers[q.id];
      if (chosen != null && chosen == q.correctOptionIndex) {
        score++;
      }
    }

    context.read<StudentProvider>().submitMcqAttempt(test.id, _quizAnswers, score);

    setState(() {
      _takingQuiz = null;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Quiz submitted successfully! Score: $score/${test.totalMarks}'),
        backgroundColor: StudentTheme.successGreen,
      ),
    );
  }

  Future<void> _pickAndSubmitAssignment(String assignmentId) async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['pdf', 'zip', 'doc', 'docx'],
      );

      if (result != null && result.files.isNotEmpty) {
        final name = result.files.first.name;
        if (!mounted) return;
        context.read<StudentProvider>().submitAssignment(assignmentId, name);
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Successfully submitted "$name"'), backgroundColor: StudentTheme.successGreen),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Submission failed: $e'), backgroundColor: StudentTheme.errorRed),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<StudentProvider>();
    final courses = prov.enrolledCourses;

    if (courses.isEmpty) {
      return Container(
        color: StudentTheme.blueprintBg,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.school_outlined, size: 72, color: StudentTheme.textMuted.withOpacity(0.3)),
              const SizedBox(height: 16),
              Text('You are not enrolled in any courses.',
                  style: GoogleFonts.inter(color: StudentTheme.textSecondary, fontSize: 14)),
              const SizedBox(height: 12),
              ElevatedButton(
                onPressed: () {
                  // Direct to Course Catalog (handled by parent switch via state callback usually,
                  // but here we just advise using side menu)
                },
                child: const Text('Discover Course Catalog'),
              ),
            ],
          ),
        ),
      );
    }

    if (!_initialized && _selectedCourse == null) {
      _selectedCourse = courses.first;
      _initialized = true;
    }

    // Refresh course references
    final activeCourse = prov.enrolledCourses.firstWhere(
      (c) => c.id == _selectedCourse?.id,
      orElse: () => courses.first,
    );

    if (_takingQuiz != null) {
      return _buildQuizPlayer();
    }

    return Container(
      color: StudentTheme.blueprintBg,
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Select course dropdown header
          Container(
            padding: const EdgeInsets.all(18),
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
                      Text(activeCourse.title,
                          style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: StudentTheme.navy)),
                      Text('${activeCourse.code} • ${activeCourse.credits} Credits • Sem ${activeCourse.semester}',
                          style: GoogleFonts.roboto(
                              fontSize: 12, color: StudentTheme.textSecondary)),
                    ],
                  ),
                ),
                SizedBox(
                  width: 250,
                  height: 40,
                  child: DropdownButtonFormField<Course>(
                    value: _selectedCourse,
                    decoration: const InputDecoration(
                      contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    ),
                    items: courses
                        .map((c) => DropdownMenuItem(
                              value: c,
                              child: Text(
                                c.code,
                                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600),
                              ),
                            ))
                        .toList(),
                    onChanged: (val) {
                      if (val != null) {
                        setState(() {
                          _selectedCourse = val;
                        });
                      }
                    },
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Tabs
          TabBar(
            controller: _tabCtrl,
            labelColor: StudentTheme.steelBlue,
            unselectedLabelColor: StudentTheme.textMuted,
            indicatorColor: StudentTheme.steelBlue,
            dividerColor: StudentTheme.borderLight,
            labelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600),
            tabs: const [
              Tab(text: 'Curriculum & Lectures'),
              Tab(text: 'Homework Assignments'),
              Tab(text: 'Exams & Quizzes'),
            ],
          ),
          const SizedBox(height: 16),

          // Tab views
          Expanded(
            child: TabBarView(
              controller: _tabCtrl,
              children: [
                _buildCurriculumTab(activeCourse),
                _buildAssignmentsTab(prov, activeCourse),
                _buildQuizzesTab(prov, activeCourse),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCurriculumTab(Course course) {
    if (course.modules.isEmpty) {
      return Center(
        child: Text('No learning materials uploaded for this course yet.',
            style: GoogleFonts.roboto(fontSize: 13, color: StudentTheme.textMuted)),
      );
    }

    return ListView.builder(
      itemCount: course.modules.length,
      itemBuilder: (context, idx) {
        final m = course.modules[idx];
        IconData icon = Icons.video_library_rounded;
        Color color = StudentTheme.steelBlue;
        if (m.type == 'pdf') {
          icon = Icons.picture_as_pdf_rounded;
          color = StudentTheme.errorRed;
        } else if (m.type == 'notes') {
          icon = Icons.sticky_note_2_rounded;
          color = StudentTheme.accentGold;
        }

        return Card(
          margin: const EdgeInsets.only(bottom: 10),
          color: Colors.white,
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: color.withOpacity(0.1),
              child: Icon(icon, color: color, size: 18),
            ),
            title: Text(m.title,
                style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: StudentTheme.textPrimary)),
            subtitle: Text('Type: ${m.type.toUpperCase()} • Uploaded: ${DateFormat('dd MMM yyyy').format(m.uploadedAt)}',
                style: GoogleFonts.roboto(fontSize: 11, color: StudentTheme.textSecondary)),
            trailing: const Icon(Icons.arrow_forward_ios_rounded, size: 13, color: StudentTheme.textMuted),
            onTap: () {
              showDialog(
                context: context,
                builder: (context) => AlertDialog(
                  backgroundColor: Colors.white,
                  title: Text(m.title, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: StudentTheme.navy)),
                  content: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(32),
                        decoration: BoxDecoration(
                          color: StudentTheme.blueprintBg,
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Icon(icon, size: 48, color: color),
                      ),
                      const SizedBox(height: 12),
                      Text('Accessing material link:', style: GoogleFonts.roboto(fontSize: 11, color: StudentTheme.textSecondary)),
                      SelectableText(m.url, style: GoogleFonts.robotoMono(fontSize: 12, color: StudentTheme.steelBlue, fontWeight: FontWeight.w600)),
                    ],
                  ),
                  actions: [
                    TextButton(
                      onPressed: () => Navigator.pop(context),
                      child: Text('Close', style: GoogleFonts.inter(fontWeight: FontWeight.w600)),
                    ),
                  ],
                ),
              );
            },
          ),
        );
      },
    );
  }

  Widget _buildAssignmentsTab(StudentProvider prov, Course course) {
    final assignments = prov.myAssignments.where((a) => a.courseId == course.id).toList();

    if (assignments.isEmpty) {
      return Center(
        child: Text('No assignments posted for this course.',
            style: GoogleFonts.roboto(fontSize: 13, color: StudentTheme.textMuted)),
      );
    }

    return ListView.builder(
      itemCount: assignments.length,
      itemBuilder: (context, idx) {
        final a = assignments[idx];
        final subs = prov.getMySubmissionsForAssignment(a.id);
        final isSubbed = subs.isNotEmpty;
        final latestSub = isSubbed ? subs.first : null;
        final isGraded = latestSub?.isGraded ?? false;

        return Card(
          margin: const EdgeInsets.only(bottom: 10),
          color: Colors.white,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(a.title,
                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: StudentTheme.textPrimary)),
                    const Spacer(),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                      decoration: BoxDecoration(
                        color: isGraded
                            ? StudentTheme.successGreen.withOpacity(0.12)
                            : (isSubbed ? StudentTheme.steelBlue.withOpacity(0.12) : StudentTheme.errorRed.withOpacity(0.08)),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: Text(
                        isGraded
                            ? 'GRADED'
                            : (isSubbed ? 'SUBMITTED' : 'PENDING'),
                        style: GoogleFonts.inter(
                          color: isGraded
                              ? StudentTheme.successGreen
                              : (isSubbed ? StudentTheme.steelBlue : StudentTheme.errorRed),
                          fontSize: 9,
                          fontWeight: FontWeight.w800,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(a.description, style: GoogleFonts.roboto(fontSize: 12, color: StudentTheme.textSecondary, height: 1.4)),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Text(
                      'Deadline: ${DateFormat('dd MMM yyyy, hh:mm a').format(a.deadline)}',
                      style: GoogleFonts.roboto(fontSize: 11, color: StudentTheme.textMuted),
                    ),
                    const Spacer(),
                    Text(
                      'Max Marks: ${a.maxMarks}',
                      style: GoogleFonts.roboto(fontSize: 11, color: StudentTheme.textSecondary, fontWeight: FontWeight.w600),
                    ),
                  ],
                ),
                const Divider(height: 24, color: StudentTheme.borderLight),
                if (isSubbed) ...[
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: StudentTheme.blueprintBg,
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: StudentTheme.borderLight),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Your Submission File: ${latestSub!.fileName}',
                            style: GoogleFonts.robotoMono(fontSize: 11, color: StudentTheme.steelBlue, fontWeight: FontWeight.w600)),
                        Text('Submitted At: ${DateFormat('dd MMM, hh:mm a').format(latestSub.submittedAt)}',
                            style: GoogleFonts.roboto(fontSize: 10, color: StudentTheme.textSecondary)),
                        if (isGraded) ...[
                          const SizedBox(height: 8),
                          Row(
                            children: [
                              Text('Marks Awarded: ', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700)),
                              Text('${latestSub.marksAwarded} / ${a.maxMarks}',
                                  style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: StudentTheme.successGreen)),
                            ],
                          ),
                          const SizedBox(height: 2),
                          Text('Feedback: ${latestSub.rubricFeedback}',
                              style: GoogleFonts.roboto(fontSize: 11, color: StudentTheme.textPrimary, fontStyle: FontStyle.italic)),
                        ],
                      ],
                    ),
                  ),
                ] else ...[
                  ElevatedButton.icon(
                    onPressed: () => _pickAndSubmitAssignment(a.id),
                    icon: const Icon(Icons.cloud_upload_rounded, size: 14),
                    label: const Text('Submit Homework File'),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      backgroundColor: StudentTheme.steelBlue,
                      minimumSize: Size.zero,
                    ),
                  ),
                ],
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildQuizzesTab(StudentProvider prov, Course course) {
    final tests = prov.myMcqTests.where((t) => t.courseId == course.id).toList();

    if (tests.isEmpty) {
      return Center(
        child: Text('No quizzes posted for this course.',
            style: GoogleFonts.roboto(fontSize: 13, color: StudentTheme.textMuted)),
      );
    }

    return ListView.builder(
      itemCount: tests.length,
      itemBuilder: (context, idx) {
        final t = tests[idx];
        final attempt = prov.getMyAttemptForTest(t.id);
        final isAttempted = attempt != null;

        return Card(
          margin: const EdgeInsets.only(bottom: 10),
          color: Colors.white,
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: StudentTheme.accentIndigo.withOpacity(0.1),
              child: const Icon(Icons.quiz_rounded, color: StudentTheme.accentIndigo, size: 18),
            ),
            title: Text(t.title,
                style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: StudentTheme.textPrimary)),
            subtitle: Text('Questions: ${t.questions.length} • Duration: ${t.durationMinutes} min',
                style: GoogleFonts.roboto(fontSize: 11, color: StudentTheme.textSecondary)),
            trailing: isAttempted
                ? Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: StudentTheme.successGreen.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      'SCORE: ${attempt.score}/${t.totalMarks}',
                      style: GoogleFonts.inter(
                          color: StudentTheme.successGreen, fontSize: 11, fontWeight: FontWeight.w700),
                    ),
                  )
                : ElevatedButton(
                    onPressed: () => _startQuiz(t),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      backgroundColor: StudentTheme.steelBlue,
                    ),
                    child: const Text('Start Quiz'),
                  ),
          ),
        );
      },
    );
  }

  Widget _buildQuizPlayer() {
    final test = _takingQuiz!;
    final q = test.questions[_currentQIdx];

    final min = _quizTimeSeconds ~/ 60;
    final sec = _quizTimeSeconds % 60;
    final timeStr = '${min.toString().padLeft(2, '0')}:${sec.toString().padLeft(2, '0')}';

    return Container(
      color: StudentTheme.blueprintBg,
      padding: const EdgeInsets.all(24),
      child: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 600),
          child: Card(
            color: Colors.white,
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Timer & Details Header
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(test.title,
                                style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: StudentTheme.navy)),
                            Text('Question ${_currentQIdx + 1} of ${test.questions.length}',
                                style: GoogleFonts.roboto(fontSize: 12, color: StudentTheme.textSecondary)),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(
                          color: StudentTheme.errorRed.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: StudentTheme.errorRed.withOpacity(0.3)),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.timer_outlined, color: StudentTheme.errorRed, size: 16),
                            const SizedBox(width: 6),
                            Text(
                              timeStr,
                              style: GoogleFonts.robotoMono(
                                  color: StudentTheme.errorRed, fontWeight: FontWeight.w700, fontSize: 13),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const Divider(height: 24, color: StudentTheme.borderLight),

                  // Prompt
                  Text(
                    q.prompt,
                    style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: StudentTheme.textPrimary),
                  ),
                  const SizedBox(height: 16),

                  // 4 options
                  ...List.generate(4, (i) {
                    final isChosen = _quizAnswers[q.id] == i;
                    final char = ['A', 'B', 'C', 'D'][i];

                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      color: isChosen ? StudentTheme.steelBlue.withOpacity(0.06) : StudentTheme.surfaceCard,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                        side: BorderSide(color: isChosen ? StudentTheme.steelBlue : StudentTheme.borderLight),
                      ),
                      child: ListTile(
                        leading: CircleAvatar(
                          radius: 12,
                          backgroundColor: isChosen ? StudentTheme.steelBlue : StudentTheme.borderLight,
                          child: Text(
                            char,
                            style: GoogleFonts.inter(
                                color: isChosen ? Colors.white : StudentTheme.textSecondary,
                                fontSize: 10,
                                fontWeight: FontWeight.w700),
                          ),
                        ),
                        title: Text(q.options[i], style: GoogleFonts.roboto(fontSize: 13, color: StudentTheme.textPrimary)),
                        onTap: () {
                          setState(() {
                            _quizAnswers[q.id] = i;
                          });
                        },
                      ),
                    );
                  }),
                  const SizedBox(height: 20),

                  // Bottom buttons
                  Row(
                    children: [
                      if (_currentQIdx > 0)
                        OutlinedButton(
                          onPressed: () => setState(() => _currentQIdx--),
                          style: OutlinedButton.styleFrom(
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            side: const BorderSide(color: StudentTheme.borderLight),
                          ),
                          child: const Text('Previous'),
                        )
                      else
                        const Spacer(),
                      const Spacer(),
                      if (_currentQIdx < test.questions.length - 1)
                        ElevatedButton(
                          onPressed: () => setState(() => _currentQIdx++),
                          style: ElevatedButton.styleFrom(backgroundColor: StudentTheme.steelBlue),
                          child: const Text('Next Question'),
                        )
                      else
                        ElevatedButton(
                          onPressed: _submitQuiz,
                          style: ElevatedButton.styleFrom(backgroundColor: StudentTheme.successGreen),
                          child: const Text('Submit Quiz'),
                        ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
