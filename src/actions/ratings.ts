"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function addRating(
  employeeId: string,
  skillId: string,
  rating: number,
  notes?: string
) {
  if (rating < 1 || rating > 5) throw new Error("Rating must be between 1 and 5");

  await prisma.skillRating.create({
    data: { employeeId, skillId, rating, notes },
  });

  revalidatePath(`/employees/${employeeId}/skills`);
  revalidatePath(`/employees/${employeeId}/progress`);
}
