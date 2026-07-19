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
import { RecordForm, type FieldConfig } from "@/components/records/RecordForm";

type ActionState = { error?: string } | undefined;

type BaseRecord = {
  id: number;
  date: Date;
  content: string;
  [key: string]: unknown;
};

export function RecordList<T extends BaseRecord>({
  items,
  fields = [],
  renderMeta,
  updateAction,
  deleteAction,
}: {
  items: T[];
  fields?: FieldConfig[];
  renderMeta?: (item: T) => React.ReactNode;
  updateAction: (
    id: number,
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
  deleteAction: (id: number) => Promise<void>;
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">등록된 기록이 없습니다.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex items-start justify-between gap-4 py-4">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">
                {new Date(item.date).toLocaleDateString("ko-KR")}
                {renderMeta && <span className="ml-2">{renderMeta(item)}</span>}
              </div>
              <p className="whitespace-pre-wrap text-sm">{item.content}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Dialog>
                <DialogTrigger render={<Button variant="outline" size="sm">수정</Button>} />
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>기록 수정</DialogTitle>
                  </DialogHeader>
                  <RecordForm
                    action={updateAction.bind(null, item.id)}
                    fields={fields}
                    defaultValues={item}
                    submitLabel="수정 저장"
                  />
                </DialogContent>
              </Dialog>
              <form action={deleteAction.bind(null, item.id)}>
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
  );
}
