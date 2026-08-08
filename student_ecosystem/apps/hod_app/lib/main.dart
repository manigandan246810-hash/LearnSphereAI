import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'theme/hod_theme.dart';
import 'auth/hod_login_screen.dart';
import 'providers/hod_provider.dart';

void main() {
  runApp(const HodApp());
}

class HodApp extends StatelessWidget {
  const HodApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => HodProvider()),
      ],
      child: MaterialApp(
        title: 'Academic Admin — HOD Portal',
        debugShowCheckedModeBanner: false,
        theme: HodTheme.theme,
        home: const HodLoginScreen(),
      ),
    );
  }
}
