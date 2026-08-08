import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'theme/student_theme.dart';
import 'providers/student_provider.dart';
import 'auth/student_login_screen.dart';

void main() {
  runApp(const StudentApp());
}

class StudentApp extends StatelessWidget {
  const StudentApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => StudentProvider(),
      child: MaterialApp(
        title: 'Campus Learner',
        debugShowCheckedModeBanner: false,
        theme: StudentTheme.theme,
        home: const StudentLoginScreen(),
      ),
    );
  }
}
