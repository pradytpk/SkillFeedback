export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import AppraisalForm from "@/components/appraisal/AppraisalForm";
import { ClipboardList } from "lucide-react";

function getCurrentFiscalYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 4 ? `${year}-${String(year + 1).slice(2)}` : `${year - 1}-${String(year).slice(2)}`;
}

export default async function AppraisalPage({ params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({ where: { id: params.id } });
  if (!employee) notFound();

  const currentFY = getCurrentFiscalYear();

  const records = await prisma.appraisalRecord.findMany({
    where: { employeeId: params.id },
    orderBy: { fiscalYear: "desc" },
  });

  const currentRecord = records.find((r) => r.fiscalYear === currentFY) ?? null;
  const pastRecords = records.filter((r) => r.fiscalYear !== currentFY);

  const RATING_BADGE: Record<string, string> = {
    S: "bg-purple-100 text-purple-700",
    A: "bg-green-100 text-green-700",
    B: "bg-blue-100 text-blue-700",
    C: "bg-yellow-100 text-yellow-700",
    D: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Appraisal</h2>
          <p className="text-sm text-gray-500 mt-0.5">FY {currentFY} · Year-end review record</p>
        </div>
      </div>

      {/* Current FY Appraisal Form */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <ClipboardList className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-gray-800">FY {currentFY} Appraisal</h3>
          {currentRecord?.overallRating && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${RATING_BADGE[currentRecord.overallRating] ?? ""}`}>
              {currentRecord.overallRating}
            </span>
          )}
        </div>
        <AppraisalForm employeeId={params.id} fiscalYear={currentFY} record={currentRecord} />
      </div>

      {/* Past FY Records (read-only) */}
      {pastRecords.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Past Appraisals</h3>
          {pastRecords.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-3 mb-4">
                <h4 className="font-semibold text-gray-800">FY {r.fiscalYear}</h4>
                {r.overallRating && (
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${RATING_BADGE[r.overallRating] ?? ""}`}>
                    {r.overallRating}
                  </span>
                )}
                {r.talentBoxPerf && r.talentBoxPot && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {r.talentBoxPerf} Perf / {r.talentBoxPot} Pot
                  </span>
                )}
              </div>
              <AppraisalForm employeeId={params.id} fiscalYear={r.fiscalYear} record={r} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
