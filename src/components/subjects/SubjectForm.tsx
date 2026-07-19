"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createSubject } from "@/lib/actions/subjects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "저장 중..." : "추가"}
    </Button>
  );
}

export function SubjectForm() {
  const [state, formAction] = useActionState(createSubject, undefined);

  return (
    <form action={formAction} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="name">과목명</Label>
        <Input id="name" name="name" placeholder="예: 물리학, 역학과 에너지" required />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
