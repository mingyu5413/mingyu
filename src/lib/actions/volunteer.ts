"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { dateContentSchema, firstZodError } from "@/lib/actions/shared";

const schema = dateContentSchema.extend({
  place: z.string().min(1, "장소를 입력해주세요."),
  activityType: z.string().min(1, "활동 유형을 입력해주세요."),
  hours: z.coerce.number().min(0),
  semester: z.coerce.number().int().optional(),
});

function parse(formData: FormData) {
  return schema.safeParse({
    date: formData.get("date"),
    content: formData.get("content"),
    place: formData.get("place"),
    activityType: formData.get("activityType"),
    hours: formData.get("hours"),
    semester: formData.get("semester") || undefined,
  });
}

export async function getVolunteerActivities(studentId: number) {
  await requireSession();
  return db.volunteerActivity.findMany({ where: { studentId }, orderBy: { date: "desc" } });
}

export async function createVolunteerActivity(
  studentId: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.volunteerActivity.create({
    data: { studentId, date: new Date(parsed.data.date), content: parsed.data.content, place: parsed.data.place, activityType: parsed.data.activityType, hours: parsed.data.hours, semester: parsed.data.semester },
  });
  revalidatePath(`/homeroom/students/${studentId}/volunteer`);
}

export async function updateVolunteerActivity(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  const item = await db.volunteerActivity.update({
    where: { id },
    data: { date: new Date(parsed.data.date), content: parsed.data.content, place: parsed.data.place, activityType: parsed.data.activityType, hours: parsed.data.hours, semester: parsed.data.semester },
  });
  revalidatePath(`/homeroom/students/${item.studentId}/volunteer`);
}

export async function deleteVolunteerActivity(id: number) {
  await requireSession();
  const item = await db.volunteerActivity.delete({ where: { id } });
  revalidatePath(`/homeroom/students/${item.studentId}/volunteer`);
}
