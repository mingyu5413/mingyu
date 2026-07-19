"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { firstZodError } from "@/lib/actions/shared";

const createSchema = z.object({
  studentId: z.coerce.number().int(),
  date: z.string().min(1, "날짜를 입력해주세요."),
  lessonSessionId: z.coerce.number().int().optional(),
  content: z.string().min(1, "내용을 입력해주세요."),
});

const updateSchema = createSchema.omit({ studentId: true });

export async function getClassBehaviorNotes() {
  await requireSession();
  return db.classBehaviorNote.findMany({
    include: { student: true, lessonSession: true },
    orderBy: { date: "desc" },
  });
}

export async function createClassBehaviorNote(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = createSchema.safeParse({
    studentId: formData.get("studentId"),
    date: formData.get("date"),
    lessonSessionId: formData.get("lessonSessionId") || undefined,
    content: formData.get("content"),
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.classBehaviorNote.create({
    data: { ...parsed.data, date: new Date(parsed.data.date) },
  });
  revalidatePath("/subject/behavior");
}

export async function updateClassBehaviorNote(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = updateSchema.safeParse({
    date: formData.get("date"),
    lessonSessionId: formData.get("lessonSessionId") || undefined,
    content: formData.get("content"),
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.classBehaviorNote.update({
    where: { id },
    data: { ...parsed.data, date: new Date(parsed.data.date) },
  });
  revalidatePath("/subject/behavior");
}

export async function deleteClassBehaviorNote(id: number) {
  await requireSession();
  await db.classBehaviorNote.delete({ where: { id } });
  revalidatePath("/subject/behavior");
}
