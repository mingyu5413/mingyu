import { notFound } from "next/navigation";
import { getStudent, updateStudent } from "@/lib/actions/students";
import { StudentForm } from "@/components/students/StudentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function StudentDetailPage(
  props: PageProps<"/homeroom/students/[studentId]">
) {
  const { studentId } = await props.params;
  const id = Number(studentId);
  const student = await getStudent(id);
  if (!student) notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">학생 정보 수정</CardTitle>
      </CardHeader>
      <CardContent>
        <StudentForm
          action={updateStudent.bind(null, id)}
          defaultValues={student}
          submitLabel="수정 저장"
        />
      </CardContent>
    </Card>
  );
}
