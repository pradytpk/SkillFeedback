import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import MeetingCard from "@/components/meetings/MeetingCard";
import AddMeetingButton from "@/components/meetings/AddMeetingButton";
import { CalendarDays } from "lucide-react";

export default async function MeetingsPage({ params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({ where: { id: params.id } });
  if (!employee) notFound();

  const meetings = await prisma.meeting.findMany({
    where: { employeeId: params.id },
    orderBy: { meetingDate: "desc" },
    include: {
      actionItems: { orderBy: { createdAt: "asc" } },
    },
  });

  const serialized = meetings.map((m) => ({
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
  }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">1:1 Meetings</h2>
          <p className="text-sm text-gray-500">{meetings.length} meeting{meetings.length !== 1 ? "s" : ""} logged</p>
        </div>
        <AddMeetingButton employeeId={params.id} />
      </div>

      {meetings.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No meetings logged yet</p>
          <p className="text-sm mt-1">Log your first 1:1 to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {serialized.map((meeting) => (
            <MeetingCard key={meeting.id} meeting={meeting} employeeId={params.id} />
          ))}
        </div>
      )}
    </div>
  );
}
