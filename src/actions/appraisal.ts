"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const AppraisalSchema = z.object({
  overallRating: z.string().optional(),
  talentBoxPerf: z.string().optional(),
  talentBoxPot: z.string().optional(),
  achievements: z.string().optional(),
  strengths: z.string().optional(),
  developAreas: z.string().optional(),
  devPlanNextYear: z.string().optional(),
  peerFeedbackNotes: z.string().optional(),
});

export async function upsertAppraisalRecord(employeeId: string, fiscalYear: string, formData: FormData) {
  const data = AppraisalSchema.parse({
    overallRating: formData.get("overallRating") || undefined,
    talentBoxPerf: formData.get("talentBoxPerf") || undefined,
    talentBoxPot: formData.get("talentBoxPot") || undefined,
    achievements: formData.get("achievements") || undefined,
    strengths: formData.get("strengths") || undefined,
    developAreas: formData.get("developAreas") || undefined,
    devPlanNextYear: formData.get("devPlanNextYear") || undefined,
    peerFeedbackNotes: formData.get("peerFeedbackNotes") || undefined,
  });

  await prisma.appraisalRecord.upsert({
    where: { employeeId_fiscalYear: { employeeId, fiscalYear } },
    create: { employeeId, fiscalYear, ...data },
    update: { ...data },
  });

  revalidatePath(`/employees/${employeeId}/appraisal`);
  revalidatePath("/employees/team-overview");
}
