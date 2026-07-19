"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export type FieldConfig = {
  name: string;
  label: string;
  type?: "text" | "number";
  required?: boolean;
};

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

export function RecordForm({
  action,
  fields = [],
  includeDate = true,
  defaultValues,
  submitLabel = "저장",
}: {
  action: Action;
  fields?: FieldConfig[];
  includeDate?: boolean;
  defaultValues?: Record<string, unknown>;
  submitLabel?: string;
}) {
  const [state, formAction] = useActionState(action, undefined);
  const dateValue = defaultValues?.date
    ? new Date(defaultValues.date as string).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        {includeDate && (
          <div className="space-y-1">
            <Label htmlFor="date">날짜</Label>
            <Input id="date" name="date" type="date" defaultValue={dateValue} required />
          </div>
        )}
        {fields.map((field) => (
          <div key={field.name} className="space-y-1">
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              name={field.name}
              type={field.type ?? "text"}
              defaultValue={defaultValues?.[field.name] as string | number | undefined}
              required={field.required}
            />
          </div>
        ))}
      </div>
      <div className="space-y-1">
        <Label htmlFor="content">내용</Label>
        <Textarea
          id="content"
          name="content"
          rows={4}
          defaultValue={defaultValues?.content as string | undefined}
          required
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton label={submitLabel} />
    </form>
  );
}
