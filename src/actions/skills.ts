"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const CategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

const SkillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  categoryId: z.string().min(1, "Category is required"),
});

export async function createCategory(formData: FormData) {
  const data = CategorySchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });

  await prisma.skillCategory.create({ data });
  revalidatePath("/settings");
}

export async function deleteCategory(id: string) {
  const category = await prisma.skillCategory.findUnique({ where: { id } });
  if (category?.isBuiltIn) throw new Error("Cannot delete built-in categories");

  await prisma.skillCategory.delete({ where: { id } });
  revalidatePath("/settings");
}

export async function createSkill(formData: FormData) {
  const data = SkillSchema.parse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    categoryId: formData.get("categoryId"),
  });

  await prisma.skill.create({ data });
  revalidatePath("/settings");
}

export async function deleteSkill(id: string) {
  const skill = await prisma.skill.findUnique({ where: { id } });
  if (skill?.isBuiltIn) throw new Error("Cannot delete built-in skills");

  await prisma.skill.delete({ where: { id } });
  revalidatePath("/settings");
}
