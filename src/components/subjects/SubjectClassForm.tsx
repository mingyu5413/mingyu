"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createSubjectClass } from "@/lib/actions/subjectClasses";
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

export function SubjectClassForm({ subjectId }: { subjectId: number }) {
  const action = createSubjectClass.bind(null, subjectId);
  const [state, formAction] = useActionState(action, undefined);
  const currentYear = new Date().getFullYear();

  return (
    <form action={formAction} className="space-y-3">
      <div className="space-y-1">
        <Label htmlFor="academicYear">학년도</Label>
        <Input
          id="academicYear"
          name="academicYear"
          type="number"
          defaultValue={currentYear}
          required
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="label">반 이름</Label>
        <Input id="label" name="label" placeholder="예: 2-3, 2-가" required />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
