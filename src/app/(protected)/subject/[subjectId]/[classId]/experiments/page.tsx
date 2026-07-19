import {
  getExperiments,
  createExperiment,
  updateExperiment,
  deleteExperiment,
} from "@/lib/actions/experiments";
import { ExperimentForm } from "@/components/experiments/ExperimentForm";
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

export default async function ExperimentsPage(
  props: PageProps<"/subject/[subjectId]/[classId]/experiments">
) {
  const { classId } = await props.params;
  const id = Number(classId);
  const items = await getExperiments(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">실험·실습 기록</h2>
        <Dialog>
          <DialogTrigger render={<Button size="sm">실험 추가</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>실험 기록 추가</DialogTitle>
            </DialogHeader>
            <ExperimentForm action={createExperiment.bind(null, id)} submitLabel="추가" />
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">등록된 실험 기록이 없습니다.</p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-start justify-between gap-4 py-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  {new Date(item.date).toLocaleDateString("ko-KR")}
                  {item.unit ? ` · ${item.unit}` : ""}
                </div>
                <p className="font-medium">{item.title}</p>
                {item.procedureSummary && (
                  <p className="text-sm text-muted-foreground">과정: {item.procedureSummary}</p>
                )}
                <p className="text-sm">결과: {item.resultsSummary}</p>
                {item.safetyNotes && (
                  <p className="text-sm text-amber-600">안전: {item.safetyNotes}</p>
                )}
              </div>
              <div className="flex shrink-0 gap-1">
                <Dialog>
                  <DialogTrigger render={<Button variant="outline" size="sm">수정</Button>} />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>실험 기록 수정</DialogTitle>
                    </DialogHeader>
                    <ExperimentForm
                      action={updateExperiment.bind(null, item.id)}
                      defaultValues={item}
                      submitLabel="수정 저장"
                    />
                  </DialogContent>
                </Dialog>
                <form action={deleteExperiment.bind(null, item.id)}>
                  <ConfirmSubmitButton
                    confirmMessage="이 실험 기록을 삭제할까요?"
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
