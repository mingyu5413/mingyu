import { setScore } from "@/lib/actions/assessments";
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
import type { Student, Score } from "@/generated/prisma/client";

export function ScoreGrid({
  assessmentId,
  rows,
}: {
  assessmentId: number;
  rows: { student: Student; score: Score | null }[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>번호</TableHead>
          <TableHead>이름</TableHead>
          <TableHead>점수</TableHead>
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
        {rows.map(({ student, score }) => (
          <TableRow key={student.id}>
            <TableCell>{student.number}</TableCell>
            <TableCell>{student.name}</TableCell>
            <TableCell>
              <form className="flex gap-1">
                <Input
                  name="score"
                  type="number"
                  step="0.5"
                  defaultValue={score?.score ?? ""}
                  className="h-7 w-20"
                />
                <input type="hidden" name="note" value={score?.note ?? ""} />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  formAction={setScore.bind(null, assessmentId, student.id)}
                >
                  저장
                </Button>
              </form>
            </TableCell>
            <TableCell>
              <form className="flex gap-1">
                <input type="hidden" name="score" value={score?.score ?? ""} />
                <Input name="note" defaultValue={score?.note ?? ""} className="h-7 w-40" />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  formAction={setScore.bind(null, assessmentId, student.id)}
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
