import { getNotices, createNotice, updateNotice, deleteNotice } from "@/lib/actions/notices";
import { AddRecordDialog } from "@/components/records/AddRecordDialog";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { MonthNav } from "@/components/attendance/MonthNav";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RecordForm } from "@/components/records/RecordForm";
import { ConfirmSubmitButton } from "@/components/shared/ConfirmSubmitButton";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const FIELDS = [
  { name: "title", label: "제목", required: true },
  { name: "category", label: "분류 (공지/일정)" },
];

export default async function NoticesPage(props: PageProps<"/homeroom/notices">) {
  const searchParams = await props.searchParams;
  const now = new Date();
  const year = Number(searchParams.year) || now.getFullYear();
  const month = Number(searchParams.month) || now.getMonth() + 1;

  const notices = await getNotices();
  const events = notices.map((n) => ({
    date: n.date,
    label: `[${n.category}] ${n.title}`,
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">학급 공지·일정</h1>
        <AddRecordDialog title="공지·일정 추가" action={createNotice} fields={FIELDS} />
      </div>
      <MonthNav year={year} month={month} basePath="/homeroom/notices" />
      <MonthCalendar year={year} month={month} events={events} />

      {notices.length > 0 && (
        <div className="space-y-2 pt-4">
          <h2 className="text-sm font-medium text-muted-foreground">전체 목록</h2>
          {notices.map((n) => (
            <div key={n.id} className="flex items-center justify-between rounded-md border p-2 text-sm">
              <span>
                {new Date(n.date).toLocaleDateString("ko-KR")} · [{n.category}] {n.title}
              </span>
              <div className="flex gap-1">
                <Dialog>
                  <DialogTrigger render={<Button variant="outline" size="sm">수정</Button>} />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>공지·일정 수정</DialogTitle>
                    </DialogHeader>
                    <RecordForm
                      action={updateNotice.bind(null, n.id)}
                      fields={FIELDS}
                      defaultValues={n}
                      submitLabel="수정 저장"
                    />
                  </DialogContent>
                </Dialog>
                <form action={deleteNotice.bind(null, n.id)}>
                  <ConfirmSubmitButton confirmMessage="이 공지를 삭제할까요?" variant="destructive" size="sm">
                    삭제
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
