import Link from "next/link";
import { getSubjects, deleteSubject } from "@/lib/actions/subjects";
import { SubjectForm } from "@/components/subjects/SubjectForm";
import { ConfirmSubmitButton } from "@/components/shared/ConfirmSubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const dynamic = "force-dynamic";

export default async function SubjectsPage() {
  const subjects = await getSubjects();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">과목 선택</h1>
        <Dialog>
          <DialogTrigger render={<Button size="sm">과목 추가</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>과목 추가</DialogTitle>
            </DialogHeader>
            <SubjectForm />
          </DialogContent>
        </Dialog>
      </div>

      {subjects.length === 0 && (
        <p className="text-sm text-muted-foreground">등록된 과목이 없습니다.</p>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {subjects.map((subject) => (
          <Card key={subject.id}>
            <CardContent className="flex items-center justify-between py-4">
              <Link href={`/subject/${subject.id}`} className="font-medium hover:underline">
                {subject.name}
              </Link>
              <form action={deleteSubject.bind(null, subject.id)}>
                <ConfirmSubmitButton
                  confirmMessage={`"${subject.name}" 과목을 삭제할까요? 배정된 반과 모든 기록이 함께 삭제됩니다.`}
                  variant="destructive"
                  size="sm"
                >
                  삭제
                </ConfirmSubmitButton>
              </form>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
