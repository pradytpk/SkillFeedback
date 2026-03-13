import { Document, Page, View, Text, StyleSheet, Svg, Rect, G } from "@react-pdf/renderer";
import { RATING_LABELS, RATING_COLORS } from "@/lib/constants";

const RATING_SCALE = [
  { code: "S", label: "Exceptional", desc: "Significantly exceeded all expectations" },
  { code: "A", label: "Exceeds", desc: "Consistently above expectations" },
  { code: "B", label: "Meets", desc: "Fully meets expectations" },
  { code: "C", label: "Developing", desc: "Partially meets expectations" },
  { code: "D", label: "Below", desc: "Not meeting expectations" },
];

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: "#111827", padding: 40, lineHeight: 1.4 },
  header: { marginBottom: 20, paddingBottom: 14, borderBottom: "1.5pt solid #e5e7eb" },
  headerTitle: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 4 },
  headerMeta: { fontSize: 9, color: "#6b7280" },
  headerGenerated: { fontSize: 8, color: "#9ca3af", marginTop: 4 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 10, paddingBottom: 4, borderBottom: "0.5pt solid #e5e7eb" },
  // Skills
  categoryHeader: { backgroundColor: "#f3f4f6", paddingVertical: 4, paddingHorizontal: 8, marginBottom: 2, borderRadius: 3 },
  categoryName: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#374151" },
  skillRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 8, borderBottom: "0.5pt solid #f3f4f6", alignItems: "center" },
  skillName: { width: 140, fontSize: 8.5, color: "#374151" },
  noRating: { fontSize: 8, color: "#9ca3af" },
  chartRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  chartLabel: { width: 110, fontSize: 8, color: "#374151", fontFamily: "Helvetica-Bold" },
  chartValue: { width: 60, fontSize: 8, color: "#6b7280", textAlign: "right" },
  // Goals
  goalCard: { marginBottom: 8, borderRadius: 4, border: "0.5pt solid #e5e7eb", padding: 8 },
  goalTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 3 },
  goalMeta: { fontSize: 8, color: "#6b7280", marginBottom: 3 },
  goalProgress: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 2 },
  fyHeader: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#c2410c", marginBottom: 6, marginTop: 4 },
  // Appraisal
  appraisalCard: { border: "0.5pt solid #fed7aa", backgroundColor: "#fff7ed", borderRadius: 4, marginBottom: 16 },
  appraisalHeader: { paddingHorizontal: 10, paddingVertical: 7, borderBottom: "0.5pt solid #fed7aa", flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  appraisalFY: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#c2410c" },
  appraisalRatingBadge: { flexDirection: "row", alignItems: "center", gap: 6 },
  appraisalRatingCode: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#9a3412" },
  appraisalRatingLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#9a3412" },
  appraisalRatingDesc: { fontSize: 8, color: "#c2410c" },
  appraisalBody: { paddingHorizontal: 10, paddingVertical: 8 },
  appraisalField: { marginBottom: 8 },
  appraisalLabel: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#6b7280", marginBottom: 2, textTransform: "uppercase" },
  appraisalText: { fontSize: 9, color: "#111827" },
  talentBadge: { fontSize: 8, color: "#374151", marginTop: 4 },
  // Rating scale legend
  ratingLegendBox: { border: "0.5pt solid #e5e7eb", borderRadius: 4, marginBottom: 16, padding: 8, backgroundColor: "#f9fafb" },
  ratingLegendTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#6b7280", marginBottom: 6, textTransform: "uppercase" },
  ratingLegendRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
  ratingLegendCode: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#9a3412", width: 16 },
  ratingLegendLabel: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: "#111827", width: 80 },
  ratingLegendDesc: { fontSize: 8.5, color: "#6b7280", flex: 1 },
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

function ProgressBar({ pct, barWidth = 200 }: { pct: number; barWidth?: number }) {
  const BAR_H = 8;
  const filled = (pct / 100) * barWidth;
  return (
    <Svg width={barWidth} height={BAR_H}>
      <G>
        <Rect x={0} y={0} width={barWidth} height={BAR_H} rx={3} ry={3} fill="#f3f4f6" />
        {filled > 0 && <Rect x={0} y={0} width={filled} height={BAR_H} rx={3} ry={3} fill="#ea580c" opacity={0.8} />}
      </G>
    </Svg>
  );
}

function CategoryBar({ name, avg, barWidth = 260 }: { name: string; avg: number; barWidth?: number }) {
  const BAR_H = 14;
  const filled = (avg / 5) * barWidth;
  const level = Math.round(avg);
  const color = level >= 1 && level <= 5 ? ratingColor(level) : "#ea580c";
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
      <Text style={styles.chartValue}>{avg.toFixed(1)}/5</Text>
    </View>
  );
}

function RatingScaleLegend() {
  return (
    <View style={styles.ratingLegendBox}>
      <Text style={styles.ratingLegendTitle}>Overall Rating Scale</Text>
      {RATING_SCALE.map((item) => (
        <View key={item.code} style={styles.ratingLegendRow}>
          <Text style={styles.ratingLegendCode}>{item.code}</Text>
          <Text style={styles.ratingLegendLabel}>{item.label}</Text>
          <Text style={styles.ratingLegendDesc}>{item.desc}</Text>
        </View>
      ))}
    </View>
  );
}

export interface AppraisalReportData {
  employee: { name: string; role: string; team: string; startDate: string };
  categories: { id: string; name: string; skills: { id: string; name: string; latestRating: number | null }[] }[];
  goalsByFY: { fiscalYear: string; goals: { id: string; title: string; status: string; progressPct: number; quarter: string | null; weight: number }[] }[];
  appraisalRecords: { fiscalYear: string; overallRating: string | null; talentBoxPerf: string | null; talentBoxPot: string | null; achievements: string | null; strengths: string | null; developAreas: string | null; devPlanNextYear: string | null; peerFeedbackNotes: string | null }[];
  generatedAt: string;
}

