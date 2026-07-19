"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { dateContentSchema, firstZodError } from "@/lib/actions/shared";
import { z } from "zod";

const schema = dateContentSchema.extend({
  title: z.string().min(1, "제목을 입력해주세요."),
  category: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.safeParse({
    date: formData.get("date"),
    content: formData.get("content"),
    title: formData.get("title"),
    category: formData.get("category") || undefined,
  });
}

export async function getNotices() {
  await requireSession();
  return db.classNotice.findMany({ orderBy: { date: "desc" } });
}

export async function createNotice(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.classNotice.create({
    data: {
      date: new Date(parsed.data.date),
      content: parsed.data.content,
      title: parsed.data.title,
      category: parsed.data.category || "공지",
    },
  });
  revalidatePath("/homeroom/notices");
}

export async function updateNotice(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.classNotice.update({
    where: { id },
    data: {
      date: new Date(parsed.data.date),
      content: parsed.data.content,
      title: parsed.data.title,
      category: parsed.data.category || "공지",
    },
  });
  revalidatePath("/homeroom/notices");
}

export async function deleteNotice(id: number) {
  await requireSession();
  await db.classNotice.delete({ where: { id } });
  revalidatePath("/homeroom/notices");
}
