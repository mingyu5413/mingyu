"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { firstZodError } from "@/lib/actions/shared";

const schema = z.object({
  number: z.coerce.number().int().min(1).max(999),
  name: z.string().min(1, "이름을 입력해주세요."),
});

export async function getSubjectStudents(subjectClassId: number) {
  await requireSession();
  return db.subjectStudent.findMany({
    where: { subjectClassId },
    orderBy: { number: "asc" },
  });
}

export async function getSubjectStudent(id: number) {
  await requireSession();
  return db.subjectStudent.findUnique({ where: { id } });
}

export async function createSubjectStudent(
  subjectClassId: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = schema.safeParse({
    number: formData.get("number"),
    name: formData.get("name"),
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  try {
    await db.subjectStudent.create({ data: { subjectClassId, ...parsed.data } });
  } catch {
    return { error: "이미 같은 번호의 학생이 있습니다." };
  }
  revalidatePath(`/subject`);
}

export async function updateSubjectStudent(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = schema.safeParse({
    number: formData.get("number"),
    name: formData.get("name"),
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  try {
    await db.subjectStudent.update({ where: { id }, data: parsed.data });
  } catch {
    return { error: "이미 같은 번호의 학생이 있습니다." };
  }
  revalidatePath(`/subject`);
}

export async function deleteSubjectStudent(id: number) {
  await requireSession();
  await db.subjectStudent.delete({ where: { id } });
  revalidatePath(`/subject`);
}
