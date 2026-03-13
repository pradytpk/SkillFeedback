export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import nextDynamic from "next/dynamic";

const SkillProgressChart = nextDynamic(
  () => import("@/components/charts/SkillProgressChart"),
  { ssr: false }
);
const SkillRadarChart = nextDynamic(
  () => import("@/components/charts/SkillRadarChart"),
  { ssr: false }
);
const MeetingFrequencyChart = nextDynamic(
  () => import("@/components/charts/MeetingFrequencyChart"),
  { ssr: false }
);
const MoodTrendChart = nextDynamic(
  () => import("@/components/charts/MoodTrendChart"),
  { ssr: false }
);

export default async function ProgressPage({ params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({ where: { id: params.id } });
  if (!employee) notFound();

  // All ratings for this employee, ordered by date
  const allRatings = await prisma.skillRating.findMany({
    where: { employeeId: params.id },
    orderBy: { ratedAt: "asc" },
    include: { skill: { include: { category: true } } },
  });

  const ratingsData = allRatings.map((r) => ({
    id: r.id,
    skillId: r.skillId,
    skillName: r.skill.name,
    categoryName: r.skill.category.name,
    rating: r.rating,
    ratedAt: r.ratedAt.toISOString(),
  }));

  // Category averages (latest rating per skill, averaged per category)
  const latestPerSkill = new Map<string, number>();
  for (const r of allRatings) {
    latestPerSkill.set(r.skillId, r.rating); // sorted asc, so last wins
  }

  const categoryTotals: Record<string, { sum: number; count: number }> = {};
  for (const r of allRatings) {
    if (latestPerSkill.get(r.skillId) !== r.rating) continue; // only latest
    const cat = r.skill.category.name;
    if (!categoryTotals[cat]) categoryTotals[cat] = { sum: 0, count: 0 };
    categoryTotals[cat].sum += r.rating;
    categoryTotals[cat].count += 1;
  }

  const categoryAverages = Object.entries(categoryTotals).map(([category, { sum, count }]) => ({
    category,
    average: Math.round((sum / count) * 10) / 10,
  }));

  // Meeting frequency + mood
  const meetings = await prisma.meeting.findMany({
    where: { employeeId: params.id },
    orderBy: { meetingDate: "asc" },
    select: { meetingDate: true, moodScore: true },
  });

  const byMonth: Record<string, number> = {};
  for (const m of meetings) {
    const key = format(m.meetingDate, "yyyy-MM");
    byMonth[key] = (byMonth[key] || 0) + 1;
  }
  const meetingStats = Object.entries(byMonth).map(([month, count]) => ({
    month,
    label: format(new Date(month + "-01"), "MMM yy"),
    count,
  }));

  const moodData = meetings
    .filter((m) => m.moodScore !== null)
    .map((m) => ({
      date: format(m.meetingDate, "MMM d"),
      mood: m.moodScore as number,
    }));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Progress Overview</h2>
        <p className="text-sm text-gray-500">Skill growth and meeting history over time</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Skill Snapshot (by category)</h3>
          <SkillRadarChart data={categoryAverages} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Meeting Frequency</h3>
          <MeetingFrequencyChart data={meetingStats} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="font-semibold text-gray-800 mb-4">Skill Ratings Over Time</h3>
        <SkillProgressChart ratings={ratingsData} />
      </div>

      {moodData.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <MoodTrendChart data={moodData} />
        </div>
      )}
    </div>
  );
}
