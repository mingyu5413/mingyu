"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Student, LessonSession } from "@/generated/prisma/client";

type ActionState = { error?: string } | undefined;
type Action = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

const selectClass =
  "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm dark:bg-input/30";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "저장 중..." : label}
    </Button>
  );
}

export function ClassBehaviorNoteForm({
  action,
  students,
  lessonSessions,
  defaultValues,
  submitLabel = "저장",
}: {
  action: Action;
  students?: Student[];
  lessonSessions: LessonSession[];
  defaultValues?: { date?: Date; lessonSessionId?: number | null; content?: string };
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const dateValue = defaultValues?.date
    ? new Date(defaultValues.date).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-3">
      {students && (
        <div className="space-y-1">
          <Label htmlFor="studentId">학생</Label>
          <select id="studentId" name="studentId" required defaultValue="" className={selectClass}>
            <option value="" disabled>
              학생 선택
            </option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.number}번 {s.name}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="date">날짜</Label>
          <Input id="date" name="date" type="date" defaultValue={dateValue} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="lessonSessionId">관련 차시 (선택)</Label>
          <select
            id="lessonSessionId"
            name="lessonSessionId"
            defaultValue={defaultValues?.lessonSessionId ?? ""}
            className={selectClass}
          >
            <option value="">선택 안 함</option>
            {lessonSessions.map((l) => (
              <option key={l.id} value={l.id}>
                {new Date(l.date).toLocaleDateString("ko-KR")} · {l.unit}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          name="content"
          rows={3}
          defaultValue={defaultValues?.content}
          required
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton label={submitLabel} />
    </form>
  );
}
