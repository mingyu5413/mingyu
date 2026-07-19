"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { firstZodError } from "@/lib/actions/shared";

const schema = z.object({
  academicYear: z.coerce.number().int().min(2000).max(2100),
  label: z.string().min(1, "반 이름을 입력해주세요."),
});

export async function getSubjectClasses(subjectId: number) {
  await requireSession();
  return db.subjectClass.findMany({
    where: { subjectId },
    orderBy: [{ academicYear: "desc" }, { label: "asc" }],
  });
}

export async function getSubjectClass(id: number) {
  await requireSession();
  return db.subjectClass.findUnique({ where: { id }, include: { subject: true } });
}

export async function createSubjectClass(
  subjectId: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = schema.safeParse({
    academicYear: formData.get("academicYear"),
    label: formData.get("label"),
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  try {
    await db.subjectClass.create({ data: { subjectId, ...parsed.data } });
  } catch {
    return { error: "이미 같은 학년도/반 이름이 있습니다." };
  }
  revalidatePath(`/subject/${subjectId}`);
}

export async function deleteSubjectClass(subjectId: number, id: number) {
  await requireSession();
  await db.subjectClass.delete({ where: { id } });
  revalidatePath(`/subject/${subjectId}`);
}
