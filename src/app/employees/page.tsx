export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import AddEmployeeButton from "@/components/employees/AddEmployeeButton";
import BulkImportButton from "@/components/employees/BulkImportButton";
import EmployeeListClient from "@/components/employees/EmployeeListClient";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";

export default async function EmployeesPage() {
  const [employees, teams] = await Promise.all([
    prisma.employee.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { skillRatings: true, meetings: true } },
        meetings: { orderBy: { meetingDate: "desc" }, take: 1, select: { meetingDate: true } },
      },
    }),
    prisma.team.findMany({ orderBy: { name: "asc" }, select: { name: true } }),
  ]);

  const teamNames = teams.map((t) => t.name);

  const serialized = employees.map((e) => ({
    ...e,
    startDate: e.startDate.toISOString(),
    meetings: e.meetings.map((m) => ({ meetingDate: m.meetingDate.toISOString() })),
  }));

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-500 text-sm mt-1">
            {employees.length} {employees.length === 1 ? "member" : "members"}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/employees/team-overview"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-colors"
          >
            <LayoutGrid className="w-4 h-4" /> 9-Box Overview
          </Link>
          <BulkImportButton />
          <AddEmployeeButton teams={teamNames} />
        </div>
      </div>
      <EmployeeListClient employees={serialized} teams={teamNames} />
    </div>
  );
}
