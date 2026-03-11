import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { format } from "date-fns";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const meetings = await prisma.meeting.findMany({
    where: { employeeId: params.id },
    orderBy: { meetingDate: "asc" },
    select: { meetingDate: true },
  });

  // Group by month
  const byMonth: Record<string, number> = {};
  for (const m of meetings) {
    const key = format(m.meetingDate, "yyyy-MM");
    byMonth[key] = (byMonth[key] || 0) + 1;
  }

  const data = Object.entries(byMonth).map(([month, count]) => ({
    month,
    label: format(new Date(month + "-01"), "MMM yy"),
    count,
  }));

  return NextResponse.json(data);
}
