"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { dateContentSchema, firstZodError } from "@/lib/actions/shared";

const schema = dateContentSchema.extend({
  clubName: z.string().min(1, "동아리명을 입력해주세요."),
  semester: z.coerce.number().int().optional(),
});

function parse(formData: FormData) {
  return schema.safeParse({
    date: formData.get("date"),
    content: formData.get("content"),
    clubName: formData.get("clubName"),
    semester: formData.get("semester") || undefined,
  });
}

export async function getClubActivities(studentId: number) {
  await requireSession();
  return db.clubActivity.findMany({ where: { studentId }, orderBy: { date: "desc" } });
}

export async function createClubActivity(
  studentId: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.clubActivity.create({
    data: { studentId, date: new Date(parsed.data.date), content: parsed.data.content, clubName: parsed.data.clubName, semester: parsed.data.semester },
  });
  revalidatePath(`/homeroom/students/${studentId}/club`);
}

export async function updateClubActivity(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  const item = await db.clubActivity.update({
    where: { id },
    data: { date: new Date(parsed.data.date), content: parsed.data.content, clubName: parsed.data.clubName, semester: parsed.data.semester },
  });
  revalidatePath(`/homeroom/students/${item.studentId}/club`);
}

export async function deleteClubActivity(id: number) {
  await requireSession();
  const item = await db.clubActivity.delete({ where: { id } });
  revalidatePath(`/homeroom/students/${item.studentId}/club`);
}
