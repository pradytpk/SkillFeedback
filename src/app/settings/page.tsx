export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/skills/SettingsClient";

export default async function SettingsPage() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { name: "asc" },
    include: { skills: { orderBy: { name: "asc" } } },
  });
  const [teams, meetingTemplates, allSkills, employeeRoles, benchmarks] = await Promise.all([
    prisma.team.findMany({ orderBy: { name: "asc" } }),
    prisma.meetingTemplate.findMany({ orderBy: { title: "asc" } }),
    prisma.skill.findMany({ orderBy: { name: "asc" }, include: { category: { select: { name: true } } } }),
    prisma.employee.findMany({ distinct: ["role"], select: { role: true }, orderBy: { role: "asc" } }),
    prisma.roleBenchmark.findMany(),
  ]);

  return (
    <div className="p-8 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage skill categories, skills, teams, and meeting templates.</p>
      </div>
      <SettingsClient
        categories={categories}
        teams={teams}
        meetingTemplates={meetingTemplates}
        allSkills={allSkills}
        roles={employeeRoles.map((e) => e.role)}
        benchmarks={benchmarks}
      />
    </div>
  );
}
