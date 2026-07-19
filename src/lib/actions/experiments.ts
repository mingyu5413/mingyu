"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { firstZodError } from "@/lib/actions/shared";

const schema = z.object({
  date: z.string().min(1, "날짜를 입력해주세요."),
  title: z.string().min(1, "제목을 입력해주세요."),
  unit: z.string().optional(),
  procedureSummary: z.string().optional(),
  resultsSummary: z.string().min(1, "결과를 입력해주세요."),
  safetyNotes: z.string().optional(),
});

function parse(formData: FormData) {
  return schema.safeParse({
    date: formData.get("date"),
    title: formData.get("title"),
    unit: formData.get("unit") || undefined,
    procedureSummary: formData.get("procedureSummary") || undefined,
    resultsSummary: formData.get("resultsSummary"),
    safetyNotes: formData.get("safetyNotes") || undefined,
  });
}

export async function getExperiments(subjectClassId: number) {
  await requireSession();
  return db.experiment.findMany({
    where: { subjectClassId },
    orderBy: { date: "desc" },
  });
}

export async function createExperiment(
  subjectClassId: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.experiment.create({
    data: { subjectClassId, ...parsed.data, date: new Date(parsed.data.date) },
  });
  revalidatePath("/subject");
}

export async function updateExperiment(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parse(formData);
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.experiment.update({
    where: { id },
    data: { ...parsed.data, date: new Date(parsed.data.date) },
  });
  revalidatePath("/subject");
}

export async function deleteExperiment(id: number) {
  await requireSession();
  await db.experiment.delete({ where: { id } });
  revalidatePath("/subject");
}
