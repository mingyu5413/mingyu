import { getNotices, createNotice, updateNotice, deleteNotice } from "@/lib/actions/notices";
import { AddRecordDialog } from "@/components/records/AddRecordDialog";
import { RecordList } from "@/components/records/RecordList";

export const dynamic = "force-dynamic";

const FIELDS = [
  { name: "title", label: "제목", required: true },
  { name: "category", label: "분류 (공지/일정)" },
];

export default async function NoticesPage() {
  const notices = await getNotices();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">학급 공지·일정</h1>
        <AddRecordDialog title="공지·일정 추가" action={createNotice} fields={FIELDS} />
      </div>
      <RecordList
        items={notices}
        fields={FIELDS}
        renderMeta={(item) => `· [${item.category}] ${item.title}`}
        updateAction={updateNotice}
        deleteAction={deleteNotice}
      />
    </div>
  );
}
