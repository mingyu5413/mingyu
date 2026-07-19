"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { firstZodError } from "@/lib/actions/shared";

const schema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  content: z.string().optional(),
  date: z.string().min(1, "날짜를 입력해주세요."),
  dueDate: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.safeParse({
    title: formData.get("title"),
    content: formData.get("content") || undefined,
    date: formData.get("date"),
    dueDate: formData.get("dueDate") || undefined,
  });
}

export async function getPersonalTasks() {
  await requireSession();
  return db.personalTask.findMany({ orderBy: [{ done: "asc" }, { dueDate: "asc" }] });
}

export async function createPersonalTask(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.personalTask.create({
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      date: new Date(parsed.data.date),
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
    },
  });
  revalidatePath("/personal");
}

export async function updatePersonalTask(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.personalTask.update({
    where: { id },
    data: {
      title: parsed.data.title,
      content: parsed.data.content,
      date: new Date(parsed.data.date),
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
    },
  });
  revalidatePath("/personal");
}

export async function toggleTaskDone(id: number) {
  await requireSession();
  const task = await db.personalTask.findUnique({ where: { id } });
  if (!task) return;
  await db.personalTask.update({ where: { id }, data: { done: !task.done } });
  revalidatePath("/personal");
}

export async function deletePersonalTask(id: number) {
  await requireSession();
  await db.personalTask.delete({ where: { id } });
  revalidatePath("/personal");
}
