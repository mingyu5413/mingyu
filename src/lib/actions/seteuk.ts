"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { dateContentSchema, firstZodError } from "@/lib/actions/shared";

export async function getSeteukEntries(studentId: number) {
  await requireSession();
  return db.seteukEntry.findMany({ where: { studentId }, orderBy: { date: "desc" } });
}

export async function createSeteukEntry(
  studentId: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = dateContentSchema.safeParse({
    date: formData.get("date"),
    content: formData.get("content"),
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.seteukEntry.create({
    data: { studentId, date: new Date(parsed.data.date), content: parsed.data.content },
  });
  revalidatePath(`/subject/seteuk/${studentId}`);
}

export async function updateSeteukEntry(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = dateContentSchema.safeParse({
    date: formData.get("date"),
    content: formData.get("content"),
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  const entry = await db.seteukEntry.update({
    where: { id },
    data: { date: new Date(parsed.data.date), content: parsed.data.content },
  });
  revalidatePath(`/subject/seteuk/${entry.studentId}`);
}

export async function deleteSeteukEntry(id: number) {
  await requireSession();
  const entry = await db.seteukEntry.delete({ where: { id } });
  revalidatePath(`/subject/seteuk/${entry.studentId}`);
}

const draftSchema = z.object({
  academicYear: z.coerce.number().int().min(2000).max(2100),
  semester: z.coerce.number().int().min(1).max(2),
  content: z.string().min(1, "내용을 입력해주세요."),
});

export async function getSeteukDrafts(studentId: number) {
  await requireSession();
  return db.seteukDraft.findMany({
    where: { studentId },
    orderBy: [{ academicYear: "desc" }, { semester: "desc" }],
  });
}

export async function saveSeteukDraft(
  studentId: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = draftSchema.safeParse({
    academicYear: formData.get("academicYear"),
    semester: formData.get("semester"),
    content: formData.get("content"),
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.seteukDraft.upsert({
    where: {
      studentId_academicYear_semester: {
        studentId,
        academicYear: parsed.data.academicYear,
        semester: parsed.data.semester,
      },
    },
    update: { finalText: parsed.data.content },
    create: {
      studentId,
      academicYear: parsed.data.academicYear,
      semester: parsed.data.semester,
      finalText: parsed.data.content,
    },
  });
  revalidatePath(`/subject/seteuk/${studentId}`);
}

export async function deleteSeteukDraft(id: number) {
  await requireSession();
  const draft = await db.seteukDraft.delete({ where: { id } });
  revalidatePath(`/subject/seteuk/${draft.studentId}`);
}
