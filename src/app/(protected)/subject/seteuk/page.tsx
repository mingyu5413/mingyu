import Link from "next/link";
import { getStudents } from "@/lib/actions/students";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function SeteukListPage(props: PageProps<"/subject/seteuk">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const students = await getStudents(undefined, q);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">세부능력특기사항 (세특)</h1>
        <form className="w-full max-w-xs">
          <Input type="search" name="q" defaultValue={q} placeholder="이름으로 검색" />
        </form>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>학년도</TableHead>
            <TableHead>번호</TableHead>
            <TableHead>이름</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                등록된 학생이 없습니다.
              </TableCell>
            </TableRow>
          )}
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.academicYear}</TableCell>
              <TableCell>{student.number}</TableCell>
              <TableCell>
                <Link href={`/subject/seteuk/${student.id}`} className="hover:underline">
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
