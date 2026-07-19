"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { firstZodError } from "@/lib/actions/shared";

const schema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  assignedDate: z.string().min(1, "부여일을 입력해주세요."),
  dueDate: z.string().min(1, "마감일을 입력해주세요."),
  description: z.string().min(1, "내용을 입력해주세요."),
  semester: z.coerce.number().int().optional(),
  academicYear: z.coerce.number().int().min(2000).max(2100),
});

export async function getHomeworkList() {
  await requireSession();
  return db.homework.findMany({ orderBy: { dueDate: "desc" } });
}

export async function createHomework(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = schema.safeParse({
    title: formData.get("title"),
    assignedDate: formData.get("assignedDate"),
    dueDate: formData.get("dueDate"),
    description: formData.get("description"),
    semester: formData.get("semester") || undefined,
    academicYear: formData.get("academicYear"),
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.homework.create({
    data: {
      ...parsed.data,
      assignedDate: new Date(parsed.data.assignedDate),
      dueDate: new Date(parsed.data.dueDate),
    },
  });
  revalidatePath("/subject/homework");
}

export async function deleteHomework(id: number) {
  await requireSession();
  await db.homework.delete({ where: { id } });
  revalidatePath("/subject/homework");
  redirect("/subject/homework");
}

export async function getSubmissionRows(homeworkId: number) {
  await requireSession();
  const homework = await db.homework.findUnique({ where: { id: homeworkId } });
  if (!homework) return { homework: null, rows: [] };

  const students = await db.student.findMany({
    where: { academicYear: homework.academicYear },
    orderBy: { number: "asc" },
  });
  const submissions = await db.homeworkSubmission.findMany({ where: { homeworkId } });
  const byStudent = new Map(submissions.map((s) => [s.studentId, s]));

  return {
    homework,
    rows: students.map((student) => ({
      student,
      submission: byStudent.get(student.id) ?? null,
    })),
  };
}

export async function toggleSubmission(homeworkId: number, studentId: number) {
  await requireSession();
  const existing = await db.homeworkSubmission.findUnique({
    where: { homeworkId_studentId: { homeworkId, studentId } },
  });
  const submitted = !(existing?.submitted ?? false);

  await db.homeworkSubmission.upsert({
    where: { homeworkId_studentId: { homeworkId, studentId } },
    update: { submitted, submittedDate: submitted ? new Date() : null },
    create: { homeworkId, studentId, submitted, submittedDate: submitted ? new Date() : null },
  });
  revalidatePath(`/subject/homework/${homeworkId}`);
}

export async function setSubmissionNote(
  homeworkId: number,
  studentId: number,
  formData: FormData
) {
  await requireSession();
  const note = String(formData.get("note") ?? "");

  await db.homeworkSubmission.upsert({
    where: { homeworkId_studentId: { homeworkId, studentId } },
    update: { note },
    create: { homeworkId, studentId, note },
  });
  revalidatePath(`/subject/homework/${homeworkId}`);
}
