"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ActionState = { error?: string } | undefined;
type Action = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "저장 중..." : label}
    </Button>
  );
}

export function PersonalTaskForm({
  action,
  defaultValues,
  submitLabel = "저장",
}: {
  action: Action;
  defaultValues?: { title?: string; content?: string | null; date?: Date; dueDate?: Date | null };
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const today = new Date().toISOString().slice(0, 10);
  const dateValue = defaultValues?.date
    ? new Date(defaultValues.date).toISOString().slice(0, 10)
    : today;
  const dueDateValue = defaultValues?.dueDate
    ? new Date(defaultValues.dueDate).toISOString().slice(0, 10)
    : "";

  return (
    <form action={formAction} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="title">제목</Label>
        <Input id="title" name="title" defaultValue={defaultValues?.title} required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="date">일정 날짜</Label>
          <Input id="date" name="date" type="date" defaultValue={dateValue} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="dueDate">마감기한 (선택)</Label>
          <Input id="dueDate" name="dueDate" type="date" defaultValue={dueDateValue} />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="content">메모</Label>
        <Textarea id="content" name="content" rows={4} defaultValue={defaultValues?.content ?? ""} />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton label={submitLabel} />
    </form>
  );
}
