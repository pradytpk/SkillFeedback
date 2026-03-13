"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const MeetingSchema = z.object({
  meetingDate: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
  feedback: z.string().optional(),
  moodScore: z.coerce.number().int().min(1).max(5).optional(),
  qualityFlag: z.string().optional(),
});

export async function createMeeting(employeeId: string, formData: FormData) {
  const data = MeetingSchema.parse({
    meetingDate: formData.get("meetingDate"),
    notes: formData.get("notes") || undefined,
    feedback: formData.get("feedback") || undefined,
    moodScore: formData.get("moodScore") || undefined,
    qualityFlag: formData.get("qualityFlag") || undefined,
  });

  await prisma.meeting.create({
    data: {
      employeeId,
      meetingDate: new Date(data.meetingDate),
      notes: data.notes,
      feedback: data.feedback,
      moodScore: data.moodScore ?? null,
      qualityFlag: data.qualityFlag || null,
    },
  });

  revalidatePath(`/employees/${employeeId}/meetings`);
}

export async function updateMeeting(id: string, employeeId: string, formData: FormData) {
  const data = MeetingSchema.parse({
    meetingDate: formData.get("meetingDate"),
    notes: formData.get("notes") || undefined,
    feedback: formData.get("feedback") || undefined,
    moodScore: formData.get("moodScore") || undefined,
    qualityFlag: formData.get("qualityFlag") || undefined,
  });

  await prisma.meeting.update({
    where: { id },
    data: {
      meetingDate: new Date(data.meetingDate),
      notes: data.notes,
      feedback: data.feedback,
      moodScore: data.moodScore ?? null,
      qualityFlag: data.qualityFlag || null,
    },
  });

  revalidatePath(`/employees/${employeeId}/meetings`);
}

export async function deleteMeeting(id: string, employeeId: string) {
  await prisma.meeting.delete({ where: { id } });
  revalidatePath(`/employees/${employeeId}/meetings`);
}

export async function createActionItem(meetingId: string, employeeId: string, description: string, dueDate?: string) {
  await prisma.actionItem.create({
    data: {
      meetingId,
      description,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    },
  });

  revalidatePath(`/employees/${employeeId}/meetings`);
}

export async function updateActionItemStatus(id: string, status: string, employeeId: string) {
  await prisma.actionItem.update({
    where: { id },
    data: { status },
  });

  revalidatePath(`/employees/${employeeId}/meetings`);
}

export async function deleteActionItem(id: string, employeeId: string) {
  await prisma.actionItem.delete({ where: { id } });
  revalidatePath(`/employees/${employeeId}/meetings`);
}

export async function createMeetingTemplate(title: string, notesTemplate: string) {
  if (!title.trim()) throw new Error("Title is required");
  await prisma.meetingTemplate.create({ data: { title: title.trim(), notesTemplate: notesTemplate.trim() || null } });
  revalidatePath("/settings");
}

export async function deleteMeetingTemplate(id: string) {
  await prisma.meetingTemplate.delete({ where: { id } });
  revalidatePath("/settings");
}
