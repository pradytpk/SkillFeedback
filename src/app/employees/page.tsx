export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import AddEmployeeButton from "@/components/employees/AddEmployeeButton";
import BulkImportButton from "@/components/employees/BulkImportButton";
import EmployeeListClient from "@/components/employees/EmployeeListClient";

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
          <BulkImportButton />
          <AddEmployeeButton teams={teamNames} />
        </div>
      </div>
      <EmployeeListClient employees={serialized} teams={teamNames} />
    </div>
  );
}
