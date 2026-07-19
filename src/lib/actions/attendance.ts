"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import type { AttendanceStatus } from "@/generated/prisma/enums";

function toDateOnly(dateStr: string) {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

export async function getAttendanceForDate(academicYear: number, dateStr: string) {
  await requireSession();
  const date = toDateOnly(dateStr);

  const students = await db.student.findMany({
    where: { academicYear },
    orderBy: { number: "asc" },
  });
  const records = await db.attendance.findMany({ where: { date } });
  const byStudent = new Map(records.map((r) => [r.studentId, r]));

  return students.map((student) => ({
    student,
    attendance: byStudent.get(student.id) ?? null,
  }));
}

export async function setAttendanceStatus(
  studentId: number,
  dateStr: string,
  status: AttendanceStatus
) {
  await requireSession();
  const date = toDateOnly(dateStr);

  await db.attendance.upsert({
    where: { studentId_date: { studentId, date } },
    update: { status },
    create: { studentId, date, status },
  });

  revalidatePath("/homeroom/attendance");
}

export async function setAttendanceNote(
  studentId: number,
  dateStr: string,
  formData: FormData
) {
  await requireSession();
  const date = toDateOnly(dateStr);
  const note = String(formData.get("note") ?? "");

  await db.attendance.upsert({
    where: { studentId_date: { studentId, date } },
    update: { note },
    create: { studentId, date, status: "PRESENT", note },
  });

  revalidatePath("/homeroom/attendance");
}

export async function getMonthlyAttendanceStats(
  academicYear: number,
  year: number,
  month: number
) {
  await requireSession();
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));

  const students = await db.student.findMany({
    where: { academicYear },
    orderBy: { number: "asc" },
  });
  const records = await db.attendance.findMany({
    where: { date: { gte: start, lt: end } },
  });

  const statuses: AttendanceStatus[] = [
    "PRESENT",
    "LATE",
    "EARLY_LEAVE",
    "ABSENT_SICK",
    "ABSENT_UNEXCUSED",
    "ABSENT_ETC",
  ];

  return students.map((student) => {
    const studentRecords = records.filter((r) => r.studentId === student.id);
    const counts = Object.fromEntries(
      statuses.map((s) => [s, studentRecords.filter((r) => r.status === s).length])
    ) as Record<AttendanceStatus, number>;
    return { student, counts };
  });
}
