"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { dateContentSchema, firstZodError } from "@/lib/actions/shared";

const schema = dateContentSchema.extend({
  category: z.string().optional(),
});

export async function getCounselingNotes(studentId: number) {
  await requireSession();
  return db.counselingNote.findMany({
    where: { studentId },
    orderBy: { date: "desc" },
  });
}

export async function createCounselingNote(
  studentId: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = schema.safeParse({
    date: formData.get("date"),
    content: formData.get("content"),
    category: formData.get("category") || undefined,
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.counselingNote.create({
    data: { studentId, date: new Date(parsed.data.date), content: parsed.data.content, category: parsed.data.category },
  });
  revalidatePath(`/homeroom/students/${studentId}/counseling`);
}

export async function updateCounselingNote(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = schema.safeParse({
    date: formData.get("date"),
    content: formData.get("content"),
    category: formData.get("category") || undefined,
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  const note = await db.counselingNote.update({
    where: { id },
    data: { date: new Date(parsed.data.date), content: parsed.data.content, category: parsed.data.category },
  });
  revalidatePath(`/homeroom/students/${note.studentId}/counseling`);
}

export async function deleteCounselingNote(id: number) {
  await requireSession();
  const note = await db.counselingNote.delete({ where: { id } });
  revalidatePath(`/homeroom/students/${note.studentId}/counseling`);
}
