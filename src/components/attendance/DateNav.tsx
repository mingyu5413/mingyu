"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function shiftDate(dateStr: string, days: number) {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function DateNav({ dateStr, basePath }: { dateStr: string; basePath: string }) {
  const router = useRouter();

  function go(next: string) {
    router.push(`${basePath}?date=${next}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => go(shiftDate(dateStr, -1))}>
        ◀ 이전 날
      </Button>
      <Input
        type="date"
        value={dateStr}
        onChange={(e) => go(e.target.value)}
        className="w-40"
      />
      <Button variant="outline" size="sm" onClick={() => go(shiftDate(dateStr, 1))}>
        다음 날 ▶
      </Button>
    </div>
  );
}
