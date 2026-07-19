import Link from "next/link";
import { getStudents, createStudent, deleteStudent } from "@/lib/actions/students";
import { StudentForm } from "@/components/students/StudentForm";
import { ConfirmSubmitButton } from "@/components/shared/ConfirmSubmitButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function StudentsPage(props: PageProps<"/homeroom/students">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : undefined;
  const students = await getStudents(undefined, q);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">학생 명단</h1>
        <form className="flex-1 max-w-xs">
          <Input type="search" name="q" defaultValue={q} placeholder="이름으로 검색" />
        </form>
        <Dialog>
          <DialogTrigger render={<Button>학생 추가</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>학생 추가</DialogTitle>
            </DialogHeader>
            <StudentForm action={createStudent} submitLabel="추가" />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>학년도</TableHead>
            <TableHead>번호</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>성별</TableHead>
            <TableHead>보호자 연락처</TableHead>
            <TableHead className="text-right">관리</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                등록된 학생이 없습니다.
              </TableCell>
            </TableRow>
          )}
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.academicYear}</TableCell>
              <TableCell>{student.number}</TableCell>
              <TableCell>
                <Link href={`/homeroom/students/${student.id}`} className="hover:underline">
                  {student.name}
                </Link>
              </TableCell>
              <TableCell>{student.gender ?? "-"}</TableCell>
              <TableCell>{student.guardianPhone ?? "-"}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={`/homeroom/students/${student.id}`}>보기</Link>}
                />
                <form action={deleteStudent.bind(null, student.id)}>
                  <ConfirmSubmitButton
                    confirmMessage={`${student.name} 학생을 삭제할까요? 관련된 모든 기록이 함께 삭제됩니다.`}
                    variant="destructive"
                    size="sm"
                  >
                    삭제
                  </ConfirmSubmitButton>
                </form>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
