"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getNeisByteLength } from "@/lib/utils";

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

export function YearSemesterForm({
  action,
  defaultValues,
  submitLabel = "저장",
  contentLabel = "내용",
  contentRows = 6,
  showByteCounter = false,
}: {
  action: Action;
  defaultValues?: { academicYear?: number; semester?: number; content?: string };
  submitLabel?: string;
  contentLabel?: string;
  contentRows?: number;
  showByteCounter?: boolean;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const currentYear = new Date().getFullYear();
  const [content, setContent] = useState(defaultValues?.content ?? "");

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="academicYear">학년도</Label>
          <Input
            id="academicYear"
            name="academicYear"
            type="number"
            defaultValue={defaultValues?.academicYear ?? currentYear}
            required
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="semester">학기</Label>
          <Input
            id="semester"
            name="semester"
            type="number"
            min={1}
            max={2}
            defaultValue={defaultValues?.semester ?? 1}
            required
          />
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <Label htmlFor="content">{contentLabel}</Label>
          {showByteCounter && (
            <span className="text-xs text-muted-foreground">
              {getNeisByteLength(content)} byte (NEIS 기준)
            </span>
          )}
        </div>
        <Textarea
          id="content"
          name="content"
          rows={contentRows}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton label={submitLabel} />
    </form>
  );
}
