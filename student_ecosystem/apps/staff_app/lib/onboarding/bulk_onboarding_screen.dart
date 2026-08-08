import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:csv/csv.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:convert';
import 'package:shared_models/shared_models.dart';
import '../theme/staff_theme.dart';
import '../providers/staff_provider.dart';

class BulkOnboardingScreen extends StatefulWidget {
  const BulkOnboardingScreen({super.key});

  @override
  State<BulkOnboardingScreen> createState() => _BulkOnboardingScreenState();
}

class _BulkOnboardingScreenState extends State<BulkOnboardingScreen> {
  List<Student> _parsedStudents = [];
  bool _isParsed = false;
  bool _isOnboarded = false;
  String? _fileName;
  String? _errorMsg;

  Future<void> _pickAndParseFile() async {
    setState(() {
      _errorMsg = null;
      _parsedStudents = [];
      _isParsed = false;
      _isOnboarded = false;
    });

    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['csv'],
        withData: true,
      );

      if (result == null || result.files.isEmpty) return;

      final file = result.files.first;
      setState(() {
        _fileName = file.name;
      });

      String csvContent;
      if (file.bytes != null) {
        csvContent = utf8.decode(file.bytes!);
      } else {
        // Fallback for non-web environments if bytes is not filled
        _errorMsg = "Unable to read file content. Please try again.";
        return;
      }

      final List<List<dynamic>> rows = const CsvToListConverter(
        shouldParseNumbers: false,
      ).convert(csvContent);

      if (rows.length <= 1) {
        setState(() {
          _errorMsg = "CSV file is empty or does not contain a header row.";
        });
        return;
      }

      // Check header matches Name, Email, Roll Number
      final headers = rows.first.map((e) => e.toString().trim().toLowerCase()).toList();
      int nameIdx = headers.indexOf('name');
      int emailIdx = headers.indexOf('email');
      int rollIdx = headers.indexOf('roll number');
      if (rollIdx == -1) rollIdx = headers.indexOf('rollnumber');

      if (nameIdx == -1 || emailIdx == -1 || rollIdx == -1) {
        // Default to indices 0, 1, 2 if headers not matched
        nameIdx = 0;
        emailIdx = 1;
        rollIdx = 2;
      }

      final prov = context.read<StaffProvider>();
      final List<Student> students = [];
      
      for (int i = 1; i < rows.length; i++) {
        final row = rows[i];
        if (row.length < 3) continue; // Skip malformed rows
        
        final name = row[nameIdx].toString().trim();
        final email = row[emailIdx].toString().trim();
        final rollNumber = row[rollIdx].toString().trim();
        
        if (name.isEmpty || email.isEmpty || rollNumber.isEmpty) continue;

        final tempPass = prov.generateTempPassword();
        final dept = row.length > 3 ? row[3].toString().trim() : 'Computer Science';
        final sem = row.length > 4 ? (int.tryParse(row[4].toString().trim()) ?? 6) : 6;

        students.add(Student(
          id: 'st_${DateTime.now().millisecondsSinceEpoch}_$i',
          name: name,
          email: email,
          rollNumber: rollNumber,
          department: dept,
          semester: sem,
          tempPassword: tempPass,
          enrolledCourseIds: ['c1', 'c2'], // auto enroll in default courses
          attendancePercentage: 100.0,
        ));
      }

      if (students.isEmpty) {
        setState(() {
          _errorMsg = "No valid student records found in CSV. Expected headers: Name, Email, Roll Number";
        });
        return;
      }

