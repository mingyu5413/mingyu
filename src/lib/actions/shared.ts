import { z } from "zod";

export const dateContentSchema = z.object({
  date: z.string().min(1, "날짜를 입력해주세요."),
  content: z.string().min(1, "내용을 입력해주세요."),
});

export function firstZodError(error: z.ZodError) {
  return error.issues[0]?.message ?? "입력값을 확인해주세요.";
}
