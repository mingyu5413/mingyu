import Link from "next/link";
import { getAttendanceForDate } from "@/lib/actions/attendance";
import { AttendanceGrid } from "@/components/attendance/AttendanceGrid";
import { DateNav } from "@/components/attendance/DateNav";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

export default async function AttendancePage(
  props: PageProps<"/homeroom/attendance">
) {
  const searchParams = await props.searchParams;
  const dateStr =
    typeof searchParams.date === "string" ? searchParams.date : todayStr();
  const academicYear = new Date(dateStr).getUTCFullYear();

  const rows = await getAttendanceForDate(academicYear, dateStr);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">출결 관리</h1>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/homeroom/attendance/stats">월별 통계</Link>}
        />
      </div>
      <DateNav dateStr={dateStr} basePath="/homeroom/attendance" />
      <AttendanceGrid rows={rows} dateStr={dateStr} />
    </div>
  );
}
