"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { firstZodError } from "@/lib/actions/shared";

const schema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  type: z.enum(["WRITTEN", "PERFORMANCE"]),
  date: z.string().min(1, "날짜를 입력해주세요."),
  maxScore: z.coerce.number().positive(),
  semester: z.coerce.number().int().min(1).max(2),
});

export async function getAssessments(subjectClassId: number) {
  await requireSession();
  return db.assessment.findMany({
    where: { subjectClassId },
    orderBy: { date: "desc" },
  });
}

export async function getAssessment(id: number) {
  await requireSession();
  return db.assessment.findUnique({ where: { id } });
}

export async function createAssessment(
  subjectClassId: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = schema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    date: formData.get("date"),
    maxScore: formData.get("maxScore"),
    semester: formData.get("semester"),
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.assessment.create({
    data: { subjectClassId, ...parsed.data, date: new Date(parsed.data.date) },
  });
  revalidatePath(`/subject`);
}

export async function deleteAssessment(subjectClassId: number, id: number) {
  await requireSession();
  await db.assessment.delete({ where: { id } });
  revalidatePath(`/subject`);
  redirect(`/subject`);
}

export async function getScoreRows(assessmentId: number) {
  await requireSession();
  const assessment = await db.assessment.findUnique({ where: { id: assessmentId } });
  if (!assessment) return { assessment: null, rows: [] };

  const students = await db.subjectStudent.findMany({
    where: { subjectClassId: assessment.subjectClassId },
    orderBy: { number: "asc" },
  });
  const scores = await db.score.findMany({ where: { assessmentId } });
  const byStudent = new Map(scores.map((s) => [s.subjectStudentId, s]));

  return {
    assessment,
    rows: students.map((student) => ({
      student,
      score: byStudent.get(student.id) ?? null,
    })),
  };
}

export async function setScore(
  assessmentId: number,
  subjectStudentId: number,
  formData: FormData
) {
  await requireSession();
  const rawScore = formData.get("score");
  const note = String(formData.get("note") ?? "");
  const score = rawScore === "" || rawScore === null ? null : Number(rawScore);

  await db.score.upsert({
    where: { assessmentId_subjectStudentId: { assessmentId, subjectStudentId } },
    update: { score, note },
    create: { assessmentId, subjectStudentId, score, note },
  });
  revalidatePath(`/subject`);
}
