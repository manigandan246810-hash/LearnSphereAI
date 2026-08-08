import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import 'package:shared_models/shared_models.dart';
import '../theme/staff_theme.dart';
import '../providers/staff_provider.dart';

class AssignmentHubScreen extends StatefulWidget {
  const AssignmentHubScreen({super.key});

  @override
  State<AssignmentHubScreen> createState() => _AssignmentHubScreenState();
}

class _AssignmentHubScreenState extends State<AssignmentHubScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _descCtrl = TextEditingController();
  final _marksCtrl = TextEditingController();
  
  Course? _selectedCourse;
  DateTime? _selectedDeadline;
  TimeOfDay? _selectedTime;
  
  Assignment? _viewingAssignment;
  AssignmentSubmission? _gradingSubmission;
  
  final _gradeMarksCtrl = TextEditingController();
  final _gradeFeedbackCtrl = TextEditingController();
  final _gradeFormKey = GlobalKey<FormState>();
  
  bool _initialized = false;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _descCtrl.dispose();
    _marksCtrl.dispose();
    _gradeMarksCtrl.dispose();
    _gradeFeedbackCtrl.dispose();
    super.dispose();
  }

  void _resetForm() {
    _titleCtrl.clear();
    _descCtrl.clear();
    _marksCtrl.clear();
    _selectedDeadline = null;
    _selectedTime = null;
  }

  Future<void> _pickDeadlineDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 3)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 90)),
    );
    if (picked != null) {
      setState(() {
        _selectedDeadline = picked;
      });
    }
  }

  Future<void> _pickDeadlineTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: const TimeOfDay(hour: 23, minute: 59),
    );
    if (picked != null) {
      setState(() {
        _selectedTime = picked;
      });
    }
  }

  void _createAssignment(StaffProvider prov) {
    if (!_formKey.currentState!.validate() || _selectedCourse == null) return;
    if (_selectedDeadline == null || _selectedTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select deadline date and time.'), backgroundColor: StaffTheme.errorRed),
      );
      return;
    }

    final deadline = DateTime(
      _selectedDeadline!.year,
      _selectedDeadline!.month,
      _selectedDeadline!.day,
      _selectedTime!.hour,
      _selectedTime!.minute,
    );

    final newAssignment = Assignment(
      id: 'assign_${DateTime.now().millisecondsSinceEpoch}',
      courseId: _selectedCourse!.id,
      courseName: _selectedCourse!.title,
      staffId: prov.currentStaff.id,
      title: _titleCtrl.text.trim(),
      description: _descCtrl.text.trim(),
      maxMarks: int.tryParse(_marksCtrl.text.trim()) ?? 100,
      deadline: deadline,
      submissions: [],
    );

    prov.addAssignment(newAssignment);
    _resetForm();

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('New assignment posted for ${_selectedCourse!.code}!'),
        backgroundColor: StaffTheme.successGreen,
      ),
    );
  }

  void _submitGrade(StaffProvider prov) {
    if (!_gradeFormKey.currentState!.validate() || _viewingAssignment == null || _gradingSubmission == null) return;

    final marks = int.tryParse(_gradeMarksCtrl.text.trim()) ?? 0;
    if (marks > _viewingAssignment!.maxMarks) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Marks cannot exceed assignment max marks (${_viewingAssignment!.maxMarks})'),
          backgroundColor: StaffTheme.errorRed,
        ),
      );
      return;
    }

    prov.gradeSubmission(
      _viewingAssignment!.id,
      _gradingSubmission!.id,
      marks,
      _gradeFeedbackCtrl.text.trim(),
    );

    // Refresh local references
    setState(() {
      final updatedAssignment = prov.assignments.firstWhere((a) => a.id == _viewingAssignment!.id);
      _viewingAssignment = updatedAssignment;
      _gradingSubmission = null;
      _gradeMarksCtrl.clear();
      _gradeFeedbackCtrl.clear();
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Submission graded successfully!'),
        backgroundColor: StaffTheme.successGreen,
      ),
    );
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

    final courseAssignments = prov.assignments
        .where((a) => a.courseId == _selectedCourse?.id)
        .toList();

    return Container(
      color: StaffTheme.blueprintBg,
      padding: const EdgeInsets.all(24),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Left Form / List Panel
          Expanded(
            flex: 5,
            child: Column(
              children: [
                // Create Assignment form
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: StaffTheme.borderLight),
                  ),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          children: [
                            Text('Post New Assignment',
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
                                    _viewingAssignment = null;
                                    _gradingSubmission = null;
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
                            hintText: 'Assignment Title...',
                            contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                          ),
                          style: GoogleFonts.inter(fontSize: 13),
                          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 10),
                        TextFormField(
                          controller: _descCtrl,
                          maxLines: 2,
                          decoration: const InputDecoration(
                            hintText: 'Describe homework task, files to submit, rubrics...',
                            contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                          ),
                          style: GoogleFonts.roboto(fontSize: 13),
                          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            Expanded(
                              child: TextFormField(
                                controller: _marksCtrl,
                                keyboardType: TextInputType.number,
                                decoration: const InputDecoration(
                                  hintText: 'Max Marks (e.g. 50)',
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
                                onPressed: _pickDeadlineDate,
                                icon: const Icon(Icons.calendar_today_rounded, size: 14),
                                label: Text(
                                  _selectedDeadline == null
                                      ? 'Set Date Limit'
                                      : DateFormat('dd MMM yyyy').format(_selectedDeadline!),
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
                                onPressed: _pickDeadlineTime,
                                icon: const Icon(Icons.access_time_rounded, size: 14),
                                label: Text(
                                  _selectedTime == null ? 'Set Time Limit' : _selectedTime!.format(context),
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
                        const SizedBox(height: 14),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            onPressed: () => _createAssignment(prov),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: StaffTheme.steelBlue,
                            ),
                            child: const Text('Post Assignment'),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                const SizedBox(height: 16),

                // Active Assignments list
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
                            'Active Assignments — ${_selectedCourse?.code}',
                            style: GoogleFonts.inter(
                                fontSize: 13, fontWeight: FontWeight.w700, color: StaffTheme.textPrimary),
                          ),
                        ),
                        const Divider(height: 1, color: StaffTheme.borderLight),
                        Expanded(
                          child: courseAssignments.isEmpty
                              ? Center(
                                  child: Text('No active assignments posted.',
                                      style: GoogleFonts.roboto(fontSize: 12, color: StaffTheme.textMuted)),
                                )
                              : ListView.builder(
                                  padding: const EdgeInsets.all(12),
                                  itemCount: courseAssignments.length,
                                  itemBuilder: (context, index) {
                                    final a = courseAssignments[index];
                                    final isSel = _viewingAssignment?.id == a.id;
                                    final deadlineStr = DateFormat('dd MMM, hh:mm a').format(a.deadline);

                                    return Card(
                                      margin: const EdgeInsets.only(bottom: 8),
                                      color: isSel ? StaffTheme.steelBlue.withOpacity(0.06) : StaffTheme.surfaceCard,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8),
                                        side: BorderSide(
                                            color: isSel ? StaffTheme.steelBlue : StaffTheme.borderLight),
                                      ),
                                      child: ListTile(
                                        title: Text(a.title,
                                            style: GoogleFonts.inter(
                                                fontSize: 13,
                                                fontWeight: FontWeight.w600,
                                                color: StaffTheme.textPrimary)),
                                        subtitle: Text(
                                          'Deadline: $deadlineStr • Max Marks: ${a.maxMarks}',
                                          style: GoogleFonts.roboto(fontSize: 11, color: StaffTheme.textSecondary),
                                        ),
                                        trailing: Container(
                                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                          decoration: BoxDecoration(
                                            color: StaffTheme.steelBlue.withOpacity(0.1),
                                            borderRadius: BorderRadius.circular(4),
                                          ),
                                          child: Text(
                                            '${a.submissions.length} Submissions',
                                            style: GoogleFonts.inter(
                                                color: StaffTheme.steelBlue,
                                                fontSize: 10,
                                                fontWeight: FontWeight.w700),
                                          ),
                                        ),
                                        onTap: () {
                                          setState(() {
                                            _viewingAssignment = a;
                                            _gradingSubmission = null;
                                          });
                                        },
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
          ),
          const SizedBox(width: 20),

          // Right Grading Panel
          Expanded(
            flex: 5,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                border: Border.all(color: StaffTheme.borderLight),
              ),
              child: _viewingAssignment == null
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.assignment_turned_in_rounded, size: 64, color: StaffTheme.textMuted.withOpacity(0.3)),
                          const SizedBox(height: 14),
                          Text('Select an assignment to view submissions',
                              style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: StaffTheme.textMuted)),
                        ],
                      ),
                    )
                  : Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Assignment details header
                        Padding(
                          padding: const EdgeInsets.all(20),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: StaffTheme.steelBlue,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: Text(
                                  _viewingAssignment!.courseName,
                                  style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w700, color: Colors.white),
                                ),
                              ),
                              const SizedBox(height: 8),
                              Text(_viewingAssignment!.title,
                                  style: GoogleFonts.inter(
                                      fontSize: 16, fontWeight: FontWeight.w700, color: StaffTheme.navy)),
                              const SizedBox(height: 4),
                              Text(_viewingAssignment!.description,
                                  style: GoogleFonts.roboto(fontSize: 12, color: StaffTheme.textSecondary)),
                            ],
                          ),
                        ),
                        const Divider(height: 1, color: StaffTheme.borderLight),

                        // Submission list or Grading Form
                        Expanded(
                          child: _gradingSubmission == null
                              ? _buildSubmissionList()
                              : _buildGradingForm(prov),
                        ),
                      ],
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubmissionList() {
    final submissions = _viewingAssignment!.submissions;
    if (submissions.isEmpty) {
      return Center(
        child: Text('No submissions received yet.',
            style: GoogleFonts.roboto(fontSize: 13, color: StaffTheme.textMuted)),
      );
    }

    return ListView.builder(
      padding: const EdgeInsets.all(12),
      itemCount: submissions.length,
      itemBuilder: (context, idx) {
        final sub = submissions[idx];
        return Card(
          margin: const EdgeInsets.only(bottom: 8),
          color: StaffTheme.surfaceCard,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
            side: const BorderSide(color: StaffTheme.borderLight),
          ),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: StaffTheme.steelBlue.withOpacity(0.1),
              child: const Icon(Icons.person, color: StaffTheme.steelBlue, size: 18),
            ),
            title: Text(sub.studentName,
                style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: StaffTheme.textPrimary)),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 2),
                Text('File: ${sub.fileName}', style: GoogleFonts.robotoMono(fontSize: 10, color: StaffTheme.textMuted)),
                Text('Submitted: ${DateFormat('dd MMM, hh:mm a').format(sub.submittedAt)}',
                    style: GoogleFonts.roboto(fontSize: 10, color: StaffTheme.textSecondary)),
              ],
            ),
            trailing: sub.isGraded
                ? Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(
                      color: StaffTheme.successGreen.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      'GRADED: ${sub.marksAwarded}/${_viewingAssignment!.maxMarks}',
                      style: GoogleFonts.inter(
                          color: StaffTheme.successGreen, fontSize: 10, fontWeight: FontWeight.w700),
                    ),
                  )
                : ElevatedButton(
                    onPressed: () {
                      setState(() {
                        _gradingSubmission = sub;
                        _gradeMarksCtrl.text = sub.marksAwarded?.toString() ?? '';
                        _gradeFeedbackCtrl.text = sub.rubricFeedback ?? '';
                      });
                    },
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      backgroundColor: StaffTheme.steelBlue,
                    ),
                    child: Text('Grade', style: GoogleFonts.inter(fontSize: 11)),
                  ),
          ),
        );
      },
    );
  }

  Widget _buildGradingForm(StaffProvider prov) {
    final sub = _gradingSubmission!;
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Form(
        key: _gradeFormKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                IconButton(
                  icon: const Icon(Icons.arrow_back_rounded, color: StaffTheme.textMuted, size: 18),
                  onPressed: () => setState(() => _gradingSubmission = null),
                ),
                const SizedBox(width: 8),
                Text('Grade: ${sub.studentName}',
                    style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: StaffTheme.textPrimary)),
              ],
            ),
            const Divider(height: 24, color: StaffTheme.borderLight),
            Text('Submission File:', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: StaffTheme.textMuted)),
            Text(sub.fileName, style: GoogleFonts.robotoMono(fontSize: 13, color: StaffTheme.steelBlue, fontWeight: FontWeight.w500)),
            const SizedBox(height: 18),
            
            Text('Marks Awarded (out of ${_viewingAssignment!.maxMarks})',
                style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: StaffTheme.textPrimary)),
            const SizedBox(height: 6),
            TextFormField(
              controller: _gradeMarksCtrl,
              keyboardType: TextInputType.number,
              decoration: const InputDecoration(
                hintText: 'Enter marks...',
                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              ),
              style: GoogleFonts.inter(fontSize: 13),
              validator: (v) => v == null || int.tryParse(v) == null ? 'Must be a number' : null,
            ),
            const SizedBox(height: 18),
            
            Text('Rubric Feedback',
                style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: StaffTheme.textPrimary)),
            const SizedBox(height: 6),
            TextFormField(
              controller: _gradeFeedbackCtrl,
              maxLines: 4,
              decoration: const InputDecoration(
                hintText: 'Specify feedback matching assignment rubrics...',
                contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              ),
              style: GoogleFonts.roboto(fontSize: 13),
              validator: (v) => v == null || v.isEmpty ? 'Please enter feedback' : null,
            ),
            const Spacer(),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () => setState(() => _gradingSubmission = null),
                    style: OutlinedButton.styleFrom(
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                      side: const BorderSide(color: StaffTheme.borderLight),
                    ),
                    child: const Text('Cancel'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _submitGrade(prov),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: StaffTheme.successGreen,
                    ),
                    child: const Text('Submit Grade'),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
