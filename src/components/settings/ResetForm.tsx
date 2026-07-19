"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { resetAllData } from "@/lib/actions/reset";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CONFIRM_PHRASE = "초기화합니다";

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" disabled={disabled || pending}>
      {pending ? "초기화 중..." : "전체 초기화 실행"}
    </Button>
  );
}

export function ResetForm() {
  const [state, formAction] = useActionState(resetAllData, undefined);
  const [confirmation, setConfirmation] = useState("");

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (!confirm("정말로 모든 데이터를 삭제할까요? 이 작업은 되돌릴 수 없습니다.")) {
          e.preventDefault();
        }
      }}
      className="space-y-3"
    >
      <div className="space-y-1">
        <Label htmlFor="confirmation">
          계속하려면 아래 입력창에 정확히 <span className="font-semibold">{CONFIRM_PHRASE}</span>
          라고 입력하세요.
        </Label>
        <Input
          id="confirmation"
          name="confirmation"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
          placeholder={CONFIRM_PHRASE}
        />
      </div>
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <SubmitButton disabled={confirmation !== CONFIRM_PHRASE} />
    </form>
  );
}
