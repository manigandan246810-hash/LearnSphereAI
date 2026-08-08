import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class StudentTheme {
  StudentTheme._();

  static const Color navy = Color(0xFF003366);
  static const Color steelBlue = Color(0xFF0055AA);
  static const Color blueprintBg = Color(0xFFF0F5FF);
  
  static const Color accentCyan = Color(0xFF0099FF);
  static const Color accentIndigo = Color(0xFF5533FF);
  static const Color accentGold = Color(0xFFFFAA00);
  
  static const Color errorRed = Color(0xFFCC2200);
  static const Color successGreen = Color(0xFF00AA55);
  static const Color surfaceWhite = Color(0xFFFFFFFF);
  static const Color surfaceCard = Color(0xFFF8FBFF);
  static const Color borderLight = Color(0xFFDDE8F5);
  
  static const Color textPrimary = Color(0xFF0A1628);
  static const Color textSecondary = Color(0xFF4A6080);
  static const Color textMuted = Color(0xFF8AA0B8);

  static ThemeData get theme {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: steelBlue,
        brightness: Brightness.light,
        primary: steelBlue,
        onPrimary: Colors.white,
        secondary: accentCyan,
        surface: blueprintBg,
        error: errorRed,
      ),
      scaffoldBackgroundColor: blueprintBg,
      textTheme: GoogleFonts.interTextTheme().copyWith(
        displayLarge: GoogleFonts.inter(
            fontSize: 26, fontWeight: FontWeight.w700, color: navy),
        titleLarge: GoogleFonts.inter(
            fontSize: 17, fontWeight: FontWeight.w600, color: textPrimary),
        bodyLarge: GoogleFonts.roboto(
            fontSize: 14, color: textPrimary),
        bodyMedium: GoogleFonts.roboto(
            fontSize: 13, color: textSecondary),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: navy,
        foregroundColor: Colors.white,
        elevation: 0,
        titleTextStyle: GoogleFonts.inter(
            fontSize: 17, fontWeight: FontWeight.w600, color: Colors.white),
      ),
      cardTheme: CardThemeData(
        color: surfaceCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
          side: const BorderSide(color: borderLight, width: 1),
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: steelBlue,
          foregroundColor: Colors.white,
          elevation: 0,
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          textStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 13),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: surfaceWhite,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: borderLight),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: borderLight),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(8),
          borderSide: const BorderSide(color: steelBlue, width: 2),
        ),
        contentPadding:
            const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
      ),
    );
  }
}
