"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { dateContentSchema, firstZodError } from "@/lib/actions/shared";

export async function getSeteukEntries(subjectStudentId: number) {
  await requireSession();
  return db.seteukEntry.findMany({
    where: { subjectStudentId },
    orderBy: { date: "desc" },
  });
}

export async function createSeteukEntry(
  subjectClassId: number,
  subjectStudentId: number,
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
    data: {
      subjectClassId,
      subjectStudentId,
      date: new Date(parsed.data.date),
      content: parsed.data.content,
    },
  });
  revalidatePath(`/subject`);
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

  await db.seteukEntry.update({
    where: { id },
    data: { date: new Date(parsed.data.date), content: parsed.data.content },
  });
  revalidatePath(`/subject`);
}

export async function deleteSeteukEntry(id: number) {
  await requireSession();
  await db.seteukEntry.delete({ where: { id } });
  revalidatePath(`/subject`);
}

const draftSchema = z.object({
  academicYear: z.coerce.number().int().min(2000).max(2100),
  semester: z.coerce.number().int().min(1).max(2),
  content: z.string().min(1, "내용을 입력해주세요."),
});

export async function getSeteukDrafts(subjectStudentId: number) {
  await requireSession();
  return db.seteukDraft.findMany({
    where: { subjectStudentId },
    orderBy: [{ academicYear: "desc" }, { semester: "desc" }],
  });
}

export async function saveSeteukDraft(
  subjectClassId: number,
  subjectStudentId: number,
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
      subjectClassId_subjectStudentId_academicYear_semester: {
        subjectClassId,
        subjectStudentId,
        academicYear: parsed.data.academicYear,
        semester: parsed.data.semester,
      },
    },
    update: { finalText: parsed.data.content },
    create: {
      subjectClassId,
      subjectStudentId,
      academicYear: parsed.data.academicYear,
      semester: parsed.data.semester,
      finalText: parsed.data.content,
    },
  });
  revalidatePath(`/subject`);
}

export async function deleteSeteukDraft(id: number) {
  await requireSession();
  await db.seteukDraft.delete({ where: { id } });
  revalidatePath(`/subject`);
}
