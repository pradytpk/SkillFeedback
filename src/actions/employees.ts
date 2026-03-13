"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const EmployeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  team: z.string().min(1, "Team is required"),
  startDate: z.string().min(1, "Start date is required"),
  avatarColor: z.string().default("#ea580c"),
});

export async function createEmployee(formData: FormData) {
  const data = EmployeeSchema.parse({
    name: formData.get("name"),
    role: formData.get("role"),
    team: formData.get("team"),
    startDate: formData.get("startDate"),
    avatarColor: formData.get("avatarColor") || "#ea580c",
  });
  await prisma.employee.create({ data: { ...data, startDate: new Date(data.startDate) } });
  revalidatePath("/employees");
}

export async function updateEmployee(id: string, formData: FormData) {
  const data = EmployeeSchema.parse({
    name: formData.get("name"),
    role: formData.get("role"),
    team: formData.get("team"),
    startDate: formData.get("startDate"),
    avatarColor: formData.get("avatarColor") || "#ea580c",
  });
  await prisma.employee.update({
    where: { id },
    data: { ...data, startDate: new Date(data.startDate) },
  });
  revalidatePath("/employees");
  revalidatePath(`/employees/${id}`);
}

export async function deleteEmployee(id: string) {
  await prisma.employee.delete({ where: { id } });
  revalidatePath("/employees");
}

export async function toggleSelfAssessment(id: string) {
  const employee = await prisma.employee.findUnique({ where: { id }, select: { selfAssessmentEnabled: true } });
  if (!employee) throw new Error("Employee not found");
  await prisma.employee.update({
    where: { id },
    data: { selfAssessmentEnabled: !employee.selfAssessmentEnabled },
  });
  revalidatePath(`/employees/${id}/skills`);
  revalidatePath(`/employees/${id}`);
}

const BulkRowSchema = z.object({
  name: z.string().min(1, "Name required"),
  role: z.string().min(1, "Role required"),
  team: z.string().min(1, "Team required"),
  startDate: z.string().min(1, "Start date required"),
});

export async function bulkCreateEmployees(rows: { name: string; role: string; team: string; startDate: string }[]) {
  const COLORS = ["#6366f1","#8b5cf6","#ec4899","#ef4444","#f97316","#eab308","#22c55e","#14b8a6","#06b6d4","#3b82f6"];
  const valid = rows.map((r, i) => ({ ...BulkRowSchema.parse(r), avatarColor: COLORS[i % COLORS.length] }));
  let created = 0;
  for (const r of valid) {
    try {
      await prisma.employee.create({ data: { ...r, startDate: new Date(r.startDate) } });
      created++;
    } catch {
      // skip duplicates or other errors
    }
  }
  revalidatePath("/employees");
  return { created, skipped: valid.length - created };
}
