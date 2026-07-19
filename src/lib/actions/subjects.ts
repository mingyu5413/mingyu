"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { firstZodError } from "@/lib/actions/shared";

const schema = z.object({
  name: z.string().min(1, "과목명을 입력해주세요."),
});

export async function getSubjects() {
  await requireSession();
  return db.subject.findMany({ orderBy: { createdAt: "asc" } });
}

export async function getSubject(id: number) {
  await requireSession();
  return db.subject.findUnique({ where: { id } });
}

export async function createSubject(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = schema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.subject.create({ data: parsed.data });
  revalidatePath("/subject");
}

export async function deleteSubject(id: number) {
  await requireSession();
  await db.subject.delete({ where: { id } });
  revalidatePath("/subject");
}
