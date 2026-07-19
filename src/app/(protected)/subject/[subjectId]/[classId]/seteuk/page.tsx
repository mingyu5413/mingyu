import Link from "next/link";
import { getSubjectStudents } from "@/lib/actions/subjectStudents";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function SeteukListPage(
  props: PageProps<"/subject/[subjectId]/[classId]/seteuk">
) {
  const { subjectId, classId } = await props.params;
  const id = Number(classId);
  const students = await getSubjectStudents(id);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium">세부능력특기사항 (세특)</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>번호</TableHead>
            <TableHead>이름</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 && (
            <TableRow>
              <TableCell colSpan={2} className="text-center text-muted-foreground">
                등록된 학생이 없습니다.
              </TableCell>
            </TableRow>
          )}
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.number}</TableCell>
              <TableCell>
                <Link
                  href={`/subject/${subjectId}/${classId}/seteuk/${student.id}`}
                  className="hover:underline"
                >
                  {student.name}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
