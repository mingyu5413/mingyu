import { notFound } from "next/navigation";
import Link from "next/link";
import { getSubject } from "@/lib/actions/subjects";
import { getSubjectClasses, deleteSubjectClass } from "@/lib/actions/subjectClasses";
import { SubjectClassForm } from "@/components/subjects/SubjectClassForm";
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

export default async function SubjectClassesPage(
  props: PageProps<"/subject/[subjectId]">
) {
  const { subjectId } = await props.params;
  const id = Number(subjectId);
  const subject = await getSubject(id);
  if (!subject) notFound();

  const classes = await getSubjectClasses(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{subject.name} — 반 선택</h1>
        <Dialog>
          <DialogTrigger render={<Button size="sm">반 추가</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>반 추가</DialogTitle>
            </DialogHeader>
            <SubjectClassForm subjectId={id} />
          </DialogContent>
        </Dialog>
      </div>

      {classes.length === 0 && (
        <p className="text-sm text-muted-foreground">배정된 반이 없습니다.</p>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardContent className="flex items-center justify-between py-4">
              <Link href={`/subject/${id}/${cls.id}`} className="font-medium hover:underline">
                {cls.academicYear} {cls.label}
              </Link>
              <form action={deleteSubjectClass.bind(null, id, cls.id)}>
                <ConfirmSubmitButton
                  confirmMessage={`"${cls.label}" 반을 삭제할까요? 학생 명단과 모든 기록이 함께 삭제됩니다.`}
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
