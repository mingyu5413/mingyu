"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { dateContentSchema, firstZodError } from "@/lib/actions/shared";

const schema = dateContentSchema.extend({
  title: z.string().min(1, "제목을 입력해주세요."),
  semester: z.coerce.number().int().optional(),
});

function parse(formData: FormData) {
  return schema.safeParse({
    date: formData.get("date"),
    content: formData.get("content"),
    title: formData.get("title"),
    semester: formData.get("semester") || undefined,
  });
}

export async function getAutonomousActivities(studentId: number) {
  await requireSession();
  return db.autonomousActivity.findMany({ where: { studentId }, orderBy: { date: "desc" } });
}

export async function createAutonomousActivity(
  studentId: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.autonomousActivity.create({
    data: { studentId, date: new Date(parsed.data.date), content: parsed.data.content, title: parsed.data.title, semester: parsed.data.semester },
  });
  revalidatePath(`/homeroom/students/${studentId}/autonomous`);
}

export async function updateAutonomousActivity(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  const item = await db.autonomousActivity.update({
    where: { id },
    data: { date: new Date(parsed.data.date), content: parsed.data.content, title: parsed.data.title, semester: parsed.data.semester },
  });
  revalidatePath(`/homeroom/students/${item.studentId}/autonomous`);
}

export async function deleteAutonomousActivity(id: number) {
  await requireSession();
  const item = await db.autonomousActivity.delete({ where: { id } });
  revalidatePath(`/homeroom/students/${item.studentId}/autonomous`);
}
