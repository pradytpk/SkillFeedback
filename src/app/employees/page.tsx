import { prisma } from "@/lib/prisma";
import EmployeeCard from "@/components/employees/EmployeeCard";
import AddEmployeeButton from "@/components/employees/AddEmployeeButton";
import { Users } from "lucide-react";

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { skillRatings: true, meetings: true } },
      meetings: {
        orderBy: { meetingDate: "desc" },
        take: 1,
        select: { meetingDate: true },
      },
    },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-gray-500 text-sm mt-1">
            {employees.length} {employees.length === 1 ? "member" : "members"}
          </p>
        </div>
        <AddEmployeeButton />
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No team members yet</p>
          <p className="text-sm mt-1">Add your first team member to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {employees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={{
                ...employee,
                startDate: employee.startDate.toISOString(),
                meetings: employee.meetings.map((m) => ({
                  meetingDate: m.meetingDate.toISOString(),
                })),
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
