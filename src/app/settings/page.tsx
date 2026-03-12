export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import SettingsClient from "@/components/skills/SettingsClient";

export default async function SettingsPage() {
  const categories = await prisma.skillCategory.findMany({
    orderBy: { name: "asc" },
    include: { skills: { orderBy: { name: "asc" } } },
  });
  const teams = await prisma.team.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="p-8 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage skill categories, skills, and teams.</p>
      </div>
      <SettingsClient categories={categories} teams={teams} />
    </div>
  );
}
