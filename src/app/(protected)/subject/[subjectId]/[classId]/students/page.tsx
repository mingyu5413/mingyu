import {
  getSubjectStudents,
  createSubjectStudent,
  updateSubjectStudent,
  deleteSubjectStudent,
} from "@/lib/actions/subjectStudents";
import { SubjectStudentForm } from "@/components/subjectStudents/SubjectStudentForm";
import { ConfirmSubmitButton } from "@/components/shared/ConfirmSubmitButton";
import { Button } from "@/components/ui/button";
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

export default async function SubjectStudentsPage(
  props: PageProps<"/subject/[subjectId]/[classId]/students">
) {
  const { classId } = await props.params;
  const id = Number(classId);
  const students = await getSubjectStudents(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">학생 명단</h2>
        <Dialog>
          <DialogTrigger render={<Button size="sm">학생 추가</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>학생 추가</DialogTitle>
            </DialogHeader>
            <SubjectStudentForm action={createSubjectStudent.bind(null, id)} submitLabel="추가" />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>번호</TableHead>
            <TableHead>이름</TableHead>
            <TableHead className="text-right">관리</TableHead>
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
              <TableCell>{student.number}</TableCell>
              <TableCell>{student.name}</TableCell>
              <TableCell className="flex justify-end gap-2">
                <Dialog>
                  <DialogTrigger render={<Button variant="outline" size="sm">수정</Button>} />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>학생 정보 수정</DialogTitle>
                    </DialogHeader>
                    <SubjectStudentForm
                      action={updateSubjectStudent.bind(null, student.id)}
                      defaultValues={student}
                      submitLabel="수정 저장"
                    />
                  </DialogContent>
                </Dialog>
                <form action={deleteSubjectStudent.bind(null, student.id)}>
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
