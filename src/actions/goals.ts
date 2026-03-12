"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const GoalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  targetDate: z.string().optional(),
});

export async function createGoal(employeeId: string, formData: FormData) {
  const data = GoalSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    category: formData.get("category") || undefined,
    targetDate: formData.get("targetDate") || undefined,
  });

  await prisma.goal.create({
    data: {
      employeeId,
      title: data.title,
      description: data.description,
      category: data.category,
      targetDate: data.targetDate ? new Date(data.targetDate) : undefined,
    },
  });

  revalidatePath(`/employees/${employeeId}/goals`);
}

export async function updateGoal(id: string, employeeId: string, formData: FormData) {
  const data = GoalSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    category: formData.get("category") || undefined,
    targetDate: formData.get("targetDate") || undefined,
  });

  await prisma.goal.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
    },
  });

  revalidatePath(`/employees/${employeeId}/goals`);
}

export async function deleteGoal(id: string, employeeId: string) {
  await prisma.goal.delete({ where: { id } });
  revalidatePath(`/employees/${employeeId}/goals`);
}

const GOAL_STATUS_CYCLE: Record<string, string> = {
  ACTIVE: "COMPLETED",
  COMPLETED: "ACTIVE",
  PAUSED: "ACTIVE",
  CANCELLED: "ACTIVE",
};

export async function cycleGoalStatus(id: string, employeeId: string, currentStatus: string) {
  const nextStatus = GOAL_STATUS_CYCLE[currentStatus] ?? "ACTIVE";
  await prisma.goal.update({ where: { id }, data: { status: nextStatus } });
  revalidatePath(`/employees/${employeeId}/goals`);
}
