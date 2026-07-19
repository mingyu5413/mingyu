"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ActionState = { error?: string } | undefined;
type Action = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "저장 중..." : "추가"}
    </Button>
  );
}

export function AssessmentForm({
  action,
  type,
}: {
  action: Action;
  type: "WRITTEN" | "PERFORMANCE";
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="grid grid-cols-2 gap-3">
      <input type="hidden" name="type" value={type} />
      <div className="col-span-2 space-y-1">
        <Label htmlFor="title">{type === "WRITTEN" ? "지필평가명" : "수행평가명"}</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="date">날짜</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="maxScore">만점</Label>
        <Input id="maxScore" name="maxScore" type="number" defaultValue={100} required />
      </div>
      <div className="col-span-2 space-y-1">
        <Label htmlFor="semester">학기</Label>
        <Input id="semester" name="semester" type="number" min={1} max={2} defaultValue={1} required />
      </div>
      {state?.error && <p className="col-span-2 text-sm text-destructive">{state.error}</p>}
      <div className="col-span-2">
        <SubmitButton />
      </div>
    </form>
  );
}