      setState(() {
        _parsedStudents = students;
        _isParsed = true;
      });
    } catch (e) {
      setState(() {
        _errorMsg = "Error parsing CSV: ${e.toString()}";
      });
    }
  }

  void _submitOnboarding() {
    if (_parsedStudents.isEmpty) return;
    context.read<StaffProvider>().setOnboardedStudents(_parsedStudents);
    setState(() {
      _isOnboarded = true;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Successfully onboarded ${_parsedStudents.length} students.'),
        backgroundColor: StaffTheme.successGreen,
      ),
    );
  }

  void _downloadCredentialsSummary() {
    // Generate simple credentials report content
    final buffer = StringBuffer();
    buffer.writeln("Student Onboarding Credentials Report");
    buffer.writeln("Generated on: ${DateTime.now()}");
    buffer.writeln("File source: $_fileName");
    buffer.writeln("-" * 60);
    buffer.writeln("Name,Roll Number,Email,Temporary Password");
    for (final s in _parsedStudents) {
      buffer.writeln("${s.name},${s.rollNumber},${s.email},${s.tempPassword}");
    }

    // Since we are in a mock/desktop/web environment, we will present this in a dialog
    // where they can view and copy the output, pretending it's downloaded.
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: Colors.white,
          title: Row(
            children: [
              const Icon(Icons.download_done_rounded, color: StaffTheme.successGreen),
              const SizedBox(width: 10),
              Text('Credentials Generated Successfully',
                  style: GoogleFonts.inter(fontSize: 16, fontWeight: FontWeight.w700, color: StaffTheme.navy)),
            ],
          ),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('The credential summary file has been prepared. You can copy the generated credentials below:',
                  style: GoogleFonts.roboto(fontSize: 13, color: StaffTheme.textSecondary)),
              const SizedBox(height: 12),
              Container(
                width: 500,
                height: 250,
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: StaffTheme.blueprintBg,
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: StaffTheme.borderLight),
                ),
                child: SingleChildScrollView(
                  child: SelectableText(
                    buffer.toString(),
                    style: GoogleFonts.robotoMono(fontSize: 11, color: StaffTheme.textPrimary),
                  ),
                ),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text('Close', style: GoogleFonts.inter(fontWeight: FontWeight.w600, color: StaffTheme.steelBlue)),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      color: StaffTheme.blueprintBg,
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Onboarding Instruction Header Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: StaffTheme.borderLight),
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Bulk Onboard Students via CSV',
                          style: GoogleFonts.inter(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: StaffTheme.navy)),
                      const SizedBox(height: 4),
                      Text(
                          'Upload a CSV file containing student records. The system will parse rows, validate data structure, automatically generate unique student credentials, and enroll them in your active courses.',
                          style: GoogleFonts.roboto(
                              fontSize: 13, color: StaffTheme.textSecondary, height: 1.5)),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: StaffTheme.steelBlue.withOpacity(0.06),
                          borderRadius: BorderRadius.circular(6),
                          border: Border.all(color: StaffTheme.steelBlue.withOpacity(0.2)),
                        ),
                        child: Text(
                          'Expected CSV Schema: Name, Email, Roll Number [, Department, Semester]',
                          style: GoogleFonts.robotoMono(
                              fontSize: 11, color: StaffTheme.steelBlue, fontWeight: FontWeight.w600),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 24),
                ElevatedButton.icon(
                  onPressed: _pickAndParseFile,
                  icon: const Icon(Icons.upload_file_rounded, size: 16),
                  label: const Text('Select CSV File'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: StaffTheme.steelBlue,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Error box if any
          if (_errorMsg != null) ...[
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: StaffTheme.errorRed.withOpacity(0.08),
                borderRadius: BorderRadius.circular(8),
                border: Border.all(color: StaffTheme.errorRed.withOpacity(0.3)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.error_outline_rounded, color: StaffTheme.errorRed),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Text(
                      _errorMsg!,
                      style: GoogleFonts.roboto(color: StaffTheme.errorRed, fontSize: 13, fontWeight: FontWeight.w500),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
          ],

          // Preview and Action section
          if (_isParsed) ...[
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
                      child: Row(
                        children: [
                          Icon(
                            _isOnboarded ? Icons.check_circle_rounded : Icons.preview_rounded,
                            color: _isOnboarded ? StaffTheme.successGreen : StaffTheme.steelBlue,
                            size: 20,
                          ),
                          const SizedBox(width: 10),
                          Text(
                            _isOnboarded
                                ? 'Onboarded ${_parsedStudents.length} Students Successfully'
                                : 'Previewing Parsed Records (${_parsedStudents.length})',
                            style: GoogleFonts.inter(
                                fontSize: 14, fontWeight: FontWeight.w700, color: StaffTheme.textPrimary),
                          ),
                          const Spacer(),
                          if (!_isOnboarded)
                            ElevatedButton(
                              onPressed: _submitOnboarding,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: StaffTheme.successGreen,
                              ),
                              child: const Text('Confirm & Save Onboard List'),
                            )
                          else
                            ElevatedButton.icon(
                              onPressed: _downloadCredentialsSummary,
                              icon: const Icon(Icons.download_rounded, size: 16),
                              label: const Text('Download Credentials Summary'),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: StaffTheme.steelBlue,
                              ),
                            ),
                        ],
                      ),
                    ),
                    const Divider(height: 1, color: StaffTheme.borderLight),
                    Expanded(
                      child: SingleChildScrollView(
                        scrollDirection: Axis.vertical,
                        child: SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: DataTable(
                            headingTextStyle: GoogleFonts.inter(
                                fontSize: 11, fontWeight: FontWeight.w700, color: StaffTheme.textMuted),
                            dataTextStyle: GoogleFonts.roboto(fontSize: 13, color: StaffTheme.textPrimary),
                            columns: const [
                              DataColumn(label: Text('NAME')),
                              DataColumn(label: Text('ROLL NUMBER')),
                              DataColumn(label: Text('EMAIL')),
                              DataColumn(label: Text('DEPT')),
                              DataColumn(label: Text('SEM')),
                              DataColumn(label: Text('TEMP PASSWORD')),
                            ],
                            rows: _parsedStudents
                                .map((s) => DataRow(
                                      cells: [
                                        DataCell(Text(s.name,
                                            style: GoogleFonts.inter(fontWeight: FontWeight.w600))),
                                        DataCell(Text(s.rollNumber)),
                                        DataCell(Text(s.email)),
                                        DataCell(Text(s.department)),
                                        DataCell(Text(s.semester.toString())),
                                        DataCell(
                                          Text(
                                            s.tempPassword,
                                            style: GoogleFonts.robotoMono(
                                              fontWeight: FontWeight.w600,
                                              color: StaffTheme.steelBlue,
                                            ),
                                          ),
                                        ),
                                      ],
                                    ))
                                .toList(),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ] else ...[
            Expanded(
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.csv_rounded, size: 72, color: StaffTheme.textMuted.withOpacity(0.3)),
                    const SizedBox(height: 16),
                    Text('No CSV Selected',
                        style: GoogleFonts.inter(
                            fontSize: 15, fontWeight: FontWeight.w600, color: StaffTheme.textSecondary)),
                    const SizedBox(height: 6),
                    Text('Upload student lists to automatically create their portal access accounts.',
                        style: GoogleFonts.roboto(fontSize: 12, color: StaffTheme.textMuted)),
                  ],
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
