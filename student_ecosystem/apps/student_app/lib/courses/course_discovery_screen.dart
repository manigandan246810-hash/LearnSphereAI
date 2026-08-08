import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:shared_models/shared_models.dart';
import '../theme/student_theme.dart';
import '../providers/student_provider.dart';

class CourseDiscoveryScreen extends StatelessWidget {
  const CourseDiscoveryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final prov = context.watch<StudentProvider>();
    final catalog = prov.filteredCatalog;
    final tags = prov.allUniqueTags;
    final enrolledIds = prov.enrolledCourses.map((c) => c.id).toSet();

    return Container(
      color: StudentTheme.blueprintBg,
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Filter Tags Chip panel
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(10),
              border: Border.all(color: StudentTheme.borderLight),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    const Icon(Icons.tune_rounded, color: StudentTheme.steelBlue, size: 18),
                    const SizedBox(width: 8),
                    Text('Filter Catalog by Domain Tags',
                        style: GoogleFonts.inter(
                            fontSize: 12, fontWeight: FontWeight.w700, color: StudentTheme.navy)),
                    if (prov.selectedTags.isNotEmpty || prov.searchQuery.isNotEmpty) ...[
                      const Spacer(),
                      TextButton(
                        onPressed: prov.clearFilters,
                        child: Text('Reset Filters',
                            style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: StudentTheme.errorRed)),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 10),
                Wrap(
                  spacing: 8,
                  runSpacing: 8,
                  children: tags.map((t) {
                    final isSel = prov.selectedTags.contains(t);
                    return ChoiceChip(
                      label: Text(t, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600)),
                      selected: isSel,
                      selectedColor: StudentTheme.steelBlue.withOpacity(0.15),
                      checkmarkColor: StudentTheme.steelBlue,
                      labelStyle: TextStyle(
                        color: isSel ? StudentTheme.steelBlue : StudentTheme.textSecondary,
                      ),
                      backgroundColor: StudentTheme.surfaceCard,
                      side: BorderSide(color: isSel ? StudentTheme.steelBlue : StudentTheme.borderLight),
                      onSelected: (_) => prov.toggleTag(t),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),

          // Course Catalog Grid
          Expanded(
            child: catalog.isEmpty
                ? Center(
                    child: Text('No courses found matching criteria.',
                        style: GoogleFonts.roboto(fontSize: 13, color: StudentTheme.textMuted)),
                  )
                : GridView.builder(
                    gridDelegate: const SliverGridDelegateWithMaxCrossAxisExtent(
                      maxCrossAxisExtent: 380,
                      mainAxisExtent: 220,
                      crossAxisSpacing: 16,
                      mainAxisSpacing: 16,
                    ),
                    itemCount: catalog.length,
                    itemBuilder: (context, idx) {
                      final c = catalog[idx];
                      final isEnrolled = enrolledIds.contains(c.id);

                      return Container(
                        padding: const EdgeInsets.all(18),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: StudentTheme.borderLight),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: StudentTheme.steelBlue.withOpacity(0.1),
                                    borderRadius: BorderRadius.circular(4),
                                  ),
                                  child: Text(
                                    c.code,
                                    style: GoogleFonts.inter(
                                        fontSize: 10,
                                        fontWeight: FontWeight.w700,
                                        color: StudentTheme.steelBlue),
                                  ),
                                ),
                                const SizedBox(width: 8),
                                Text(
                                  '${c.credits} Credits',
                                  style: GoogleFonts.roboto(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w500,
                                      color: StudentTheme.textSecondary),
                                ),
                                const Spacer(),
                                if (isEnrolled)
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                    decoration: BoxDecoration(
                                      color: StudentTheme.successGreen.withOpacity(0.12),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: Text(
                                      'ENROLLED',
                                      style: GoogleFonts.inter(
                                          color: StudentTheme.successGreen,
                                          fontSize: 9,
                                          fontWeight: FontWeight.w800,
                                          letterSpacing: 0.5),
                                    ),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              c.title,
                              style: GoogleFonts.inter(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w700,
                                  color: StudentTheme.textPrimary),
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              'Instructed by ${c.staffName}',
                              style: GoogleFonts.roboto(
                                  fontSize: 11,
                                  color: StudentTheme.textSecondary),
                            ),
                            const SizedBox(height: 8),
                            Expanded(
                              child: Text(
                                c.description,
                                style: GoogleFonts.roboto(
                                    fontSize: 12,
                                    color: StudentTheme.textSecondary,
                                    height: 1.4),
                                maxLines: 3,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                            const SizedBox(height: 12),
                            Row(
                              children: [
                                Expanded(
                                  child: Wrap(
                                    spacing: 4,
                                    children: c.tags.take(2).map((t) {
                                      return Container(
                                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                        decoration: BoxDecoration(
                                          color: StudentTheme.blueprintBg,
                                          borderRadius: BorderRadius.circular(4),
                                        ),
                                        child: Text(
                                          t,
                                          style: GoogleFonts.inter(
                                              color: StudentTheme.textSecondary,
                                              fontSize: 9,
                                              fontWeight: FontWeight.w500),
                                        ),
                                      );
                                    }).toList(),
                                  ),
                                ),
                                if (!isEnrolled)
                                  ElevatedButton(
                                    onPressed: () {
                                      prov.enrollInCourse(c.id);
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          content: Text('Successfully enrolled in ${c.title}!'),
                                          backgroundColor: StudentTheme.successGreen,
                                        ),
                                      );
                                    },
                                    style: ElevatedButton.styleFrom(
                                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                                      backgroundColor: StudentTheme.steelBlue,
                                      minimumSize: Size.zero,
                                    ),
                                    child: Text(
                                      'Enroll',
                                      style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600),
                                    ),
                                  ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
