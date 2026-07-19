import { toggleSubmission, setSubmissionNote } from "@/lib/actions/homework";
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
import type { SubjectStudent, HomeworkSubmission } from "@/generated/prisma/client";

export function SubmissionGrid({
  homeworkId,
  rows,
}: {
  homeworkId: number;
  rows: { student: SubjectStudent; submission: HomeworkSubmission | null }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>번호</TableHead>
          <TableHead>이름</TableHead>
          <TableHead>제출 여부</TableHead>
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
        {rows.map(({ student, submission }) => (
          <TableRow key={student.id}>
            <TableCell>{student.number}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>
              <form>
                <Button
                  type="submit"
                  size="sm"
                  variant={submission?.submitted ? "default" : "outline"}
                  formAction={toggleSubmission.bind(null, homeworkId, student.id)}
                >
                  {submission?.submitted ? "제출함" : "미제출"}
                </Button>
              </form>
            </TableCell>
            <TableCell>
              <form className="flex gap-1">
                <Input
                  name="note"
                  defaultValue={submission?.note ?? ""}
                  placeholder="메모"
                  className="h-7 w-40"
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  formAction={setSubmissionNote.bind(null, homeworkId, student.id)}
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
