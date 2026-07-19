import Link from "next/link";
import { getMonthlyAttendanceStats } from "@/lib/actions/attendance";
import {
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_ORDER,
} from "@/lib/constants/attendance";
import { MonthNav } from "@/components/attendance/MonthNav";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AttendanceStatsPage(
  props: PageProps<"/homeroom/attendance/stats">
) {
  const searchParams = await props.searchParams;
  const now = new Date();
  const year = Number(searchParams.year) || now.getFullYear();
  const month = Number(searchParams.month) || now.getMonth() + 1;

  const stats = await getMonthlyAttendanceStats(year, year, month);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">출결 월별 통계</h1>
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href="/homeroom/attendance">일별 출결로</Link>}
        />
      </div>
      <MonthNav year={year} month={month} basePath="/homeroom/attendance/stats" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>번호</TableHead>
            <TableHead>이름</TableHead>
            {ATTENDANCE_STATUS_ORDER.map((status) => (
              <TableHead key={status} className="text-center">
                {ATTENDANCE_STATUS_LABELS[status]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {stats.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={2 + ATTENDANCE_STATUS_ORDER.length}
                className="text-center text-muted-foreground"
              >
                등록된 학생이 없습니다.
              </TableCell>
            </TableRow>
          )}
          {stats.map(({ student, counts }) => (
            <TableRow key={student.id}>
              <TableCell>{student.number}</TableCell>
              <TableCell>{student.name}</TableCell>
              {ATTENDANCE_STATUS_ORDER.map((status) => (
                <TableCell key={status} className="text-center">
                  {counts[status] || "-"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
