"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createAssessment } from "@/lib/actions/assessments";
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

export function AssessmentForm() {
  const [state, formAction] = useActionState(createAssessment, undefined);
  const currentYear = new Date().getFullYear();

  return (
    <form action={formAction} className="grid grid-cols-2 gap-3">
      <div className="col-span-2 space-y-1">
        <Label htmlFor="title">제목</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="type">유형</Label>
        <select
          id="type"
          name="type"
          defaultValue="WRITTEN"
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm dark:bg-input/30"
        >
          <option value="WRITTEN">지필평가</option>
          <option value="PERFORMANCE">수행평가</option>
        </select>
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
      <div className="space-y-1">
        <Label htmlFor="semester">학기</Label>
        <Input id="semester" name="semester" type="number" min={1} max={2} defaultValue={1} required />
      </div>
      <div className="col-span-2 space-y-1">
        <Label htmlFor="academicYear">학년도</Label>
        <Input
          id="academicYear"
          name="academicYear"
          type="number"
          defaultValue={currentYear}
          required
        />
      </div>
      {state?.error && <p className="col-span-2 text-sm text-destructive">{state.error}</p>}
      <div className="col-span-2">
        <SubmitButton />
      </div>
    </form>
  );
}
