"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createCommitment(employeeId: string, description: string, meetingId?: string, dueDate?: string) {
  if (!description.trim()) throw new Error("Description is required");
  await prisma.commitment.create({
    data: {
      employeeId,
      description: description.trim(),
      meetingId: meetingId || null,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });
  revalidatePath(`/employees/${employeeId}/meetings`);
}

export async function updateCommitmentStatus(id: string, status: string, employeeId: string) {
  await prisma.commitment.update({ where: { id }, data: { status } });
  revalidatePath(`/employees/${employeeId}/meetings`);
}

export async function deleteCommitment(id: string, employeeId: string) {
  await prisma.commitment.delete({ where: { id } });
  revalidatePath(`/employees/${employeeId}/meetings`);
}
