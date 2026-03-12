import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import EmployeeReportPDF, { type ReportData } from "@/components/pdf/EmployeeReportPDF";
import React from "react";

function getFiscalYear(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const month = d.getMonth();
  const year = d.getFullYear();
  return month >= 3 ? `${year}-${String(year + 1).slice(2)}` : `${year - 1}-${String(year).slice(2)}`;
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({ where: { id: params.id } });
  if (!employee) return new Response("Not found", { status: 404 });

  const assignedIds = (
    await prisma.employeeSkillCategory.findMany({
      where: { employeeId: params.id },
      select: { categoryId: true },
    })
  ).map((r) => r.categoryId);

  const rawCategories = await prisma.skillCategory.findMany({
    where: { id: { in: assignedIds } },
    orderBy: { name: "asc" },
    include: {
      skills: {
        orderBy: { name: "asc" },
        include: {
          skillRatings: {
            where: { employeeId: params.id },
            orderBy: { ratedAt: "desc" },
            take: 1,
          },
        },
      },
    },
  });

  // Year notes (sorted descending)
  const rawYearNotes = await prisma.yearNote.findMany({
    where: { employeeId: params.id },
    orderBy: { yearLabel: "desc" },
  });

  // Meeting count per fiscal year
  const rawMeetings = await prisma.meeting.findMany({
    where: { employeeId: params.id },
    select: { meetingDate: true },
  });
  const meetingCountByYear: Record<string, number> = {};
  for (const m of rawMeetings) {
    const fy = getFiscalYear(m.meetingDate);
    meetingCountByYear[fy] = (meetingCountByYear[fy] ?? 0) + 1;
  }

  const data: ReportData = {
    employee: {
      name: employee.name,
      role: employee.role,
      team: employee.team,
      
      startDate: employee.startDate.toISOString(),
    },
    categories: rawCategories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      skills: cat.skills.map((s) => ({
        id: s.id,
        name: s.name,
        latestRating: s.skillRatings[0]?.rating ?? null,
      })),
    })),
    yearNotes: rawYearNotes.map((n) => ({
      yearLabel: n.yearLabel,
      notes: n.notes ?? "",
      meetingCount: meetingCountByYear[n.yearLabel] ?? 0,
    })),
    generatedAt: new Date().toISOString(),
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const buffer = await renderToBuffer(React.createElement(EmployeeReportPDF, { data }) as any);

  const filename = `${employee.name.replace(/\s+/g, "_")}_Skill_Report.pdf`;
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
