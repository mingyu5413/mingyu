"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";

export async function resetAllData(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  await requireSession();

  const confirmation = String(formData.get("confirmation") ?? "");
  if (confirmation !== "초기화합니다") {
    return { error: "확인 문구가 정확하지 않습니다." };
  }

  await db.student.deleteMany();
  await db.subject.deleteMany();
  await db.classNotice.deleteMany();
  await db.personalTask.deleteMany();

  redirect("/homeroom");
}
