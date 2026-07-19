import {
  getLessonSessions,
  createLessonSession,
  updateLessonSession,
  deleteLessonSession,
} from "@/lib/actions/lessons";
import { AddRecordDialog } from "@/components/records/AddRecordDialog";
import { RecordList } from "@/components/records/RecordList";

export const dynamic = "force-dynamic";

const FIELDS = [
  { name: "unit", label: "단원", required: true },
  { name: "homeworkNote", label: "과제 메모" },
];

export default async function LessonsPage() {
  const items = await getLessonSessions();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">수업 진도</h1>
        <AddRecordDialog title="수업 기록 추가" action={createLessonSession} fields={FIELDS} />
      </div>
      <RecordList
        items={items}
        fields={FIELDS}
        renderMeta={(item) => `· ${item.unit}${item.homeworkNote ? ` (과제: ${item.homeworkNote})` : ""}`}
        updateAction={updateLessonSession}
        deleteAction={deleteLessonSession}
      />
    </div>
  );
}
