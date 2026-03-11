"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const EmployeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  team: z.string().min(1, "Team is required"),
  startDate: z.string().min(1, "Start date is required"),
  avatarColor: z.string().default("#6366f1"),
});

export async function createEmployee(formData: FormData) {
  const data = EmployeeSchema.parse({
    name: formData.get("name"),
    role: formData.get("role"),
    team: formData.get("team"),
    startDate: formData.get("startDate"),
    avatarColor: formData.get("avatarColor") || "#6366f1",
  });

  await prisma.employee.create({
    data: {
      ...data,
      startDate: new Date(data.startDate),
    },
  });

  revalidatePath("/employees");
}

export async function updateEmployee(id: string, formData: FormData) {
  const data = EmployeeSchema.parse({
    name: formData.get("name"),
    role: formData.get("role"),
    team: formData.get("team"),
    startDate: formData.get("startDate"),
    avatarColor: formData.get("avatarColor") || "#6366f1",
  });

  await prisma.employee.update({
    where: { id },
    data: {
      ...data,
      startDate: new Date(data.startDate),
    },
  });

  revalidatePath("/employees");
  revalidatePath(`/employees/${id}`);
}

export async function deleteEmployee(id: string) {
  await prisma.employee.delete({ where: { id } });
  revalidatePath("/employees");
}
