"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function MonthNav({
  year,
  month,
  basePath,
}: {
  year: number;
  month: number;
  basePath: string;
}) {
  const router = useRouter();

  function go(y: number, m: number) {
    let ny = y;
    let nm = m;
    if (nm < 1) {
      nm = 12;
      ny -= 1;
    } else if (nm > 12) {
      nm = 1;
      ny += 1;
    }
    router.push(`${basePath}?year=${ny}&month=${nm}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => go(year, month - 1)}>
        ◀ 이전 달
      </Button>
      <span className="text-sm font-medium">
        {year}년 {month}월
      </span>
      <Button variant="outline" size="sm" onClick={() => go(year, month + 1)}>
        다음 달 ▶
      </Button>
    </div>
  );
}
