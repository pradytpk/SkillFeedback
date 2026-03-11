import { Document, Page, View, Text, StyleSheet, Svg, Rect, G } from "@react-pdf/renderer";
import { RATING_LABELS, RATING_COLORS } from "@/lib/constants";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: "#111827", padding: 40, lineHeight: 1.4 },

  // Header
  header: { marginBottom: 20, paddingBottom: 14, borderBottom: "1.5pt solid #e5e7eb" },
  headerTitle: { fontSize: 20, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 4 },
  headerMeta: { fontSize: 9, color: "#6b7280" },
  headerGenerated: { fontSize: 8, color: "#9ca3af", marginTop: 4 },

  // Section
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#111827", marginBottom: 10, paddingBottom: 4, borderBottom: "0.5pt solid #e5e7eb" },

  // Category
  categoryHeader: { backgroundColor: "#f3f4f6", paddingVertical: 4, paddingHorizontal: 8, marginBottom: 2, borderRadius: 3 },
  categoryName: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#374151" },

  // Skills table
  skillRow: { flexDirection: "row", paddingVertical: 5, paddingHorizontal: 8, borderBottom: "0.5pt solid #f3f4f6", alignItems: "center" },
  skillName: { width: 140, fontSize: 8.5, color: "#374151" },
  noRating: { fontSize: 8, color: "#9ca3af" },

  // Meetings
  meetingCard: { marginBottom: 10, paddingBottom: 10, borderBottom: "0.5pt solid #f3f4f6" },
  meetingDate: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#4f46e5", marginBottom: 3 },
  meetingNotes: { fontSize: 8.5, color: "#374151", marginBottom: 4 },
  meetingLabel: { fontSize: 7.5, fontFamily: "Helvetica-Bold", color: "#9ca3af", textTransform: "uppercase", marginBottom: 2 },

  // Action items
  actionRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 4 },
  bullet: { width: 12, fontSize: 8.5, color: "#6b7280" },
  actionText: { flex: 1, fontSize: 8.5, color: "#374151" },
  actionStatus: { fontSize: 7.5, color: "#6b7280", marginLeft: 8 },

  // Chart
  chartRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  chartLabel: { width: 110, fontSize: 8, color: "#374151", fontFamily: "Helvetica-Bold" },
  chartBarBg: { flex: 1, height: 14, backgroundColor: "#f3f4f6", borderRadius: 3 },
  chartValue: { width: 40, fontSize: 8, color: "#6b7280", textAlign: "right" },

  // Legend
  legendRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 7.5, color: "#6b7280" },

  // Empty state
  empty: { fontSize: 8.5, color: "#9ca3af", fontStyle: "italic", paddingVertical: 6 },

  // Footer
  footer: { position: "absolute", bottom: 24, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 7.5, color: "#d1d5db" },
});

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function ratingColor(r: number) {
  return RATING_COLORS[r] ?? "#9ca3af";
}

// Horizontal bar using SVG (precise rendering)
function RatingBar({ rating, barWidth = 200 }: { rating: number | null; barWidth?: number }) {
  const BAR_H = 10;
  const filled = rating ? (rating / 5) * barWidth : 0;
  const color = rating ? ratingColor(rating) : "#e5e7eb";
  return (
    <Svg width={barWidth} height={BAR_H}>
      <G>
        {/* Background track */}
        <Rect x={0} y={0} width={barWidth} height={BAR_H} rx={3} ry={3} fill="#f3f4f6" />
        {/* Filled bar */}
        {filled > 0 && (
          <Rect x={0} y={0} width={filled} height={BAR_H} rx={3} ry={3} fill={color} />
        )}
        {/* Tick marks at each level */}
        {[1, 2, 3, 4].map((t) => (
          <Rect key={t} x={(t / 5) * barWidth - 0.5} y={0} width={1} height={BAR_H} fill="white" opacity={0.5} />
        ))}
      </G>
    </Svg>
  );
}

