import Link from "next/link";
import {
  getAssessments,
  createAssessment,
  deleteAssessment,
} from "@/lib/actions/assessments";
import { AssessmentForm } from "@/components/assessments/AssessmentForm";
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
import type { Assessment } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

function AssessmentSection({
  title,
  addLabel,
  type,
  classId,
  basePath,
  items,
}: {
  title: string;
  addLabel: string;
  type: "WRITTEN" | "PERFORMANCE";
  classId: number;
  basePath: string;
  items: Assessment[];
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <Dialog>
          <DialogTrigger render={<Button size="sm">{addLabel}</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{addLabel}</DialogTitle>
            </DialogHeader>
            <AssessmentForm action={createAssessment.bind(null, classId)} type={type} />
          </DialogContent>
        </Dialog>
      </div>
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">등록된 평가가 없습니다.</p>
      )}
      <div className="space-y-2">
        {items.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex items-center justify-between py-3">
              <div>
                <Link href={`${basePath}/${a.id}`} className="font-medium hover:underline">
                  {a.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {new Date(a.date).toLocaleDateString("ko-KR")} · 만점 {a.maxScore} · {a.semester}학기
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={`${basePath}/${a.id}`}>성적 입력</Link>}
                />
                <form action={deleteAssessment.bind(null, classId, a.id)}>
                  <ConfirmSubmitButton
                    confirmMessage={`"${a.title}"을(를) 삭제할까요? 입력된 성적도 함께 삭제됩니다.`}
                    variant="destructive"
                    size="sm"
                  >
                    삭제
                  </ConfirmSubmitButton>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export default async function AssessmentsPage(
  props: PageProps<"/subject/[subjectId]/[classId]/assessments">
) {
  const { subjectId, classId } = await props.params;
  const id = Number(classId);
  const basePath = `/subject/${subjectId}/${classId}/assessments`;
  const assessments = await getAssessments(id);
  const written = assessments.filter((a) => a.type === "WRITTEN");
  const performance = assessments.filter((a) => a.type === "PERFORMANCE");

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-medium">평가·성적</h2>
      <AssessmentSection
        title="지필평가"
        addLabel="지필평가 추가"
        type="WRITTEN"
        classId={id}
        basePath={basePath}
        items={written}
      />
      <AssessmentSection
        title="수행평가"
        addLabel="수행평가 추가"
        type="PERFORMANCE"
        classId={id}
        basePath={basePath}
        items={performance}
      />
    </div>
  );
}
