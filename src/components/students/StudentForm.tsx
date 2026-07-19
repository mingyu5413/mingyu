"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ActionState = { error?: string } | undefined;
type Action = (prevState: ActionState, formData: FormData) => Promise<ActionState>;

type StudentFormValues = {
  academicYear: number;
  number: number;
  name: string;
  gender?: string | null;
  birthdate?: Date | null;
  phone?: string | null;
  guardianPhone?: string | null;
  memo?: string | null;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "저장 중..." : label}
    </Button>
  );
}

export function StudentForm({
  action,
  defaultValues,
  submitLabel = "저장",
}: {
  action: Action;
  defaultValues?: StudentFormValues;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const currentYear = new Date().getFullYear();
  const birthdateValue = defaultValues?.birthdate
    ? new Date(defaultValues.birthdate).toISOString().slice(0, 10)
    : "";

  return (
    <form action={formAction} className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="academicYear">학년도</Label>
        <Input
          id="academicYear"
          name="academicYear"
          type="number"
          defaultValue={defaultValues?.academicYear ?? currentYear}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="number">번호</Label>
        <Input
          id="number"
          name="number"
          type="number"
          defaultValue={defaultValues?.number}
          required
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="name">이름</Label>
        <Input id="name" name="name" defaultValue={defaultValues?.name} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="gender">성별</Label>
        <Input id="gender" name="gender" defaultValue={defaultValues?.gender ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birthdate">생년월일</Label>
        <Input id="birthdate" name="birthdate" type="date" defaultValue={birthdateValue} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="phone">학생 연락처</Label>
        <Input id="phone" name="phone" defaultValue={defaultValues?.phone ?? ""} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="guardianPhone">보호자 연락처</Label>
        <Input
          id="guardianPhone"
          name="guardianPhone"
          defaultValue={defaultValues?.guardianPhone ?? ""}
        />
      </div>
      <div className="col-span-2 space-y-2">
        <Label htmlFor="memo">메모</Label>
        <Input id="memo" name="memo" defaultValue={defaultValues?.memo ?? ""} />
      </div>
      {state?.error && (
        <p className="col-span-2 text-sm text-destructive">{state.error}</p>
      )}
      <div className="col-span-2">
        <SubmitButton label={submitLabel} />
      </div>
    </form>
  );
}
