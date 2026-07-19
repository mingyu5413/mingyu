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
});

export async function getHomeworkList(subjectClassId: number) {
  await requireSession();
  return db.homework.findMany({
    where: { subjectClassId },
    orderBy: { dueDate: "desc" },
  });
}

export async function createHomework(
  subjectClassId: number,
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
  });
  if (!parsed.success) return { error: firstZodError(parsed.error) };

  await db.homework.create({
    data: {
      subjectClassId,
      ...parsed.data,
      assignedDate: new Date(parsed.data.assignedDate),
      dueDate: new Date(parsed.data.dueDate),
    },
  });
  revalidatePath("/subject");
}

export async function deleteHomework(subjectClassId: number, id: number) {
  await requireSession();
  await db.homework.delete({ where: { id } });
  revalidatePath("/subject");
  redirect(`/subject`);
}

export async function getSubmissionRows(homeworkId: number) {
  await requireSession();
  const homework = await db.homework.findUnique({ where: { id: homeworkId } });
  if (!homework) return { homework: null, rows: [] };

  const students = await db.subjectStudent.findMany({
    where: { subjectClassId: homework.subjectClassId },
    orderBy: { number: "asc" },
  });
  const submissions = await db.homeworkSubmission.findMany({ where: { homeworkId } });
  const byStudent = new Map(submissions.map((s) => [s.subjectStudentId, s]));

  return {
    homework,
    rows: students.map((student) => ({
      student,
      submission: byStudent.get(student.id) ?? null,
    })),
  };
}

export async function toggleSubmission(homeworkId: number, subjectStudentId: number) {
  await requireSession();
  const existing = await db.homeworkSubmission.findUnique({
    where: { homeworkId_subjectStudentId: { homeworkId, subjectStudentId } },
  });
  const submitted = !(existing?.submitted ?? false);

  await db.homeworkSubmission.upsert({
    where: { homeworkId_subjectStudentId: { homeworkId, subjectStudentId } },
    update: { submitted, submittedDate: submitted ? new Date() : null },
    create: {
      homeworkId,
      subjectStudentId,
      submitted,
      submittedDate: submitted ? new Date() : null,
    },
  });
  revalidatePath(`/subject`);
}

export async function setSubmissionNote(
  homeworkId: number,
  subjectStudentId: number,
  formData: FormData
) {
  await requireSession();
  const note = String(formData.get("note") ?? "");

  await db.homeworkSubmission.upsert({
    where: { homeworkId_subjectStudentId: { homeworkId, subjectStudentId } },
    update: { note },
    create: { homeworkId, subjectStudentId, note },
  });
  revalidatePath(`/subject`);
}
