"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

const studentSchema = z.object({
  academicYear: z.coerce.number().int().min(2000).max(2100),
  number: z.coerce.number().int().min(1).max(999),
  name: z.string().min(1, "이름을 입력해주세요."),
  gender: z.string().optional(),
  birthdate: z.string().optional(),
  phone: z.string().optional(),
  guardianPhone: z.string().optional(),
  memo: z.string().optional(),
});

function parseStudentForm(formData: FormData) {
  const raw = {
    academicYear: formData.get("academicYear"),
    number: formData.get("number"),
    name: formData.get("name"),
    gender: formData.get("gender") || undefined,
    birthdate: formData.get("birthdate") || undefined,
    phone: formData.get("phone") || undefined,
    guardianPhone: formData.get("guardianPhone") || undefined,
    memo: formData.get("memo") || undefined,
  };
  return studentSchema.safeParse(raw);
}

export async function getStudents(academicYear?: number, query?: string) {
  await requireSession();
  return db.student.findMany({
    where: {
      academicYear: academicYear ?? undefined,
      name: query ? { contains: query, mode: "insensitive" } : undefined,
    },
    orderBy: [{ academicYear: "desc" }, { number: "asc" }],
  });
}

export async function getStudent(id: number) {
  await requireSession();
  return db.student.findUnique({ where: { id } });
}

export async function createStudent(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parseStudentForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  try {
    await db.student.create({
      data: {
        ...parsed.data,
        birthdate: parsed.data.birthdate ? new Date(parsed.data.birthdate) : undefined,
      },
    });
  } catch {
    return { error: "이미 같은 학년도/번호의 학생이 있습니다." };
  }

  revalidatePath("/homeroom/students");
  redirect("/homeroom/students");
}

export async function updateStudent(
  id: number,
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();
  const parsed = parseStudentForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "입력값을 확인해주세요." };
  }

  try {
    await db.student.update({
      where: { id },
      data: {
        ...parsed.data,
        birthdate: parsed.data.birthdate ? new Date(parsed.data.birthdate) : null,
      },
    });
  } catch {
    return { error: "이미 같은 학년도/번호의 학생이 있습니다." };
  }

  revalidatePath("/homeroom/students");
  revalidatePath(`/homeroom/students/${id}`);
  redirect("/homeroom/students");
}

export async function deleteStudent(id: number) {
  await requireSession();
  await db.student.delete({ where: { id } });
  revalidatePath("/homeroom/students");
  redirect("/homeroom/students");
}
