import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import EmployeeReportPDF, { type ReportData } from "@/components/pdf/EmployeeReportPDF";
import React from "react";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({ where: { id: params.id } });
  if (!employee) return new Response("Not found", { status: 404 });

  // Assigned categories with skills + latest rating per skill
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

  // All meetings with action items (most recent first)
  const rawMeetings = await prisma.meeting.findMany({
    where: { employeeId: params.id },
    orderBy: { meetingDate: "desc" },
    include: { actionItems: { orderBy: { createdAt: "asc" } } },
  });

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
    meetings: rawMeetings.map((m) => ({
      id: m.id,
      meetingDate: m.meetingDate.toISOString(),
      notes: m.notes,
      feedback: m.feedback,
      actionItems: m.actionItems.map((a) => ({
        id: a.id,
        description: a.description,
        status: a.status,
      })),
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
