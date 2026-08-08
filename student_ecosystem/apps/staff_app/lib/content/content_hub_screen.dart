import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:file_picker/file_picker.dart';
import 'package:shared_models/shared_models.dart';
import '../theme/staff_theme.dart';
import '../providers/staff_provider.dart';

class ContentHubScreen extends StatefulWidget {
  const ContentHubScreen({super.key});

  @override
  State<ContentHubScreen> createState() => _ContentHubScreenState();
}

class _ContentHubScreenState extends State<ContentHubScreen> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _urlCtrl = TextEditingController();
  Course? _selectedCourse;
  String _contentType = 'video'; // 'video' | 'pdf' | 'notes'
  String? _pickedFileName;
  bool _uploading = false;
  bool _initialized = false;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _urlCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickFile() async {
    try {
      FilePickerResult? result = await FilePicker.platform.pickFiles(
        type: _contentType == 'video' ? FileType.video : FileType.custom,
        allowedExtensions: _contentType == 'video' ? null : ['pdf', 'doc', 'docx', 'ppt', 'pptx'],
      );

      if (result != null && result.files.isNotEmpty) {
        setState(() {
          _pickedFileName = result.files.first.name;
          // Set a simulated URL based on file name
          _urlCtrl.text = 'https://campus.edu/files/uploads/$_pickedFileName';
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('File picker failed: $e'), backgroundColor: StaffTheme.errorRed),
      );
    }
  }

  void _publishModule(StaffProvider prov) async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedCourse == null) return;

    setState(() { _uploading = true; });
    // Simulate minor network delay
    await Future.delayed(const Duration(milliseconds: 600));

    final newModule = CourseModule(
      id: 'mod_${DateTime.now().millisecondsSinceEpoch}',
      title: _titleCtrl.text.trim(),
      type: _contentType,
      url: _urlCtrl.text.trim(),
      uploadedAt: DateTime.now(),
    );

    prov.addCourseModule(_selectedCourse!.id, newModule);

    setState(() {
      _titleCtrl.clear();
      _urlCtrl.clear();
      _pickedFileName = null;
      _uploading = false;
    });

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Content published successfully to ${_selectedCourse!.code}!'),
          backgroundColor: StaffTheme.successGreen,
        ),
      );
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

    // Refresh course modules from provider state
    final courseInProvider = prov.myCourses.firstWhere((c) => c.id == _selectedCourse?.id);

    return Container(
      color: StaffTheme.blueprintBg,
      padding: const EdgeInsets.all(24),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Left form panel (Upload Content)
          Expanded(
            flex: 5,
            child: Container(
              padding: const EdgeInsets.all(24),
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
                    Text('Publish Study Material',
                        style: GoogleFonts.inter(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: StaffTheme.navy)),
                    const SizedBox(height: 4),
                    Text('Publish lecture notes, PDFs, or educational videos to your course workspace.',
                        style: GoogleFonts.roboto(fontSize: 12, color: StaffTheme.textSecondary)),
                    const Divider(height: 32, color: StaffTheme.borderLight),

                    // Select Course dropdown
                    Text('Target Course',
                        style: GoogleFonts.inter(
                            fontSize: 12, fontWeight: FontWeight.w600, color: StaffTheme.textPrimary)),
                    const SizedBox(height: 6),
                    DropdownButtonFormField<Course>(
                      value: _selectedCourse,
                      decoration: const InputDecoration(
                        contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                      items: courses
                          .map((c) => DropdownMenuItem(
                                value: c,
                                child: Text('${c.code} — ${c.title}', style: GoogleFonts.inter(fontSize: 13)),
                              ))
                          .toList(),
                      onChanged: (val) {
                        setState(() {
                          _selectedCourse = val;
                        });
                      },
                    ),
                    const SizedBox(height: 18),

                    // Material Title
                    Text('Content Title',
                        style: GoogleFonts.inter(
                            fontSize: 12, fontWeight: FontWeight.w600, color: StaffTheme.textPrimary)),
                    const SizedBox(height: 6),
                    TextFormField(
                      controller: _titleCtrl,
                      decoration: const InputDecoration(
                        hintText: 'e.g. Lecture 4: Balanced Binary Search Trees',
                      ),
                      validator: (v) => v == null || v.isEmpty ? 'Please enter a title' : null,
                    ),
                    const SizedBox(height: 18),

                    // Content Type Toggle
                    Text('Content Type',
                        style: GoogleFonts.inter(
                            fontSize: 12, fontWeight: FontWeight.w600, color: StaffTheme.textPrimary)),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        _typeBtn('video', Icons.video_library_rounded, 'Video Lecture'),
                        const SizedBox(width: 8),
                        _typeBtn('pdf', Icons.picture_as_pdf_rounded, 'PDF Document'),
                        const SizedBox(width: 8),
                        _typeBtn('notes', Icons.sticky_note_2_rounded, 'Study Notes'),
                      ],
                    ),
                    const SizedBox(height: 18),

                    // File picker simulator
                    Text('Upload Material Source',
                        style: GoogleFonts.inter(
                            fontSize: 12, fontWeight: FontWeight.w600, color: StaffTheme.textPrimary)),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        Expanded(
                          child: TextFormField(
                            controller: _urlCtrl,
                            decoration: const InputDecoration(
                              hintText: 'Resource URL or local path...',
                            ),
                            validator: (v) => v == null || v.isEmpty ? 'Provide a file or link' : null,
                          ),
                        ),
                        const SizedBox(width: 10),
                        ElevatedButton.icon(
                          onPressed: _pickFile,
                          icon: const Icon(Icons.attach_file_rounded, size: 16),
                          label: const Text('Browse'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: StaffTheme.steelBlue.withOpacity(0.1),
                            foregroundColor: StaffTheme.steelBlue,
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          ),
                        ),
                      ],
                    ),
                    if (_pickedFileName != null) ...[
                      const SizedBox(height: 6),
                      Text('Selected: $_pickedFileName',
                          style: GoogleFonts.robotoMono(fontSize: 11, color: StaffTheme.successGreen, fontWeight: FontWeight.w600)),
                    ],
                    const Spacer(),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        onPressed: _uploading ? null : () => _publishModule(prov),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: StaffTheme.steelBlue,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                        ),
                        child: _uploading
                            ? const SizedBox(
                                height: 16,
                                width: 16,
                                child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                              )
                            : const Text('Publish to Course Hub'),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          const SizedBox(width: 20),

          // Right live curriculum list (Curriculum Feed)
          Expanded(
            flex: 5,
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
                    padding: const EdgeInsets.all(20),
                    child: Text(
                      'Published Materials — ${courseInProvider.code}',
                      style: GoogleFonts.inter(
                          fontSize: 14, fontWeight: FontWeight.w700, color: StaffTheme.textPrimary),
                    ),
                  ),
                  const Divider(height: 1, color: StaffTheme.borderLight),
                  Expanded(
                    child: courseInProvider.modules.isEmpty
                        ? Center(
                            child: Text(
                              'No study material uploaded yet for this course.',
                              style: GoogleFonts.roboto(fontSize: 12, color: StaffTheme.textMuted),
                            ),
                          )
                        : ListView.builder(
                            padding: const EdgeInsets.all(12),
                            itemCount: courseInProvider.modules.length,
                            itemBuilder: (context, idx) {
                              final m = courseInProvider.modules[idx];
                              IconData icon = Icons.video_library_rounded;
                              Color iconColor = StaffTheme.steelBlue;
                              if (m.type == 'pdf') {
                                icon = Icons.picture_as_pdf_rounded;
                                iconColor = StaffTheme.errorRed;
                              } else if (m.type == 'notes') {
                                icon = Icons.sticky_note_2_rounded;
                                iconColor = StaffTheme.accentGold;
                              }

                              return Card(
                                margin: const EdgeInsets.only(bottom: 8),
                                color: StaffTheme.surfaceCard,
                                child: ListTile(
                                  leading: CircleAvatar(
                                    backgroundColor: iconColor.withOpacity(0.1),
                                    child: Icon(icon, color: iconColor, size: 18),
                                  ),
                                  title: Text(m.title,
                                      style: GoogleFonts.inter(
                                          fontSize: 13,
                                          fontWeight: FontWeight.w600,
                                          color: StaffTheme.textPrimary)),
                                  subtitle: Text(m.url,
                                      style: GoogleFonts.robotoMono(
                                          fontSize: 10, color: StaffTheme.textMuted),
                                      overflow: TextOverflow.ellipsis),
                                  trailing: IconButton(
                                    icon: const Icon(Icons.open_in_new_rounded, size: 16, color: StaffTheme.textMuted),
                                    onPressed: () {
                                      // Simulating launch url
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(content: Text('Opening resource: ${m.url}')),
                                      );
                                    },
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

  Widget _typeBtn(String type, IconData icon, String label) {
    final isSelected = _contentType == type;
    return Expanded(
      child: InkWell(
        onTap: () {
          setState(() {
            _contentType = type;
            _pickedFileName = null;
            _urlCtrl.clear();
          });
        },
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected ? StaffTheme.steelBlue.withOpacity(0.1) : Colors.transparent,
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: isSelected ? StaffTheme.steelBlue : StaffTheme.borderLight),
          ),
          child: Column(
            children: [
              Icon(icon, color: isSelected ? StaffTheme.steelBlue : StaffTheme.textMuted, size: 18),
              const SizedBox(height: 4),
              Text(
                label,
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                  color: isSelected ? StaffTheme.steelBlue : StaffTheme.textSecondary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