export default function AppraisalReportPDF({ data }: { data: AppraisalReportData }) {
  const { employee, categories, goalsByFY, appraisalRecords, generatedAt } = data;

  const categoryAverages = categories.map((cat) => {
    const rated = cat.skills.filter((s) => s.latestRating !== null);
    const avg = rated.length > 0 ? rated.reduce((sum, s) => sum + (s.latestRating ?? 0), 0) / rated.length : 0;
    return { id: cat.id, name: cat.name, avg, ratedCount: rated.length };
  }).filter((c) => c.ratedCount > 0);

  const pageHeader = (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{employee.name}</Text>
      <Text style={styles.headerMeta}>{employee.role}  ·  {employee.team}  ·  Since {formatDate(employee.startDate)}</Text>
      <Text style={styles.headerGenerated}>Appraisal Report generated on {formatDate(generatedAt)}</Text>
    </View>
  );

  const pageFooter = (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>SkillTracker — Appraisal Report — Confidential</Text>
      <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  );

  return (
    <Document title={`${employee.name} — Appraisal Report`} author="SkillTracker">

      {/* Page 1: Appraisal Records */}
      <Page size="A4" style={styles.page}>
        {pageHeader}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appraisal Records</Text>
          <RatingScaleLegend />
          {appraisalRecords.length === 0 ? (
            <Text style={styles.empty}>No appraisal records yet.</Text>
          ) : (
            appraisalRecords.map((r) => {
              const ratingMeta = RATING_SCALE.find((s) => s.code === r.overallRating);
              return (
                <View key={r.fiscalYear} style={styles.appraisalCard}>
                  <View style={styles.appraisalHeader}>
                    <Text style={styles.appraisalFY}>FY {r.fiscalYear}</Text>
                    <View style={styles.appraisalRatingBadge}>
                      {r.overallRating && (
                        <View style={{ alignItems: "flex-end" }}>
                          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                            <Text style={styles.appraisalRatingCode}>{r.overallRating}</Text>
                            {ratingMeta && <Text style={styles.appraisalRatingLabel}>{ratingMeta.label}</Text>}
                          </View>
                          {ratingMeta && <Text style={styles.appraisalRatingDesc}>{ratingMeta.desc}</Text>}
                        </View>
                      )}
                      {r.talentBoxPerf && r.talentBoxPot && (
                        <Text style={styles.talentBadge}>{r.talentBoxPerf} Perf / {r.talentBoxPot} Pot</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.appraisalBody}>
                    {r.achievements && (
                      <View style={styles.appraisalField}>
                        <Text style={styles.appraisalLabel}>Achievements</Text>
                        <Text style={styles.appraisalText}>{r.achievements}</Text>
                      </View>
                    )}
                    {r.strengths && (
                      <View style={styles.appraisalField}>
                        <Text style={styles.appraisalLabel}>Strengths</Text>
                        <Text style={styles.appraisalText}>{r.strengths}</Text>
                      </View>
                    )}
                    {r.developAreas && (
                      <View style={styles.appraisalField}>
                        <Text style={styles.appraisalLabel}>Development Areas</Text>
                        <Text style={styles.appraisalText}>{r.developAreas}</Text>
                      </View>
                    )}
                    {r.devPlanNextYear && (
                      <View style={styles.appraisalField}>
                        <Text style={styles.appraisalLabel}>Development Plan (Next Year)</Text>
                        <Text style={styles.appraisalText}>{r.devPlanNextYear}</Text>
                      </View>
                    )}
                    {r.peerFeedbackNotes && (
                      <View style={styles.appraisalField}>
                        <Text style={styles.appraisalLabel}>Peer Feedback Notes</Text>
                        <Text style={styles.appraisalText}>{r.peerFeedbackNotes}</Text>
                      </View>
                    )}
                  </View>
                </View>
              );
            })
          )}
        </View>

        {pageFooter}
      </Page>

      {/* Page 2: Goals by Fiscal Year */}
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Goals by Fiscal Year</Text>
          {goalsByFY.length === 0 ? (
            <Text style={styles.empty}>No goals recorded.</Text>
          ) : (
            goalsByFY.map((fy) => (
              <View key={fy.fiscalYear} style={{ marginBottom: 12 }}>
                <Text style={styles.fyHeader}>FY {fy.fiscalYear}</Text>
                {fy.goals.map((g) => (
                  <View key={g.id} style={styles.goalCard}>
                    <Text style={styles.goalTitle}>{g.title}</Text>
                    <View style={styles.goalMeta}>
                      <Text style={styles.goalMeta}>
                        Status: {g.status}
                        {g.quarter ? `  ·  ${g.quarter}` : ""}
                        {g.weight > 1 ? `  ·  Weight: ${g.weight}` : ""}
                      </Text>
                    </View>
                    <View style={styles.goalProgress}>
                      <ProgressBar pct={g.progressPct} barWidth={200} />
                      <Text style={{ fontSize: 8, color: "#6b7280", width: 40 }}>{g.progressPct}%</Text>
                    </View>
                  </View>
                ))}
              </View>
            ))
          )}
        </View>

        {pageFooter}
      </Page>

      {/* Page 3: Skill Overview + Skill Matrix */}
      <Page size="A4" style={styles.page}>
        {categoryAverages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skill Overview by Category</Text>
            {categoryAverages.map((cat) => (
              <CategoryBar key={cat.id} name={cat.name} avg={cat.avg} />
            ))}
          </View>
        )}

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

        {pageFooter}
      </Page>

    </Document>
  );
}
