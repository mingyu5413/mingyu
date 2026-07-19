"use client";

import { Button } from "@/components/ui/button";
import type { ComponentProps } from "react";

export function ConfirmSubmitButton({
  confirmMessage,
  children,
  ...props
}: { confirmMessage: string } & ComponentProps<typeof Button>) {
  return (
    <Button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
