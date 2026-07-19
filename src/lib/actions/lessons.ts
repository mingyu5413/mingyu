"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { dateContentSchema, firstZodError } from "@/lib/actions/shared";

const schema = dateContentSchema.extend({
  unit: z.string().min(1, "단원을 입력해주세요."),
  homeworkNote: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.safeParse({
    date: formData.get("date"),
    content: formData.get("content"),
    unit: formData.get("unit"),
    homeworkNote: formData.get("homeworkNote") || undefined,
  });
}

export async function getLessonSessions() {
  await requireSession();
  return db.lessonSession.findMany({ orderBy: { date: "desc" } });
}

export async function createLessonSession(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.lessonSession.create({
    data: {
      date: new Date(parsed.data.date),
      content: parsed.data.content,
      unit: parsed.data.unit,
      homeworkNote: parsed.data.homeworkNote,
    },
  });
  revalidatePath("/subject/lessons");
}

export async function updateLessonSession(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.lessonSession.update({
    where: { id },
    data: {
      date: new Date(parsed.data.date),
      content: parsed.data.content,
      unit: parsed.data.unit,
      homeworkNote: parsed.data.homeworkNote,
    },
  });
  revalidatePath("/subject/lessons");
}

export async function deleteLessonSession(id: number) {
  await requireSession();
  await db.lessonSession.delete({ where: { id } });
  revalidatePath("/subject/lessons");
}
