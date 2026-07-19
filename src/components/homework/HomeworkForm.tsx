"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createHomework } from "@/lib/actions/homework";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? "저장 중..." : "추가"}
    </Button>
  );
}

export function HomeworkForm() {
  const [state, formAction] = useActionState(createHomework, undefined);
  const today = new Date().toISOString().slice(0, 10);
  const currentYear = new Date().getFullYear();

  return (
    <form action={formAction} className="grid grid-cols-2 gap-3">
      <div className="col-span-2 space-y-1">
        <Label htmlFor="title">제목</Label>
        <Input id="title" name="title" required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="assignedDate">부여일</Label>
        <Input id="assignedDate" name="assignedDate" type="date" defaultValue={today} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="dueDate">마감일</Label>
        <Input id="dueDate" name="dueDate" type="date" defaultValue={today} required />
      </div>
      <div className="col-span-2 space-y-1">
        <Label htmlFor="description">내용</Label>
        <Textarea id="description" name="description" rows={3} required />
      </div>
      <div className="space-y-1">
        <Label htmlFor="semester">학기</Label>
        <Input id="semester" name="semester" type="number" min={1} max={2} defaultValue={1} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="academicYear">학년도</Label>
        <Input id="academicYear" name="academicYear" type="number" defaultValue={currentYear} required />
      </div>
      {state?.error && <p className="col-span-2 text-sm text-destructive">{state.error}</p>}
      <div className="col-span-2">
        <SubmitButton />
      </div>
    </form>
  );
}
