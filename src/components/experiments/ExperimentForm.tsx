"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Experiment } from "@/generated/prisma/client";

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

export function ExperimentForm({
  action,
  defaultValues,
  submitLabel = "저장",
}: {
  action: Action;
  defaultValues?: Experiment;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const dateValue = defaultValues
    ? new Date(defaultValues.date).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="date">날짜</Label>
          <Input id="date" name="date" type="date" defaultValue={dateValue} required />
        </div>
        <div className="space-y-1">
          <Label htmlFor="unit">단원</Label>
          <Input id="unit" name="unit" defaultValue={defaultValues?.unit ?? ""} />
        </div>
        <div className="col-span-2 space-y-1">
          <Label htmlFor="title">제목</Label>
          <Input id="title" name="title" defaultValue={defaultValues?.title} required />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="procedureSummary">실험 과정 요약</Label>
        <Textarea
          id="procedureSummary"
          name="procedureSummary"
          rows={3}
          defaultValue={defaultValues?.procedureSummary ?? ""}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="resultsSummary">결과</Label>
        <Textarea
          id="resultsSummary"
          name="resultsSummary"
          rows={3}
          defaultValue={defaultValues?.resultsSummary ?? ""}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="safetyNotes">안전 유의사항</Label>
        <Textarea
          id="safetyNotes"
          name="safetyNotes"
          rows={2}
          defaultValue={defaultValues?.safetyNotes ?? ""}
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton label={submitLabel} />
    </form>
  );
}
