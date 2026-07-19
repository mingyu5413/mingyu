import {
  getBehaviorCharacteristics,
  createBehaviorCharacteristic,
  updateBehaviorCharacteristic,
  deleteBehaviorCharacteristic,
} from "@/lib/actions/behaviorCharacteristics";
import { ConfirmSubmitButton } from "@/components/shared/ConfirmSubmitButton";
import { YearSemesterForm } from "@/components/records/YearSemesterForm";
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

export default async function BehaviorPage(
  props: PageProps<"/homeroom/students/[studentId]/behavior">
) {
  const { studentId } = await props.params;
  const id = Number(studentId);
  const items = await getBehaviorCharacteristics(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">행동특성 및 종합의견</h2>
        <Dialog>
          <DialogTrigger render={<Button size="sm">기록 추가</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>행동특성 기록 추가</DialogTitle>
            </DialogHeader>
            <YearSemesterForm
              action={createBehaviorCharacteristic.bind(null, id)}
              submitLabel="추가"
            />
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">등록된 기록이 없습니다.</p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="flex items-start justify-between gap-4 py-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  {item.academicYear}학년도 {item.semester}학기
                </div>
                <p className="whitespace-pre-wrap text-sm">{item.content}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Dialog>
                  <DialogTrigger render={<Button variant="outline" size="sm">수정</Button>} />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>행동특성 기록 수정</DialogTitle>
                    </DialogHeader>
                    <YearSemesterForm
                      action={updateBehaviorCharacteristic.bind(null, item.id)}
                      defaultValues={item}
                      submitLabel="수정 저장"
                    />
                  </DialogContent>
                </Dialog>
                <form action={deleteBehaviorCharacteristic.bind(null, item.id)}>
                  <ConfirmSubmitButton
                    confirmMessage="이 기록을 삭제할까요?"
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
