import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RecordForm, type FieldConfig } from "@/components/records/RecordForm";

type ActionState = { error?: string } | undefined;

export function AddRecordDialog({
  title,
  action,
  fields,
  includeDate,
}: {
  title: string;
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  fields?: FieldConfig[];
  includeDate?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger render={<Button size="sm">기록 추가</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <RecordForm action={action} fields={fields} includeDate={includeDate} submitLabel="추가" />
      </DialogContent>
    </Dialog>
  );
}
