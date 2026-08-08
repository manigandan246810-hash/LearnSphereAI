import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:shared_models/shared_models.dart';
import '../theme/staff_theme.dart';
import '../providers/staff_provider.dart';

class McqBuilderScreen extends StatefulWidget {
  const McqBuilderScreen({super.key});

  @override
  State<McqBuilderScreen> createState() => _McqBuilderScreenState();
}

class _McqBuilderScreenState extends State<McqBuilderScreen> {
  final _testFormKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _durationCtrl = TextEditingController();
  
  Course? _selectedCourse;
  DateTime? _scheduledDate;
  TimeOfDay? _scheduledTime;

  // Active builder questions
  final List<McqQuestion> _questions = [];
  
  // Question form controllers
  final _questionFormKey = GlobalKey<FormState>();
  final _promptCtrl = TextEditingController();
  final _opt1Ctrl = TextEditingController();
  final _opt2Ctrl = TextEditingController();
  final _opt3Ctrl = TextEditingController();
  final _opt4Ctrl = TextEditingController();
  int _correctIdx = 0;

  McqTest? _viewingTestScoreboard;
  bool _initialized = false;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _durationCtrl.dispose();
    _promptCtrl.dispose();
    _opt1Ctrl.dispose();
    _opt2Ctrl.dispose();
    _opt3Ctrl.dispose();
    _opt4Ctrl.dispose();
    super.dispose();
  }

  void _addQuestion() {
    if (!_questionFormKey.currentState!.validate()) return;
    
    final q = McqQuestion(
      id: 'q_${DateTime.now().millisecondsSinceEpoch}_${_questions.length}',
      prompt: _promptCtrl.text.trim(),
      options: [
        _opt1Ctrl.text.trim(),
        _opt2Ctrl.text.trim(),
        _opt3Ctrl.text.trim(),
        _opt4Ctrl.text.trim(),
      ],
      correctOptionIndex: _correctIdx,
    );

    setState(() {
      _questions.add(q);
      _promptCtrl.clear();
      _opt1Ctrl.clear();
      _opt2Ctrl.clear();
      _opt3Ctrl.clear();
      _opt4Ctrl.clear();
      _correctIdx = 0;
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Question ${_questions.length} added to list.'), backgroundColor: StaffTheme.steelBlue),
    );
  }

  void _createTest(StaffProvider prov) {
    if (!_testFormKey.currentState!.validate() || _selectedCourse == null) return;
    if (_scheduledDate == null || _scheduledTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select quiz date and time.'), backgroundColor: StaffTheme.errorRed),
      );
      return;
    }
    if (_questions.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please add at least one question to the quiz.'), backgroundColor: StaffTheme.errorRed),
      );
      return;
    }

    final scheduled = DateTime(
      _scheduledDate!.year,
      _scheduledDate!.month,
      _scheduledDate!.day,
      _scheduledTime!.hour,
      _scheduledTime!.minute,
    );

    final test = McqTest(
      id: 'mcq_${DateTime.now().millisecondsSinceEpoch}',
      courseId: _selectedCourse!.id,
      courseName: _selectedCourse!.title,
      staffId: prov.currentStaff.id,
      title: _titleCtrl.text.trim(),
      questions: List.from(_questions),
      durationMinutes: int.tryParse(_durationCtrl.text.trim()) ?? 30,
      scheduledAt: scheduled,
      attempts: [],
    );

    prov.addMcqTest(test);

    setState(() {
      _titleCtrl.clear();
      _durationCtrl.clear();
      _scheduledDate = null;
      _scheduledTime = null;
      _questions.clear();
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('MCQ Test published successfully for ${_selectedCourse!.code}!'),
        backgroundColor: StaffTheme.successGreen,
      ),
    );
  }

  Future<void> _pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 1)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 60)),
    );
    if (picked != null) {
      setState(() {
        _scheduledDate = picked;
      });
    }
  }

  Future<void> _pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: const TimeOfDay(hour: 10, minute: 0),
    );
    if (picked != null) {
      setState(() {
        _scheduledTime = picked;
      });
    }
  }

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
      _initialized = true;
    }

    final courseTests = prov.mcqTests
        .where((t) => t.courseId == _selectedCourse?.id)
        .toList();

    return Container(
      color: StaffTheme.blueprintBg,
      padding: const EdgeInsets.all(24),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Left quiz builder panel
          Expanded(
            flex: 6,
            child: SingleChildScrollView(
              child: Column(
                children: [
                  // Test Info form
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: StaffTheme.borderLight),
                    ),
                    child: Form(
                      key: _testFormKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text('MCQ Assessment Builder',
                                  style: GoogleFonts.inter(
                                      fontSize: 15, fontWeight: FontWeight.w700, color: StaffTheme.navy)),
                              const Spacer(),
                              SizedBox(
                                width: 180,
                                height: 36,
                                child: DropdownButtonFormField<Course>(
                                  value: _selectedCourse,
                                  decoration: const InputDecoration(
                                    contentPadding: EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                                  ),
                                  items: courses
                                      .map((c) => DropdownMenuItem(
                                            value: c,
                                            child: Text(c.code,
                                                style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600)),
                                          ))
                                      .toList(),
                                  onChanged: (val) {
                                    setState(() {
                                      _selectedCourse = val;
                                      _viewingTestScoreboard = null;
                                    });
                                  },
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: _titleCtrl,
                            decoration: const InputDecoration(
                              hintText: 'Quiz Title (e.g. Unit 2 Algorithms Test)',
                              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            ),
                            style: GoogleFonts.inter(fontSize: 13),
                            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: TextFormField(
                                  controller: _durationCtrl,
                                  keyboardType: TextInputType.number,
                                  decoration: const InputDecoration(
                                    hintText: 'Duration (Minutes)',
                                    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                                  ),
                                  style: GoogleFonts.inter(fontSize: 13),
                                  validator: (v) =>
                                      v == null || int.tryParse(v) == null ? 'Must be a number' : null,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: _pickDate,
                                  icon: const Icon(Icons.calendar_today_rounded, size: 14),
                                  label: Text(
                                    _scheduledDate == null
                                        ? 'Set Quiz Date'
                                        : DateFormat('dd MMM yyyy').format(_scheduledDate!),
                                    style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600),
                                  ),
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: StaffTheme.steelBlue,
                                    side: const BorderSide(color: StaffTheme.borderLight),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Expanded(
                                child: OutlinedButton.icon(
                                  onPressed: _pickTime,
                                  icon: const Icon(Icons.access_time_rounded, size: 14),
                                  label: Text(
                                    _scheduledTime == null ? 'Set Start Time' : _scheduledTime!.format(context),
                                    style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600),
                                  ),
                                  style: OutlinedButton.styleFrom(
                                    foregroundColor: StaffTheme.steelBlue,
                                    side: const BorderSide(color: StaffTheme.borderLight),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Add Question builder form
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(10),
                      border: Border.all(color: StaffTheme.borderLight),
                    ),
                    child: Form(
                      key: _questionFormKey,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text('Add Question #${_questions.length + 1}',
                              style: GoogleFonts.inter(
                                  fontSize: 14, fontWeight: FontWeight.w700, color: StaffTheme.navy)),
                          const Divider(height: 20, color: StaffTheme.borderLight),
                          TextFormField(
                            controller: _promptCtrl,
                            decoration: const InputDecoration(
                              hintText: 'Enter question prompt...',
                              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            ),
                            style: GoogleFonts.inter(fontSize: 13),
                            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                          ),
                          const SizedBox(height: 14),
                          // 4 options
                          _optionField(_opt1Ctrl, 0, 'Option A'),
                          const SizedBox(height: 8),
                          _optionField(_opt2Ctrl, 1, 'Option B'),
                          const SizedBox(height: 8),
                          _optionField(_opt3Ctrl, 2, 'Option C'),
                          const SizedBox(height: 8),
                          _optionField(_opt4Ctrl, 3, 'Option D'),
                          const SizedBox(height: 16),
                          Row(
                            children: [
                              Text('Correct Option Index:',
                                  style: GoogleFonts.inter(
                                      fontSize: 12, fontWeight: FontWeight.w600, color: StaffTheme.textSecondary)),
                              const SizedBox(width: 14),
                              _correctOptionRadio(0, 'A'),
                              _correctOptionRadio(1, 'B'),
                              _correctOptionRadio(2, 'C'),
                              _correctOptionRadio(3, 'D'),
                              const Spacer(),
                              ElevatedButton.icon(
                                onPressed: _addQuestion,
                                icon: const Icon(Icons.add_rounded, size: 16),
                                label: const Text('Add Question'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: StaffTheme.steelBlue,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Questions preview list
                  if (_questions.isNotEmpty)
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: StaffTheme.borderLight),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Text('Added Questions (${_questions.length})',
                                  style: GoogleFonts.inter(
                                      fontSize: 14, fontWeight: FontWeight.w700, color: StaffTheme.navy)),
                              const Spacer(),
                              ElevatedButton.icon(
                                onPressed: () => _createTest(prov),
                                icon: const Icon(Icons.cloud_upload_rounded, size: 16),
                                label: const Text('Publish Entire Quiz'),
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: StaffTheme.successGreen,
                                ),
                              ),
                            ],
                          ),
                          const Divider(height: 24, color: StaffTheme.borderLight),
                          ListView.builder(
                            shrinkWrap: true,
                            physics: const NeverScrollableScrollPhysics(),
                            itemCount: _questions.length,
                            itemBuilder: (context, idx) {
                              final q = _questions[idx];
                              return Padding(
                                padding: const EdgeInsets.only(bottom: 12),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Q${idx + 1}. ${q.prompt}',
                                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600)),
                                    const SizedBox(height: 6),
                                    Padding(
                                      padding: const EdgeInsets.only(left: 12),
                                      child: Column(
                                        children: List.generate(
                                          4,
                                          (i) => Row(
                                            children: [
                                              Icon(
                                                q.correctOptionIndex == i
                                                    ? Icons.check_circle_rounded
                                                    : Icons.radio_button_off_rounded,
                                                color: q.correctOptionIndex == i
                                                    ? StaffTheme.successGreen
                                                    : StaffTheme.textMuted,
                                                size: 14,
                                              ),
                                              const SizedBox(width: 8),
                                              Text(q.options[i],
                                                  style: GoogleFonts.roboto(
                                                      fontSize: 12,
                                                      color: q.correctOptionIndex == i
                                                          ? StaffTheme.successGreen
                                                          : StaffTheme.textSecondary)),
                                            ],
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                ],
              ),
            ),
          ),
          const SizedBox(width: 20),

          // Right Quiz list and Scoreboard panel
          Expanded(
            flex: 4,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: StaffTheme.borderLight),
              ),
              child: _viewingTestScoreboard != null
                  ? _buildScoreboard()
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Padding(
                          padding: const EdgeInsets.all(20),
                          child: Text(
                            'Published Quizzes — ${_selectedCourse?.code}',
                            style: GoogleFonts.inter(
                                fontSize: 14, fontWeight: FontWeight.w700, color: StaffTheme.textPrimary),
                          ),
                        ),
                        const Divider(height: 1, color: StaffTheme.borderLight),
                        Expanded(
                          child: courseTests.isEmpty
                              ? Center(
                                  child: Text('No MCQ tests published.',
                                      style: GoogleFonts.roboto(fontSize: 12, color: StaffTheme.textMuted)),
                                )
                              : ListView.builder(
                                  padding: const EdgeInsets.all(12),
                                  itemCount: courseTests.length,
                                  itemBuilder: (context, index) {
                                    final t = courseTests[index];
                                    final dateStr = DateFormat('dd MMM yyyy, hh:mm a').format(t.scheduledAt);

                                    return Card(
                                      margin: const EdgeInsets.only(bottom: 8),
                                      color: StaffTheme.surfaceCard,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                        side: const BorderSide(color: StaffTheme.borderLight),
                                      ),
                                      child: ListTile(
                                        title: Text(t.title,
                                            style: GoogleFonts.inter(
                                                fontSize: 13,
                                                fontWeight: FontWeight.w600,
                                                color: StaffTheme.textPrimary)),
                                        subtitle: Text(
                                          'Scheduled: $dateStr\nDuration: ${t.durationMinutes} min • Questions: ${t.questions.length}',
                                          style: GoogleFonts.roboto(fontSize: 11, color: StaffTheme.textSecondary),
                                        ),
                                        isThreeLine: true,
                                        trailing: ElevatedButton(
                                          onPressed: () {
                                            setState(() {
                                              _viewingTestScoreboard = t;
                                            });
                                          },
                                          style: ElevatedButton.styleFrom(
                                            backgroundColor: StaffTheme.steelBlue,
                                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                                          ),
                                          child: Text('Scores', style: GoogleFonts.inter(fontSize: 11)),
                                        ),
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

  Widget _optionField(TextEditingController ctrl, int idx, String label) {
    return Row(
      children: [
        CircleAvatar(
          radius: 12,
          backgroundColor: StaffTheme.steelBlue.withOpacity(0.1),
          child: Text(
            label[label.length - 1],
            style: GoogleFonts.inter(color: StaffTheme.steelBlue, fontSize: 10, fontWeight: FontWeight.w700),
          ),
        ),
        const SizedBox(width: 10),
        Expanded(
          child: TextFormField(
            controller: ctrl,
            decoration: InputDecoration(
              hintText: 'Enter $label content...',
              contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            ),
            style: GoogleFonts.roboto(fontSize: 12),
            validator: (v) => v == null || v.isEmpty ? 'Required' : null,
          ),
        ),
      ],
    );
  }

  Widget _correctOptionRadio(int val, String label) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Radio<int>(
          value: val,
          groupValue: _correctIdx,
          activeColor: StaffTheme.steelBlue,
          onChanged: (v) {
            if (v != null) {
              setState(() {
                _correctIdx = v;
              });
            }
          },
        ),
        Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: StaffTheme.textPrimary)),
        const SizedBox(width: 8),
      ],
    );
  }

  Widget _buildScoreboard() {
    final t = _viewingTestScoreboard!;
    final attempts = t.attempts;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              IconButton(
                icon: const Icon(Icons.arrow_back_rounded, color: StaffTheme.textMuted, size: 18),
                onPressed: () => setState(() => _viewingTestScoreboard = null),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(t.title,
                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: StaffTheme.navy),
                        overflow: TextOverflow.ellipsis),
                    Text('Quiz Student Scoreboard',
                        style: GoogleFonts.roboto(fontSize: 11, color: StaffTheme.textSecondary)),
                  ],
                ),
              ),
            ],
          ),
        ),
        const Divider(height: 1, color: StaffTheme.borderLight),
        Expanded(
          child: attempts.isEmpty
              ? Center(
                  child: Text('No students have taken this quiz yet.',
                      style: GoogleFonts.roboto(fontSize: 13, color: StaffTheme.textMuted)),
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: attempts.length,
                  itemBuilder: (context, idx) {
                    final att = attempts[idx];
                    final pct = att.percentage;
                    return Card(
                      margin: const EdgeInsets.only(bottom: 8),
                      color: StaffTheme.surfaceCard,
                      child: ListTile(
                        leading: CircleAvatar(
                          backgroundColor: StaffTheme.steelBlue.withOpacity(0.1),
                          child: const Icon(Icons.person, color: StaffTheme.steelBlue, size: 18),
                        ),
                        title: Text(att.studentName,
                            style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: StaffTheme.textPrimary)),
                        subtitle: Text(
                          'Submitted: ${DateFormat('dd MMM, hh:mm a').format(att.submittedAt)}',
                          style: GoogleFonts.roboto(fontSize: 11, color: StaffTheme.textMuted),
                        ),
                        trailing: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                          decoration: BoxDecoration(
                            color: pct >= 70.0
                                ? StaffTheme.successGreen.withOpacity(0.1)
                                : StaffTheme.errorRed.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: Text(
                            'SCORE: ${att.score}/${t.totalMarks} (${pct.toStringAsFixed(0)}%)',
                            style: GoogleFonts.inter(
                              color: pct >= 70.0 ? StaffTheme.successGreen : StaffTheme.errorRed,
                              fontSize: 10,
                              fontWeight: FontWeight.w700,
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
        ),
      ],
    );
  }
}
