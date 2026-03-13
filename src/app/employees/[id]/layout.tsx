export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";
import EmployeeSubNav from "@/components/employees/EmployeeSubNav";
import { formatDate } from "@/lib/utils";
import { FileDown, ArrowLeft } from "lucide-react";
import SelfAssessmentToggle from "@/components/employees/SelfAssessmentToggle";

export default async function EmployeeLayout({
  children, params,
}: { children: React.ReactNode; params: { id: string } }) {
  const employee = await prisma.employee.findUnique({ where: { id: params.id } });
  if (!employee) notFound();

  return (
    <div className="flex flex-col min-h-full">
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <Link href="/employees"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Team Members
        </Link>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={employee.name} color={employee.avatarColor} size="xl" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
              <p className="text-gray-500 text-sm">
                {employee.role} · {employee.team} · Since {formatDate(employee.startDate)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <SelfAssessmentToggle employeeId={params.id} enabled={employee.selfAssessmentEnabled} />
            <a href={`/api/employees/${params.id}/report`} download
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-colors">
              <FileDown className="w-4 h-4" /> Skill Report
            </a>
            <a href={`/api/employees/${params.id}/report?mode=appraisal`} download
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-orange-50 hover:text-orange-700 hover:border-orange-200 transition-colors">
              <FileDown className="w-4 h-4" /> Appraisal Report
            </a>
          </div>
        </div>
        <EmployeeSubNav employeeId={params.id} />
      </div>
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
