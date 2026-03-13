import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { renderToBuffer } from "@react-pdf/renderer";
import EmployeeReportPDF, { type ReportData } from "@/components/pdf/EmployeeReportPDF";
import AppraisalReportPDF, { type AppraisalReportData } from "@/components/pdf/AppraisalReportPDF";
import React from "react";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const employee = await prisma.employee.findUnique({ where: { id: params.id } });
  if (!employee) return new Response("Not found", { status: 404 });

  const mode = req.nextUrl.searchParams.get("mode");

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

  const categories = rawCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    skills: cat.skills.map((s) => ({
      id: s.id,
      name: s.name,
      latestRating: s.skillRatings[0]?.rating ?? null,
    })),
  }));

  if (mode === "appraisal") {
    // Fetch goals grouped by FY
    const rawGoals = await prisma.goal.findMany({
      where: { employeeId: params.id },
      orderBy: [{ fiscalYear: "desc" }, { targetDate: "asc" }],
    });
    const goalsByFYMap = new Map<string, typeof rawGoals>();
    for (const g of rawGoals) {
      const fy = g.fiscalYear ?? "Unknown";
      if (!goalsByFYMap.has(fy)) goalsByFYMap.set(fy, []);
      goalsByFYMap.get(fy)!.push(g);
    }
    const goalsByFY = Array.from(goalsByFYMap.entries()).map(([fiscalYear, goals]) => ({
      fiscalYear,
      goals: goals.map((g) => ({
        id: g.id,
        title: g.title,
        status: g.status,
        progressPct: g.progressPct,
        quarter: g.quarter,
        weight: g.weight,
      })),
    }));

    // Fetch appraisal records
    const rawAppraisal = await prisma.appraisalRecord.findMany({
      where: { employeeId: params.id },
      orderBy: { fiscalYear: "desc" },
    });

    const appraisalData: AppraisalReportData = {
      employee: {
        name: employee.name,
        role: employee.role,
        team: employee.team,
        startDate: employee.startDate.toISOString(),
      },
      categories,
      goalsByFY,
      appraisalRecords: rawAppraisal.map((r) => ({
        fiscalYear: r.fiscalYear,
        overallRating: r.overallRating,
        talentBoxPerf: r.talentBoxPerf,
        talentBoxPot: r.talentBoxPot,
        achievements: r.achievements,
        strengths: r.strengths,
        developAreas: r.developAreas,
        devPlanNextYear: r.devPlanNextYear,
        peerFeedbackNotes: r.peerFeedbackNotes,
      })),
      generatedAt: new Date().toISOString(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const buffer = await renderToBuffer(React.createElement(AppraisalReportPDF, { data: appraisalData }) as any);
    const filename = `${employee.name.replace(/\s+/g, "_")}_Appraisal_Report.pdf`;
    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  }

  // Default: skill report
  const data: ReportData = {
    employee: {
      name: employee.name,
      role: employee.role,
      team: employee.team,
      startDate: employee.startDate.toISOString(),
    },
    categories,
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
