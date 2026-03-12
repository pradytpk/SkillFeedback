"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upsertYearNote(employeeId: string, yearLabel: string, notes: string) {
  await prisma.yearNote.upsert({
    where: { employeeId_yearLabel: { employeeId, yearLabel } },
    update: { notes },
    create: { employeeId, yearLabel, notes },
  });
  revalidatePath(`/employees/${employeeId}/meetings`);
}
