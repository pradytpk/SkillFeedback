export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import NineBoxMatrix from "@/components/appraisal/NineBoxMatrix";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function getCurrentFiscalYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 4 ? `${year}-${String(year + 1).slice(2)}` : `${year - 1}-${String(year).slice(2)}`;
}

export default async function TeamOverviewPage() {
  const currentFY = getCurrentFiscalYear();

  const employees = await prisma.employee.findMany({
    orderBy: { name: "asc" },
    include: {
      appraisalRecords: {
        where: { fiscalYear: currentFY },
        take: 1,
      },
    },
  });

  const data = employees.map((e) => ({
    id: e.id,
    name: e.name,
    avatarColor: e.avatarColor,
    talentBoxPerf: e.appraisalRecords[0]?.talentBoxPerf ?? null,
    talentBoxPot: e.appraisalRecords[0]?.talentBoxPot ?? null,
  }));

  const placed = data.filter((e) => e.talentBoxPerf && e.talentBoxPot);
  const unplaced = data.filter((e) => !e.talentBoxPerf || !e.talentBoxPot);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-8 py-5">
        <Link
          href="/employees"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" /> Team Members
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Team Overview</h1>
        <p className="text-sm text-gray-500 mt-1">9-Box Talent Matrix · FY {currentFY}</p>
      </div>

      <div className="p-8 space-y-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-800 mb-4">9-Box Talent Matrix</h2>
          <p className="text-sm text-gray-500 mb-6">
            {placed.length} of {data.length} employees placed · Set Performance and Potential on each employee's Appraisal tab
          </p>
          <NineBoxMatrix employees={data} />
        </div>

        {unplaced.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-800 mb-3">Not Yet Placed ({unplaced.length})</h2>
            <div className="flex flex-wrap gap-3">
              {unplaced.map((e) => (
                <Link
                  key={e.id}
                  href={`/employees/${e.id}/appraisal`}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: e.avatarColor }}
                  >
                    {e.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm text-gray-700">{e.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
