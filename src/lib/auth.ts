"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export async function requireSession() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    redirect("/login");
  }
  return session;
}

export async function login(
  _prevState: { error?: string } | undefined,
  formData: FormData
) {
  const password = formData.get("password");

  if (typeof password !== "string" || password.length === 0) {
    return { error: "비밀번호를 입력해주세요." };
  }

  const hash = process.env.TEACHER_PASSWORD_HASH;
  if (!hash) {
    return { error: "서버에 비밀번호가 설정되어 있지 않습니다." };
  }

  const valid = await bcrypt.compare(password, hash);
  if (!valid) {
    return { error: "비밀번호가 올바르지 않습니다." };
  }

  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();

  redirect("/homeroom");
}

export async function logout() {
  const session = await getSession();
  session.destroy();
  redirect("/login");
}
