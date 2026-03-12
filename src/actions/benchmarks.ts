"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upsertBenchmark(role: string, skillId: string, targetRating: number) {
  await prisma.roleBenchmark.upsert({
    where: { role_skillId: { role, skillId } },
    create: { role, skillId, targetRating },
    update: { targetRating },
  });
  revalidatePath("/settings");
}

export async function deleteBenchmark(id: string) {
  await prisma.roleBenchmark.delete({ where: { id } });
  revalidatePath("/settings");
}
