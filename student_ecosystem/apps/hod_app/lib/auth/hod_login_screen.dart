import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:shared_models/shared_models.dart';
import '../theme/hod_theme.dart';
import '../dashboard/hod_dashboard_screen.dart';

class HodLoginScreen extends StatefulWidget {
  const HodLoginScreen({super.key});

  @override
  State<HodLoginScreen> createState() => _HodLoginScreenState();
}

class _HodLoginScreenState extends State<HodLoginScreen>
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
        vsync: this, duration: const Duration(milliseconds: 800));
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
    await Future.delayed(const Duration(milliseconds: 900));

    final email = _emailCtrl.text.trim();
    final pass = _passCtrl.text.trim();

    if (email == MockData.hodEmail && pass == MockData.hodPassword) {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const HodDashboardScreen()),
        );
      }
    } else {
      setState(() {
        _error = 'Invalid HOD credentials. Student or Staff credentials are not accepted in this portal.';
        _loading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: HodTheme.navy,
      body: Row(
        children: [
          // ── Left branding panel ──────────────────────────────────────────
          Expanded(
            flex: 5,
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF001A33), Color(0xFF003366)],
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
                            horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: HodTheme.accentGold.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(
                              color: HodTheme.accentGold.withOpacity(0.4)),
                        ),
                        child: Text('RESTRICTED ACCESS',
                            style: GoogleFonts.inter(
                              color: HodTheme.accentGold,
                              fontSize: 11,
                              fontWeight: FontWeight.w700,
                              letterSpacing: 2,
                            )),
                      ),
                      const SizedBox(height: 32),
                      Text('Academic\nAdmin Portal',
                          style: GoogleFonts.inter(
                            color: Colors.white,
                            fontSize: 42,
                            fontWeight: FontWeight.w700,
                            height: 1.1,
                          )),
                      const SizedBox(height: 16),
                      Text(
                        'Exclusive HOD Dashboard for departmental\noversight, CRUD management, attendance\naudit, and system-wide analytics.',
                        style: GoogleFonts.roboto(
                          color: Colors.white54,
                          fontSize: 14,
                          height: 1.7,
                        ),
                      ),
                      const SizedBox(height: 60),
                      _buildFeatureRow(Icons.admin_panel_settings_rounded,
                          'Executive Oversight'),
                      const SizedBox(height: 16),
                      _buildFeatureRow(
                          Icons.manage_accounts_rounded, 'Full CRUD Control'),
                      const SizedBox(height: 16),
                      _buildFeatureRow(
                          Icons.bar_chart_rounded, 'Daily Analytics Reports'),
                      const SizedBox(height: 16),
                      _buildFeatureRow(
                          Icons.fact_check_rounded, 'Attendance Auditing'),
                    ],
                  ),
                ),
              ),
            ),
          ),
          // ── Right login form ─────────────────────────────────────────────
          Expanded(
            flex: 4,
            child: Container(
              color: HodTheme.blueprintBg,
              child: FadeTransition(
                opacity: _fadeAnim,
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 400),
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
                                width: 44,
                                height: 44,
                                decoration: BoxDecoration(
                                  color: HodTheme.navy,
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(Icons.school_rounded,
                                    color: Colors.white, size: 24),
                              ),
                              const SizedBox(width: 14),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('HOD Portal',
                                      style: GoogleFonts.inter(
                                          fontSize: 18,
                                          fontWeight: FontWeight.w700,
                                          color: HodTheme.navy)),
                                  Text('Head of Department Login',
                                      style: GoogleFonts.roboto(
                                          fontSize: 12,
                                          color: HodTheme.textMuted)),
                                ],
                              ),
                            ]),
                            const SizedBox(height: 40),
                            Text('Sign In',
                                style: GoogleFonts.inter(
                                    fontSize: 26,
                                    fontWeight: FontWeight.w700,
                                    color: HodTheme.textPrimary)),
                            const SizedBox(height: 6),
                            Text(
                                'HOD credentials required. Other portal credentials will be rejected.',
                                style: GoogleFonts.roboto(
                                    fontSize: 12,
                                    color: HodTheme.textSecondary)),
                            const SizedBox(height: 32),
                            TextFormField(
                              controller: _emailCtrl,
                              keyboardType: TextInputType.emailAddress,
                              decoration: const InputDecoration(
                                labelText: 'HOD Email Address',
                                prefixIcon: Icon(Icons.alternate_email,
                                    size: 18, color: HodTheme.textMuted),
                              ),
                              validator: (v) =>
                                  v == null || v.isEmpty ? 'Email required' : null,
                            ),
                            const SizedBox(height: 16),
                            TextFormField(
                              controller: _passCtrl,
                              obscureText: _obscure,
                              decoration: InputDecoration(
                                labelText: 'Password',
                                prefixIcon: const Icon(Icons.lock_outline,
                                    size: 18, color: HodTheme.textMuted),
                                suffixIcon: IconButton(
                                  icon: Icon(
                                    _obscure
                                        ? Icons.visibility_outlined
                                        : Icons.visibility_off_outlined,
                                    size: 18,
                                    color: HodTheme.textMuted,
                                  ),
                                  onPressed: () =>
                                      setState(() => _obscure = !_obscure),
                                ),
                              ),
                              validator: (v) =>
                                  v == null || v.isEmpty ? 'Password required' : null,
                            ),
                            if (_error != null) ...[
                              const SizedBox(height: 16),
                              Container(
                                padding: const EdgeInsets.all(12),
                                decoration: BoxDecoration(
                                  color: HodTheme.errorRed.withOpacity(0.08),
                                  borderRadius: BorderRadius.circular(8),
                                  border: Border.all(
                                      color: HodTheme.errorRed.withOpacity(0.3)),
                                ),
                                child: Row(children: [
                                  const Icon(Icons.block_rounded,
                                      color: HodTheme.errorRed, size: 16),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(_error!,
                                        style: GoogleFonts.roboto(
                                            color: HodTheme.errorRed,
                                            fontSize: 12)),
                                  ),
                                ]),
                              ),
                            ],
                            const SizedBox(height: 28),
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                onPressed: _loading ? null : _login,
                                child: _loading
                                    ? const SizedBox(
                                        height: 18,
                                        width: 18,
                                        child: CircularProgressIndicator(
                                            strokeWidth: 2,
                                            color: Colors.white))
                                    : const Text('Access Admin Portal'),
                              ),
                            ),
                            const SizedBox(height: 24),
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: HodTheme.steelBlue.withOpacity(0.06),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(
                                    color: HodTheme.steelBlue.withOpacity(0.2)),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text('Demo Credentials',
                                      style: GoogleFonts.inter(
                                          fontSize: 11,
                                          fontWeight: FontWeight.w600,
                                          color: HodTheme.steelBlue)),
                                  const SizedBox(height: 4),
                                  Text('Email: hod@admin.edu',
                                      style: GoogleFonts.roboto(
                                          fontSize: 12,
                                          color: HodTheme.textSecondary)),
                                  Text('Password: HOD@2024',
                                      style: GoogleFonts.roboto(
                                          fontSize: 12,
                                          color: HodTheme.textSecondary)),
                                ],
                              ),
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

  Widget _buildFeatureRow(IconData icon, String label) {
    return Row(children: [
      Icon(icon, color: HodTheme.accentCyan, size: 20),
      const SizedBox(width: 12),
      Text(label,
          style: GoogleFonts.inter(
              color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w500)),
    ]);
  }
}
