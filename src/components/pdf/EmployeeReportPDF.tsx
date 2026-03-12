import { Document, Page, View, Text, StyleSheet, Svg, Rect, G } from "@react-pdf/renderer";
import { RATING_LABELS, RATING_COLORS } from "@/lib/constants";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: "#111827", padding: 40, lineHeight: 1.4 },
  header: { marginBottom: 20, paddingBottom: 14, borderBottom: "1.5pt solid #e5e7eb" },
  headerTitle: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 4 },
  headerMeta: { fontSize: 9, color: "#6b7280" },
  headerGenerated: { fontSize: 8, color: "#9ca3af", marginTop: 4 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 10, paddingBottom: 4, borderBottom: "0.5pt solid #e5e7eb" },
  categoryHeader: { backgroundColor: "#f3f4f6", paddingVertical: 4, paddingHorizontal: 8, marginBottom: 2, borderRadius: 3 },
  categoryName: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#374151" },
  skillRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 8, borderBottom: "0.5pt solid #f3f4f6", alignItems: "center" },
  skillName: { width: 140, fontSize: 8.5, color: "#374151" },
  noRating: { fontSize: 8, color: "#9ca3af" },
  chartRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  chartLabel: { width: 110, fontSize: 8, color: "#374151", fontFamily: "Helvetica-Bold" },
  chartValue: { width: 60, fontSize: 8, color: "#6b7280", textAlign: "right" },
  legendRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 7.5, color: "#6b7280" },
  // Year notes
  yearCard: { marginBottom: 12, borderRadius: 4, border: "0.5pt solid #fed7aa", backgroundColor: "#fff7ed" },
  yearHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderBottom: "0.5pt solid #fed7aa" },
  yearLabel: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#c2410c" },
  yearMeta: { fontSize: 8, color: "#9ca3af" },
  yearNotes: { fontSize: 8.5, color: "#374151", paddingHorizontal: 10, paddingVertical: 8 },
  noNotes: { fontSize: 8, color: "#d1d5db", fontStyle: "italic", paddingHorizontal: 10, paddingVertical: 8 },
  empty: { fontSize: 8.5, color: "#9ca3af", fontStyle: "italic", paddingVertical: 6 },
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7.5, color: "#d1d5db" },
});

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function ratingColor(r: number) { return RATING_COLORS[r] ?? "#9ca3af"; }

function RatingBar({ rating, barWidth = 140 }: { rating: number | null; barWidth?: number }) {
  const BAR_H = 10;
  const filled = rating ? (rating / 5) * barWidth : 0;
  const color = rating ? ratingColor(rating) : "#e5e7eb";
  return (
    <Svg width={barWidth} height={BAR_H}>
      <G>
        <Rect x={0} y={0} width={barWidth} height={BAR_H} rx={3} ry={3} fill="#f3f4f6" />
        {filled > 0 && <Rect x={0} y={0} width={filled} height={BAR_H} rx={3} ry={3} fill={color} />}
        {[1, 2, 3, 4].map((t) => (
          <Rect key={t} x={(t / 5) * barWidth - 0.5} y={0} width={1} height={BAR_H} fill="white" opacity={0.5} />
        ))}
      </G>
    </Svg>
  );
}

function CategoryBar({ name, avg, barWidth = 260 }: { name: string; avg: number; barWidth?: number }) {
  const BAR_H = 14;
  const filled = (avg / 5) * barWidth;
  const level = Math.round(avg);
  const color = level >= 1 && level <= 5 ? ratingColor(level) : "#ea580c";
  const label = level >= 1 && level <= 5 ? RATING_LABELS[level] : "";
  return (
    <View style={styles.chartRow}>
      <Text style={styles.chartLabel}>{name}</Text>
      <View style={{ flex: 1 }}>
        <Svg width="100%" height={BAR_H} viewBox={`0 0 ${barWidth} ${BAR_H}`}>
          <G>
            <Rect x={0} y={0} width={barWidth} height={BAR_H} rx={3} ry={3} fill="#f3f4f6" />
            {filled > 0 && <Rect x={0} y={0} width={filled} height={BAR_H} rx={3} ry={3} fill={color} opacity={0.85} />}
            {[1, 2, 3, 4].map((t) => (
              <Rect key={t} x={(t / 5) * barWidth - 0.5} y={0} width={1} height={BAR_H} fill="white" opacity={0.6} />
            ))}
          </G>
        </Svg>
      </View>
      <Text style={styles.chartValue}>{avg.toFixed(1)}/5  {label}</Text>
    </View>
  );
}

