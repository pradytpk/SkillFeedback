export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import YearSection from "@/components/meetings/YearSection";
import AddMeetingButton from "@/components/meetings/AddMeetingButton";
import { CalendarDays } from "lucide-react";

// Fiscal year: April–March. Apr 2024 – Mar 2025 = "2024-25"
function getFiscalYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const month = d.getMonth(); // 0 = Jan
  const year = d.getFullYear();
  return month >= 3
    ? `${year}-${String(year + 1).slice(2)}`
    : `${year - 1}-${String(year).slice(2)}`;
}

export default async function MeetingsPage({ params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({ where: { id: params.id } });
  if (!employee) notFound();

  const meetings = await prisma.meeting.findMany({
    where: { employeeId: params.id },
    orderBy: { meetingDate: "desc" },
    include: {
      actionItems: { orderBy: { createdAt: "asc" } },
      commitments: { orderBy: { createdAt: "asc" } },
    },
  });

  // Previous meeting's open action items (for carry-forward in new meeting form)
  const previousOpenItems = meetings.length > 0
    ? meetings[0].actionItems
        .filter((a) => a.status === "OPEN" || a.status === "IN_PROGRESS")
        .map((a) => ({ id: a.id, description: a.description }))
    : [];

  const templates = await prisma.meetingTemplate.findMany({ orderBy: { title: "asc" } });

  const yearNotes = await prisma.yearNote.findMany({
    where: { employeeId: params.id },
  });
  const yearNotesMap = Object.fromEntries(yearNotes.map((n) => [n.yearLabel, n.notes ?? ""]));

  // Group by fiscal year
  const grouped = new Map<string, typeof meetings>();
  for (const m of meetings) {
    const fy = getFiscalYear(m.meetingDate);
    if (!grouped.has(fy)) grouped.set(fy, []);
    grouped.get(fy)!.push(m);
  }

  // Sort years descending (most recent first)
  const sortedYears = Array.from(grouped.keys()).sort((a, b) => b.localeCompare(a));

  // Current fiscal year (to open by default)
  const currentFY = getFiscalYear(new Date());

  const serialize = (ms: typeof meetings) =>
    ms.map((m) => ({
      ...m,
      meetingDate: m.meetingDate.toISOString(),
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
      actionItems: m.actionItems.map((a) => ({
        ...a,
        dueDate: a.dueDate ? a.dueDate.toISOString() : null,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      })),
      commitments: m.commitments.map((c) => ({
        id: c.id,
        description: c.description,
        status: c.status,
        dueDate: c.dueDate ? c.dueDate.toISOString() : null,
      })),
    }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">1:1 Meetings</h2>
          <p className="text-sm text-gray-500">
            {meetings.length} meeting{meetings.length !== 1 ? "s" : ""} · April–March fiscal year
          </p>
        </div>
        <AddMeetingButton employeeId={params.id} templates={templates} previousOpenItems={previousOpenItems} />
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No meetings logged yet</p>
          <p className="text-sm mt-1">Log your first 1:1 to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedYears.map((year) => (
            <YearSection
              key={year}
              employeeId={params.id}
              yearLabel={year}
              meetings={serialize(grouped.get(year)!)}
              initialNotes={yearNotesMap[year] ?? ""}
              defaultOpen={year === currentFY}
              templates={templates}
              previousOpenItems={previousOpenItems}
            />
          ))}
        </div>
      )}
    </div>
  );
}
