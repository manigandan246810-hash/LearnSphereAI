import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_models/shared_models.dart';
import '../theme/student_theme.dart';
import '../dashboard/student_dashboard_screen.dart';

class StudentLoginScreen extends StatefulWidget {
  const StudentLoginScreen({super.key});

  @override
  State<StudentLoginScreen> createState() => _StudentLoginScreenState();
}

class _StudentLoginScreenState extends State<StudentLoginScreen>
    with SingleTickerProviderStateMixin {
  final _emailCtrl = TextEditingController();
  final _passCtrl = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _obscure = true;
  bool _loading = false;
  String? _error;
  late AnimationController _animCtrl;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _animCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 700));
    _fadeAnim = CurvedAnimation(parent: _animCtrl, curve: Curves.easeOut);
    _animCtrl.forward();
  }

  @override
  void dispose() {
    _animCtrl.dispose();
    _emailCtrl.dispose();
    _passCtrl.dispose();
    super.dispose();
  }

  Future<void> _login() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() { _loading = true; _error = null; });
    await Future.delayed(const Duration(milliseconds: 800));

    final email = _emailCtrl.text.trim();
    final password = _passCtrl.text.trim();

    // Check against standard mock student or newly onboarded students
    final match = MockData.instance.students.where((s) => s.email == email);

    if (match.isNotEmpty && (password == match.first.tempPassword || password == 'Student@2024')) {
      if (mounted) {
        Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const StudentDashboardScreen()));
      }
    } else if (email == MockData.hodEmail || email == MockData.staffEmail) {
      setState(() {
        _error = 'Security Alert: Admin or Faculty credentials entered. You must log in via their respective portals.';
        _loading = false;
      });
    } else {
      setState(() {
        _error = 'Invalid student credentials. Please check spelling or contact faculty for temp password.';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: StudentTheme.navy,
      body: Row(
        children: [
          // Left side branding panel
          Expanded(
            flex: 5,
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF001224), Color(0xFF003366)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: FadeTransition(
                opacity: _fadeAnim,
                child: Padding(
                  padding: const EdgeInsets.all(60),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(
                            horizontal: 14, vertical: 7),
                        decoration: BoxDecoration(
                          color: StudentTheme.accentCyan.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                              color: StudentTheme.accentCyan.withOpacity(0.4)),
                        ),
                        child: Text('CAMPUS LEARNER',
                            style: GoogleFonts.inter(
                                color: StudentTheme.accentCyan,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 2)),
                      ),
                      const SizedBox(height: 28),
                      Text('Campus Learner\nStudent Workspace',
                          style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 42,
                              fontWeight: FontWeight.w700,
                              height: 1.1)),
                      const SizedBox(height: 16),
                      Text(
                          'Empowering student learning and progress tracking.\nJoin live curriculum, take MCQ tests, and manage schedule.',
                          style: GoogleFonts.roboto(
                              color: Colors.white54, fontSize: 14, height: 1.7)),
                      const SizedBox(height: 52),
                      _row(Icons.search_rounded, 'Advanced Course Discovery & Enrolment'),
                      const SizedBox(height: 14),
                      _row(Icons.auto_graph_rounded, 'Daily Progress Tracker & Study Streaks'),
                      const SizedBox(height: 14),
                      _row(Icons.calendar_month_rounded, 'Interactive Lecture Timetable & Deadlines'),
                      const SizedBox(height: 14),
                      _row(Icons.assignment_turned_in_rounded, 'MCQ Assessment Taker & Scoreboard'),
                    ],
                  ),
                ),
              ),
            ),
          ),
          // Right login form
          Expanded(
            flex: 4,
            child: Container(
              color: StudentTheme.blueprintBg,
              child: FadeTransition(
                opacity: _fadeAnim,
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 380),
                    child: Padding(
                      padding: const EdgeInsets.all(48),
                      child: Form(
                        key: _formKey,
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(children: [
                              Container(
                                width: 42,
                                height: 42,
                                decoration: BoxDecoration(
                                  color: StudentTheme.steelBlue,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(Icons.school_rounded,
                                    color: Colors.white, size: 22),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Student Portal',
                                      style: GoogleFonts.inter(
                                          fontSize: 17,
                                          fontWeight: FontWeight.w700,
                                          color: StudentTheme.navy)),
                                  Text('Campus Learner Gateway',
                                      style: GoogleFonts.roboto(
                                          fontSize: 11,
                                          color: StudentTheme.textMuted)),
                                ],
                              ),
                            ]),
                            const SizedBox(height: 36),
                            Text('Student Sign In',
                                style: GoogleFonts.inter(
                                    fontSize: 24,
                                    fontWeight: FontWeight.w700,
                                    color: StudentTheme.textPrimary)),
                            const SizedBox(height: 6),
                            Text(
                              'Only active student accounts are permitted access to this portal.',
                              style: GoogleFonts.roboto(
                                  fontSize: 11,
                                  color: StudentTheme.textSecondary)),
                            const SizedBox(height: 28),
                            TextFormField(
                              controller: _emailCtrl,
                              keyboardType: TextInputType.emailAddress,
                              decoration: const InputDecoration(
                                labelText: 'Student Email',
                                prefixIcon: Icon(Icons.alternate_email,
                                    size: 17, color: StudentTheme.textMuted),
                              ),
                              validator: (v) => v == null || v.isEmpty
                                  ? 'Required'
                                  : null,
                            ),
                            const SizedBox(height: 14),
                            TextFormField(
                              controller: _passCtrl,
                              obscureText: _obscure,
                              decoration: InputDecoration(
                                labelText: 'Password',
                                prefixIcon: const Icon(Icons.lock_outline,
                                    size: 17, color: StudentTheme.textMuted),
                                suffixIcon: IconButton(
                                  icon: Icon(
                                      _obscure
                                          ? Icons.visibility_outlined
                                          : Icons.visibility_off_outlined,
                                      size: 17,
                                      color: StudentTheme.textMuted),
                                  onPressed: () =>
                                      setState(() => _obscure = !_obscure),
                                ),
                              ),
                              validator: (v) => v == null || v.isEmpty
                                  ? 'Required'
                                  : null,
                            ),
                            if (_error != null) ...[
                              const SizedBox(height: 14),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: StudentTheme.errorRed.withOpacity(0.07),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                      color: StudentTheme.errorRed
                                          .withOpacity(0.3)),
                                ),
                                child: Row(children: [
                                  const Icon(Icons.block_rounded,
                                      color: StudentTheme.errorRed, size: 15),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(_error!,
                                        style: GoogleFonts.roboto(
                                            color: StudentTheme.errorRed,
                                            fontSize: 11)),
                                  ),
                                ]),
                              ),
                            ],
                            const SizedBox(height: 24),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: _loading ? null : _login,
                                child: _loading
                                    ? const SizedBox(
                                        height: 17,
                                        width: 17,
                                        child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            color: Colors.white))
                                    : const Text('Access Student Workspace'),
                              ),
                            ),
                            const SizedBox(height: 20),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: StudentTheme.steelBlue.withOpacity(0.06),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                    color:
                                        StudentTheme.steelBlue.withOpacity(0.2)),
                              ),
                              child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Demo Credentials',
                                        style: GoogleFonts.inter(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w600,
                                            color: StudentTheme.steelBlue)),
                                    const SizedBox(height: 4),
                                    Text('student@campus.edu / Student@2024',
                                        style: GoogleFonts.roboto(
                                            fontSize: 12,
                                            color: StudentTheme.textSecondary)),
                                  ]),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _row(IconData icon, String label) => Row(children: [
        Icon(icon, color: StudentTheme.accentCyan, size: 18),
        const SizedBox(width: 12),
        Text(label,
            style: GoogleFonts.inter(
                color: Colors.white70,
                fontSize: 13,
                fontWeight: FontWeight.w500)),
      ]);
}
