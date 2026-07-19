"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ActionState = { error?: string } | undefined;
type Action = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} size="sm">
      {pending ? "저장 중..." : label}
    </Button>
  );
}

export function SubjectStudentForm({
  action,
  defaultValues,
  submitLabel = "저장",
}: {
  action: Action;
  defaultValues?: { number?: number; name?: string };
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, undefined);

  return (
    <form action={formAction} className="grid grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label htmlFor="number">번호</Label>
        <Input id="number" name="number" type="number" defaultValue={defaultValues?.number} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="name">이름</Label>
        <Input id="name" name="name" defaultValue={defaultValues?.name} required />
      </div>
      {state?.error && <p className="col-span-2 text-sm text-destructive">{state.error}</p>}
      <div className="col-span-2">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