export interface ReportData {
  employee: { name: string; role: string; team: string; startDate: string };
  categories: { id: string; name: string; skills: { id: string; name: string; latestRating: number | null }[] }[];
  yearNotes: { yearLabel: string; notes: string; meetingCount: number }[];
  generatedAt: string;
}

export default function EmployeeReportPDF({ data }: { data: ReportData }) {
  const { employee, categories, yearNotes, generatedAt } = data;

  const categoryAverages = categories.map((cat) => {
    const rated = cat.skills.filter((s) => s.latestRating !== null);
    const avg = rated.length > 0 ? rated.reduce((sum, s) => sum + (s.latestRating ?? 0), 0) / rated.length : 0;
    return { id: cat.id, name: cat.name, avg, ratedCount: rated.length };
  }).filter((c) => c.ratedCount > 0);

  return (
    <Document title={`${employee.name} — Skill Report`} author="SkillTracker">
      {/* Page 1: Header + Charts + Skill Matrix */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{employee.name}</Text>
          <Text style={styles.headerMeta}>
            {employee.role}  ·  {employee.team}  ·  Since {formatDate(employee.startDate)}
          </Text>
          <Text style={styles.headerGenerated}>Report generated on {formatDate(generatedAt)}</Text>
        </View>

        {/* Category Overview Chart */}
        {categoryAverages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skill Overview by Category</Text>
            {categoryAverages.map((cat) => (
              <CategoryBar key={cat.id} name={cat.name} avg={cat.avg} />
            ))}
            <View style={styles.legendRow}>
              {[1, 2, 3, 4, 5].map((r) => (
                <View key={r} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: ratingColor(r) }]} />
                  <Text style={styles.legendText}>{r} – {RATING_LABELS[r]}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Skill Matrix */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skill Matrix</Text>
          {categories.length === 0 ? (
            <Text style={styles.empty}>No skill categories assigned.</Text>
          ) : (
            categories.map((cat) => (
              <View key={cat.id} style={{ marginBottom: 8 }}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                </View>
                {cat.skills.map((skill) => {
                  const r = skill.latestRating;
                  return (
                    <View key={skill.id} style={styles.skillRow}>
                      <Text style={styles.skillName}>{skill.name}</Text>
                      <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
                        <RatingBar rating={r} barWidth={140} />
                        {r ? (
                          <Text style={{ fontSize: 8, color: ratingColor(r), fontFamily: "Helvetica-Bold", width: 70 }}>
                            {r}/5  {RATING_LABELS[r]}
                          </Text>
                        ) : (
                          <Text style={styles.noRating}>Not rated</Text>
                        )}
                      </View>
                    </View>
                  );
                })}
              </View>
            ))
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>SkillTracker — Confidential</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* Page 2: Year-wise Annual Notes */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Annual Review Notes (Fiscal Year: April – March)</Text>
          {yearNotes.length === 0 ? (
            <Text style={styles.empty}>No annual notes recorded yet.</Text>
          ) : (
            yearNotes.map((yn) => (
              <View key={yn.yearLabel} style={styles.yearCard}>
                <View style={styles.yearHeader}>
                  <Text style={styles.yearLabel}>FY {yn.yearLabel}</Text>
                  <Text style={styles.yearMeta}>{yn.meetingCount} 1:1 meeting{yn.meetingCount !== 1 ? "s" : ""} this year</Text>
                </View>
                {yn.notes
                  ? <Text style={styles.yearNotes}>{yn.notes}</Text>
                  : <Text style={styles.noNotes}>No annual notes added for this year.</Text>}
              </View>
            ))
          )}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>SkillTracker — Confidential</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
