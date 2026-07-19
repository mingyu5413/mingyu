"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { firstZodError } from "@/lib/actions/shared";

const schema = z.object({
  academicYear: z.coerce.number().int().min(2000).max(2100),
  semester: z.coerce.number().int().min(1).max(2),
  content: z.string().min(1, "내용을 입력해주세요."),
});

function parse(formData: FormData) {
  return schema.safeParse({
    academicYear: formData.get("academicYear"),
    semester: formData.get("semester"),
    content: formData.get("content"),
  });
}

export async function getBehaviorCharacteristics(studentId: number) {
  await requireSession();
  return db.behaviorCharacteristic.findMany({
    where: { studentId },
    orderBy: [{ academicYear: "desc" }, { semester: "desc" }],
  });
}

export async function createBehaviorCharacteristic(
  studentId: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  try {
    await db.behaviorCharacteristic.create({
      data: { studentId, ...parsed.data },
    });
  } catch {
    return { error: "이미 해당 학년도/학기의 기록이 있습니다." };
  }
  revalidatePath(`/homeroom/students/${studentId}/behavior`);
}

export async function updateBehaviorCharacteristic(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  const item = await db.behaviorCharacteristic.update({
    where: { id },
    data: { ...parsed.data },
  });
  revalidatePath(`/homeroom/students/${item.studentId}/behavior`);
}

export async function deleteBehaviorCharacteristic(id: number) {
  await requireSession();
  const item = await db.behaviorCharacteristic.delete({ where: { id } });
  revalidatePath(`/homeroom/students/${item.studentId}/behavior`);
}
