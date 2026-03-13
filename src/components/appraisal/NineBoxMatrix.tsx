"use client";
import Link from "next/link";

interface Employee {
  id: string;
  name: string;
  avatarColor: string;
  talentBoxPerf: string | null;
  talentBoxPot: string | null;
}

const LEVELS = ["High", "Medium", "Low"] as const;
type Level = typeof LEVELS[number];

const CELL_LABELS: Record<string, string> = {
  "High-High": "Star",
  "High-Medium": "High Performer",
  "High-Low": "Consistent Star",
  "Medium-High": "High Potential",
  "Medium-Medium": "Core Player",
  "Medium-Low": "Solid Performer",
  "Low-High": "Rough Diamond",
  "Low-Medium": "Inconsistent",
  "Low-Low": "Under Performer",
};

const CELL_STYLE: Record<string, string> = {
  "High-High": "bg-green-50 border-green-200",
  "High-Medium": "bg-green-50 border-green-100",
  "High-Low": "bg-blue-50 border-blue-100",
  "Medium-High": "bg-yellow-50 border-yellow-200",
  "Medium-Medium": "bg-gray-50 border-gray-200",
  "Medium-Low": "bg-gray-50 border-gray-100",
  "Low-High": "bg-orange-50 border-orange-200",
  "Low-Medium": "bg-red-50 border-red-100",
  "Low-Low": "bg-red-50 border-red-200",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

export default function NineBoxMatrix({ employees }: { employees: Employee[] }) {
  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="w-3 h-3 bg-gray-200 rounded-sm inline-block" />
          X-axis: Performance (Low→High)
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <span className="w-3 h-3 bg-gray-200 rounded-sm inline-block" />
          Y-axis: Potential (Low→High)
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: 480 }}>
          <thead>
            <tr>
              <th className="w-16 text-xs text-gray-400 font-normal pb-2 text-right pr-2">Potential ↑</th>
              {LEVELS.map((perf) => (
                <th key={perf} className="text-xs text-gray-500 font-medium pb-2 text-center">
                  {perf} Perf.
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LEVELS.map((pot) => (
              <tr key={pot}>
                <td className="text-xs text-gray-500 font-medium pr-2 text-right align-middle">{pot} Pot.</td>
                {LEVELS.map((perf) => {
                  const key = `${perf}-${pot}`;
                  const cellEmployees = employees.filter(
                    (e) => e.talentBoxPerf === perf && e.talentBoxPot === pot
                  );
                  return (
                    <td
                      key={key}
                      className={`border rounded-lg p-3 align-top ${CELL_STYLE[key] ?? "bg-gray-50 border-gray-100"}`}
                      style={{ minHeight: 80, minWidth: 120 }}
                    >
                      <p className="text-xs font-medium text-gray-500 mb-2">{CELL_LABELS[key]}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {cellEmployees.map((e) => (
                          <Link
                            key={e.id}
                            href={`/employees/${e.id}/appraisal`}
                            title={e.name}
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold hover:ring-2 hover:ring-orange-400 transition-all"
                            style={{ backgroundColor: e.avatarColor }}
                          >
                            {getInitials(e.name)}
                          </Link>
                        ))}
                        {cellEmployees.length === 0 && (
                          <span className="text-xs text-gray-300 italic">—</span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
