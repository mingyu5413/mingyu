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

export default async function LessonsPage(
  props: PageProps<"/subject/[subjectId]/[classId]/lessons">
) {
  const { classId } = await props.params;
  const id = Number(classId);
  const items = await getLessonSessions(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">수업 진도</h2>
        <AddRecordDialog
          title="수업 기록 추가"
          action={createLessonSession.bind(null, id)}
          fields={FIELDS}
        />
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
