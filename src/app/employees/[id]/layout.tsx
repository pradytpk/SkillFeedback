export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Avatar from "@/components/ui/Avatar";
import EmployeeSubNav from "@/components/employees/EmployeeSubNav";
import { formatDate } from "@/lib/utils";

export default async function EmployeeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const employee = await prisma.employee.findUnique({
    where: { id: params.id },
  });

  if (!employee) notFound();

  return (
    <div className="flex flex-col min-h-full">
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <div className="flex items-center gap-4">
          <Avatar name={employee.name} color={employee.avatarColor} size="xl" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
            <p className="text-gray-500 text-sm">
              {employee.role} · {employee.team} · Since {formatDate(employee.startDate)}
            </p>
          </div>
        </div>
        <EmployeeSubNav employeeId={params.id} />
      </div>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
