import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_models/shared_models.dart';
import '../theme/staff_theme.dart';
import '../dashboard/staff_dashboard_screen.dart';

class StaffLoginScreen extends StatefulWidget {
  const StaffLoginScreen({super.key});

  @override
  State<StaffLoginScreen> createState() => _StaffLoginScreenState();
}

class _StaffLoginScreenState extends State<StaffLoginScreen>
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

    if (_emailCtrl.text.trim() == MockData.staffEmail &&
        _passCtrl.text.trim() == MockData.staffPassword) {
      if (mounted) {
        Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => const StaffDashboardScreen()));
      }
    } else {
      setState(() {
        _error = 'Invalid faculty credentials. HOD or student credentials are not accepted in this portal.';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: StaffTheme.navy,
      body: Row(
        children: [
          // Left panel
          Expanded(
            flex: 5,
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF001A33), Color(0xFF003355)],
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
                          color: StaffTheme.accentTeal.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                              color: StaffTheme.accentTeal.withOpacity(0.4)),
                        ),
                        child: Text('FACULTY PORTAL',
                            style: GoogleFonts.inter(
                                color: StaffTheme.accentTeal,
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                letterSpacing: 2)),
                      ),
                      const SizedBox(height: 28),
                      Text('Faculty\nWorkspace',
                          style: GoogleFonts.inter(
                              color: Colors.white,
                              fontSize: 42,
                              fontWeight: FontWeight.w700,
                              height: 1.1)),
                      const SizedBox(height: 16),
                      Text(
                          'Powerful classroom tools for teachers.\nBulk onboarding, attendance, assessments.',
                          style: GoogleFonts.roboto(
                              color: Colors.white54, fontSize: 14, height: 1.7)),
                      const SizedBox(height: 52),
                      _row(Icons.upload_file_rounded, 'CSV Bulk Student Onboarding'),
                      const SizedBox(height: 14),
                      _row(Icons.fact_check_rounded, 'One-Tap Attendance Manager'),
                      const SizedBox(height: 14),
                      _row(Icons.video_library_rounded, 'Content Hub — Video & Notes'),
                      const SizedBox(height: 14),
                      _row(Icons.quiz_rounded, 'MCQ Test Builder & Scoreboard'),
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
              color: StaffTheme.blueprintBg,
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
                                  color: StaffTheme.steelBlue,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(Icons.school_rounded,
                                    color: Colors.white, size: 22),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Staff Portal',
                                      style: GoogleFonts.inter(
                                          fontSize: 17,
                                          fontWeight: FontWeight.w700,
                                          color: StaffTheme.navy)),
                                  Text('Faculty Workspace Login',
                                      style: GoogleFonts.roboto(
                                          fontSize: 11,
                                          color: StaffTheme.textMuted)),
                                ],
                              ),
                            ]),
                            const SizedBox(height: 36),
                            Text('Faculty Sign In',
                                style: GoogleFonts.inter(
                                    fontSize: 24,
                                    fontWeight: FontWeight.w700,
                                    color: StaffTheme.textPrimary)),
                            const SizedBox(height: 6),
                            Text(
                                'Faculty credentials required. Student and HOD logins are not permitted here.',
                                style: GoogleFonts.roboto(
                                    fontSize: 11,
                                    color: StaffTheme.textSecondary)),
                            const SizedBox(height: 28),
                            TextFormField(
                              controller: _emailCtrl,
                              keyboardType: TextInputType.emailAddress,
                              decoration: const InputDecoration(
                                labelText: 'Faculty Email',
                                prefixIcon: Icon(Icons.alternate_email,
                                    size: 17, color: StaffTheme.textMuted),
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
                                    size: 17, color: StaffTheme.textMuted),
                                suffixIcon: IconButton(
                                  icon: Icon(
                                      _obscure
                                          ? Icons.visibility_outlined
                                          : Icons.visibility_off_outlined,
                                      size: 17,
                                      color: StaffTheme.textMuted),
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
                                  color: StaffTheme.errorRed.withOpacity(0.07),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                      color: StaffTheme.errorRed
                                          .withOpacity(0.3)),
                                ),
                                child: Row(children: [
                                  const Icon(Icons.block_rounded,
                                      color: StaffTheme.errorRed, size: 15),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(_error!,
                                        style: GoogleFonts.roboto(
                                            color: StaffTheme.errorRed,
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
                                    : const Text('Access Faculty Portal'),
                              ),
                            ),
                            const SizedBox(height: 20),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: StaffTheme.steelBlue.withOpacity(0.06),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                    color:
                                        StaffTheme.steelBlue.withOpacity(0.2)),
                              ),
                              child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text('Demo Credentials',
                                        style: GoogleFonts.inter(
                                            fontSize: 11,
                                            fontWeight: FontWeight.w600,
                                            color: StaffTheme.steelBlue)),
                                    const SizedBox(height: 4),
                                    Text('staff@faculty.edu / Staff@2024',
                                        style: GoogleFonts.roboto(
                                            fontSize: 12,
                                            color: StaffTheme.textSecondary)),
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
        Icon(icon, color: StaffTheme.accentTeal, size: 18),
        const SizedBox(width: 12),
        Text(label,
            style: GoogleFonts.inter(
                color: Colors.white70,
                fontSize: 13,
                fontWeight: FontWeight.w500)),
      ]);
}
