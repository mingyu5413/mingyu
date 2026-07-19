import Link from "next/link";
import { getAssessments, deleteAssessment } from "@/lib/actions/assessments";
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

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  WRITTEN: "지필평가",
  PERFORMANCE: "수행평가",
};

export default async function AssessmentsPage() {
  const assessments = await getAssessments();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">평가·성적</h1>
        <Dialog>
          <DialogTrigger render={<Button size="sm">평가 추가</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>평가 추가</DialogTitle>
            </DialogHeader>
            <AssessmentForm />
          </DialogContent>
        </Dialog>
      </div>

      {assessments.length === 0 && (
        <p className="text-sm text-muted-foreground">등록된 평가가 없습니다.</p>
      )}

      <div className="space-y-3">
        {assessments.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <Link href={`/subject/assessments/${a.id}`} className="font-medium hover:underline">
                  {a.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  {TYPE_LABELS[a.type]} · {new Date(a.date).toLocaleDateString("ko-KR")} · 만점{" "}
                  {a.maxScore} · {a.academicYear}학년도 {a.semester}학기
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={`/subject/assessments/${a.id}`}>성적 입력</Link>}
                />
                <form action={deleteAssessment.bind(null, a.id)}>
                  <ConfirmSubmitButton
                    confirmMessage={`"${a.title}" 평가를 삭제할까요? 입력된 성적도 함께 삭제됩니다.`}
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
    </div>
  );
}
