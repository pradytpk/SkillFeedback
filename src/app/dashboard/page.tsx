export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import nextDynamic from "next/dynamic";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { RATING_LABELS, RATING_BG_CLASSES } from "@/lib/constants";
import { AlertCircle, CalendarDays, Users } from "lucide-react";

const SkillRadarChart = nextDynamic(() => import("@/components/charts/SkillRadarChart"), { ssr: false });

export default async function DashboardPage() {
  const employees = await prisma.employee.findMany({
    include: {
      meetings: { orderBy: { meetingDate: "desc" }, take: 1, select: { meetingDate: true } },
      skillRatings: { orderBy: { ratedAt: "asc" }, include: { skill: { include: { category: true } } } },
    },
  });

  // ── Team radar: latest rating per skill per employee, then avg per category ──
  const categoryTotals: Record<string, { sum: number; count: number }> = {};
  for (const emp of employees) {
    const latestPerSkill: Record<string, number> = {};
    for (const r of emp.skillRatings) latestPerSkill[r.skillId] = r.rating;
    for (const r of emp.skillRatings) {
      if (latestPerSkill[r.skillId] !== r.rating) continue;
      const cat = r.skill.category.name;
      if (!categoryTotals[cat]) categoryTotals[cat] = { sum: 0, count: 0 };
      categoryTotals[cat].sum += r.rating;
      categoryTotals[cat].count += 1;
    }
  }
  const categoryAverages = Object.entries(categoryTotals).map(([category, { sum, count }]) => ({
    category,
    average: Math.round((sum / count) * 10) / 10,
  }));

  // ── Weak skills: per skill, avg across all employees ──
  const skillTotals: Record<string, { name: string; catName: string; sum: number; count: number; notRated: number }> = {};
  for (const emp of employees) {
    const latestPerSkill: Record<string, number> = {};
    for (const r of emp.skillRatings) latestPerSkill[r.skillId] = r.rating;
    for (const skillId of Object.keys(latestPerSkill)) {
      const rating = latestPerSkill[skillId];
      const r = emp.skillRatings.find((x) => x.skillId === skillId && x.rating === rating)!;
      if (!skillTotals[skillId]) skillTotals[skillId] = { name: r.skill.name, catName: r.skill.category.name, sum: 0, count: 0, notRated: 0 };
      skillTotals[skillId].sum += rating;
      skillTotals[skillId].count += 1;
    }
  }
  const weakSkills = Object.entries(skillTotals)
    .map(([id, v]) => ({ id, ...v, avg: v.sum / v.count }))
    .sort((a, b) => a.avg - b.avg)
    .slice(0, 5);

  // ── Overdue check-ins (no meeting in 30+ days or never) ──
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const overdue = employees.filter((e) => {
    const last = e.meetings[0]?.meetingDate;
    return !last || last < thirtyDaysAgo;
  }).map((e) => ({
    id: e.id,
    name: e.name,
    role: e.role,
    team: e.team,
    avatarColor: e.avatarColor,
    lastMeeting: e.meetings[0]?.meetingDate ?? null,
  }));

  const totalRated = employees.filter((e) => e.skillRatings.length > 0).length;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Team Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">{employees.length} members · {totalRated} with skill ratings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Team Skill Radar */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-1">Team Skill Snapshot</h3>
          <p className="text-xs text-gray-400 mb-4">Average rating per category across all team members</p>
          {categoryAverages.length === 0 ? (
            <div className="text-center py-12 text-gray-300">
              <Users className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm">No ratings yet</p>
            </div>
          ) : (
            <SkillRadarChart data={categoryAverages} />
          )}
        </div>

        {/* Overdue Check-ins */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-1">Overdue Check-ins</h3>
          <p className="text-xs text-gray-400 mb-4">No 1:1 in the last 30 days</p>
          {overdue.length === 0 ? (
            <div className="text-center py-12 text-green-500">
              <CalendarDays className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm font-medium">All check-ins up to date!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {overdue.map((e) => {
                const daysAgo = e.lastMeeting
                  ? Math.floor((Date.now() - e.lastMeeting.getTime()) / 86400000)
                  : null;
                return (
                  <li key={e.id} className="flex items-center justify-between py-3">
                    <Link href={`/employees/${e.id}/meetings`} className="flex items-center gap-3 group">
                      <Avatar name={e.name} color={e.avatarColor} size="sm" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600">{e.name}</p>
                        <p className="text-xs text-gray-400">{e.role}</p>
                      </div>
                    </Link>
                    <div className="flex items-center gap-2">
                      <Badge>{e.team}</Badge>
                      <span className="text-xs text-amber-600 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {daysAgo !== null ? `${daysAgo}d ago` : "Never"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* Weak Skills */}
      {weakSkills.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-semibold text-gray-800 mb-1">Team Weak Spots</h3>
          <p className="text-xs text-gray-400 mb-4">Bottom-rated skills across the team — consider training or hiring</p>
          <div className="overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Skill", "Category", "Team Average", "Rated By"].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {weakSkills.map((s) => {
                  const level = Math.round(s.avg);
                  const bgClass = RATING_BG_CLASSES[level] ?? "bg-gray-100 text-gray-600 border-gray-200";
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-800">{s.name}</td>
                      <td className="px-4 py-3 text-gray-500">{s.catName}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bgClass}`}>
                          {s.avg.toFixed(1)} — {RATING_LABELS[level] ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">{s.count} / {employees.length}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
