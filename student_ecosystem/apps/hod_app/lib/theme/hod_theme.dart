import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class HodTheme {
  HodTheme._();

  // ─── Engineering Blue Palette ────────────────────────────────────────────
  static const Color navy = Color(0xFF003366);
  static const Color steelBlue = Color(0xFF0055AA);
  static const Color blueprintBg = Color(0xFFF0F5FF);
  static const Color accentCyan = Color(0xFF0099CC);
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
          fontSize: 28, fontWeight: FontWeight.w700, color: navy,
        ),
        displayMedium: GoogleFonts.inter(
          fontSize: 22, fontWeight: FontWeight.w600, color: navy,
        ),
        titleLarge: GoogleFonts.inter(
          fontSize: 18, fontWeight: FontWeight.w600, color: textPrimary,
        ),
        titleMedium: GoogleFonts.inter(
          fontSize: 15, fontWeight: FontWeight.w500, color: textPrimary,
        ),
        bodyLarge: GoogleFonts.roboto(
          fontSize: 14, fontWeight: FontWeight.w400, color: textPrimary,
        ),
        bodyMedium: GoogleFonts.roboto(
          fontSize: 13, fontWeight: FontWeight.w400, color: textSecondary,
        ),
        labelSmall: GoogleFonts.roboto(
          fontSize: 11, fontWeight: FontWeight.w500, color: textMuted,
          letterSpacing: 0.8,
        ),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: navy,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: false,
        titleTextStyle: GoogleFonts.inter(
          fontSize: 17, fontWeight: FontWeight.w600, color: Colors.white,
        ),
      ),
      cardTheme: CardThemeData(
        color: surfaceCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
          side: const BorderSide(color: borderLight, width: 1),
        ),
        margin: const EdgeInsets.all(0),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: steelBlue,
          foregroundColor: Colors.white,
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          textStyle: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
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
        labelStyle: GoogleFonts.inter(color: textSecondary, fontSize: 13),
        hintStyle: GoogleFonts.inter(color: textMuted, fontSize: 13),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      ),
    );
  }
}
