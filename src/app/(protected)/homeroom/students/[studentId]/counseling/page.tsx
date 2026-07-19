import {
  getCounselingNotes,
  createCounselingNote,
  updateCounselingNote,
  deleteCounselingNote,
} from "@/lib/actions/counseling";
import { AddRecordDialog } from "@/components/records/AddRecordDialog";
import { RecordList } from "@/components/records/RecordList";

export const dynamic = "force-dynamic";

const FIELDS = [{ name: "category", label: "분류" }];

export default async function CounselingPage(
  props: PageProps<"/homeroom/students/[studentId]/counseling">
) {
  const { studentId } = await props.params;
  const id = Number(studentId);
  const notes = await getCounselingNotes(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">상담 기록</h2>
        <AddRecordDialog
          title="상담 기록 추가"
          action={createCounselingNote.bind(null, id)}
          fields={FIELDS}
        />
      </div>
      <RecordList
        items={notes}
        fields={FIELDS}
        renderMeta={(item) => (item.category ? `· ${item.category}` : null)}
        updateAction={updateCounselingNote}
        deleteAction={deleteCounselingNote}
      />
    </div>
  );
}