// Category average bar for the chart section
function CategoryBar({ name, avg, barWidth = 260 }: { name: string; avg: number; barWidth?: number }) {
  const BAR_H = 14;
  const filled = (avg / 5) * barWidth;
  const level = Math.round(avg);
  const color = level >= 1 && level <= 5 ? ratingColor(level) : "#6366f1";
  const label = level >= 1 && level <= 5 ? RATING_LABELS[level] : "";
  return (
    <View style={styles.chartRow}>
      <Text style={styles.chartLabel} >{name}</Text>
      <View style={{ flex: 1, position: "relative" }}>
        <Svg width="100%" height={BAR_H} viewBox={`0 0 ${barWidth} ${BAR_H}`}>
          <G>
            <Rect x={0} y={0} width={barWidth} height={BAR_H} rx={3} ry={3} fill="#f3f4f6" />
            {filled > 0 && (
              <Rect x={0} y={0} width={filled} height={BAR_H} rx={3} ry={3} fill={color} opacity={0.85} />
            )}
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
  categories: {
    id: string;
    name: string;
    skills: { id: string; name: string; latestRating: number | null }[];
  }[];
  meetings: {
    id: string;
    meetingDate: string;
    notes: string | null;
    feedback: string | null;
    actionItems: { id: string; description: string; status: string }[];
  }[];
  generatedAt: string;
}

export default function EmployeeReportPDF({ data }: { data: ReportData }) {
  const { employee, categories, meetings, generatedAt } = data;

  // Compute category averages (only rated skills)
  const categoryAverages = categories.map((cat) => {
    const rated = cat.skills.filter((s) => s.latestRating !== null);
    const avg = rated.length > 0
      ? rated.reduce((sum, s) => sum + (s.latestRating ?? 0), 0) / rated.length
      : 0;
    return { id: cat.id, name: cat.name, avg, ratedCount: rated.length, totalCount: cat.skills.length };
  }).filter((c) => c.ratedCount > 0);

  const openItems = meetings
    .flatMap((m) => m.actionItems)
    .filter((a) => a.status === "OPEN" || a.status === "IN_PROGRESS");

  return (
    <Document title={`${employee.name} — Skill Report`} author="SkillTracker">
      <Page size="A4" style={styles.page}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{employee.name}</Text>
          <Text style={styles.headerMeta}>
            {employee.role}  ·  {employee.team}  ·  Since {formatDate(employee.startDate)}
          </Text>
          <Text style={styles.headerGenerated}>Report generated on {formatDate(generatedAt)}</Text>
        </View>

        {/* ── Category Overview Chart ── */}
        {categoryAverages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skill Overview by Category</Text>
            {categoryAverages.map((cat) => (
              <CategoryBar key={cat.id} name={cat.name} avg={cat.avg} />
            ))}
            {/* Rating scale legend */}
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

        {/* ── Skill Matrix with inline bars ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skill Matrix</Text>
          {categories.length === 0 ? (
            <Text style={styles.empty}>No skill categories assigned to this employee.</Text>
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
                          <Text style={{ fontSize: 8, color: ratingColor(r), fontFamily: "Helvetica-Bold", width: 60 }}>
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

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>SkillTracker — Confidential</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>

      {/* ── Page 2: Meetings + Action Items ── */}
      <Page size="A4" style={styles.page}>

        {/* 1:1 Meetings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1:1 Meeting Notes  ({meetings.length} total)</Text>
          {meetings.length === 0 ? (
            <Text style={styles.empty}>No meetings logged yet.</Text>
          ) : (
            meetings.slice(0, 10).map((m) => (
              <View key={m.id} style={styles.meetingCard}>
                <Text style={styles.meetingDate}>{formatDate(m.meetingDate)}</Text>
                {m.notes && (
                  <>
                    <Text style={styles.meetingLabel}>Notes</Text>
                    <Text style={styles.meetingNotes}>{m.notes}</Text>
                  </>
                )}
                {m.feedback && (
                  <>
                    <Text style={styles.meetingLabel}>Feedback</Text>
                    <Text style={styles.meetingNotes}>{m.feedback}</Text>
                  </>
                )}
                {m.actionItems.length > 0 && (
                  <>
                    <Text style={styles.meetingLabel}>Action Items</Text>
                    {m.actionItems.map((a) => (
                      <View key={a.id} style={styles.actionRow}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.actionText}>{a.description}</Text>
                        <Text style={styles.actionStatus}>[{a.status.replace("_", " ")}]</Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            ))
          )}
        </View>

        {/* Open Action Items */}
        {openItems.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Open Action Items  ({openItems.length})</Text>
            {openItems.map((a) => (
              <View key={a.id} style={styles.actionRow}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.actionText}>{a.description}</Text>
                <Text style={styles.actionStatus}>[{a.status.replace("_", " ")}]</Text>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>SkillTracker — Confidential</Text>
          <Text style={styles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
