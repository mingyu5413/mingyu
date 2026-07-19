import { setAttendanceStatus, setAttendanceNote } from "@/lib/actions/attendance";
import {
  ATTENDANCE_STATUS_LABELS,
  ATTENDANCE_STATUS_ORDER,
} from "@/lib/constants/attendance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Student, Attendance } from "@/generated/prisma/client";

export function AttendanceGrid({
  rows,
  dateStr,
}: {
  rows: { student: Student; attendance: Attendance | null }[];
  dateStr: string;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>번호</TableHead>
          <TableHead>이름</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>메모</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="text-center text-muted-foreground">
              등록된 학생이 없습니다.
            </TableCell>
          </TableRow>
        )}
        {rows.map(({ student, attendance }) => (
          <TableRow key={student.id}>
            <TableCell>{student.number}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>
              <form className="flex flex-wrap gap-1">
                {ATTENDANCE_STATUS_ORDER.map((status) => (
                  <Button
                    key={status}
                    type="submit"
                    size="sm"
                    variant={attendance?.status === status ? "default" : "outline"}
                    formAction={setAttendanceStatus.bind(null, student.id, dateStr, status)}
                  >
                    {ATTENDANCE_STATUS_LABELS[status]}
                  </Button>
                ))}
              </form>
            </TableCell>
            <TableCell>
              <form className="flex gap-1">
                <Input
                  name="note"
                  defaultValue={attendance?.note ?? ""}
                  placeholder="메모"
                  className="h-7 w-40"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  formAction={setAttendanceNote.bind(null, student.id, dateStr)}
                >
                  저장
                </Button>
              </form>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
