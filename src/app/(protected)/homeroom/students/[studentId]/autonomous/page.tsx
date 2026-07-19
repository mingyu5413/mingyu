import {
  getAutonomousActivities,
  createAutonomousActivity,
  updateAutonomousActivity,
  deleteAutonomousActivity,
} from "@/lib/actions/autonomous";
import { AddRecordDialog } from "@/components/records/AddRecordDialog";
import { RecordList } from "@/components/records/RecordList";

export const dynamic = "force-dynamic";

const FIELDS = [
  { name: "title", label: "제목", required: true },
  { name: "semester", label: "학기", type: "number" as const },
];

export default async function AutonomousPage(
  props: PageProps<"/homeroom/students/[studentId]/autonomous">
) {
  const { studentId } = await props.params;
  const id = Number(studentId);
  const items = await getAutonomousActivities(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">자율·자치활동</h2>
        <AddRecordDialog
          title="자율·자치활동 추가"
          action={createAutonomousActivity.bind(null, id)}
          fields={FIELDS}
        />
      </div>
      <RecordList
        items={items}
        fields={FIELDS}
        renderMeta={(item) => `· ${item.title}${item.semester ? ` (${item.semester}학기)` : ""}`}
        updateAction={updateAutonomousActivity}
        deleteAction={deleteAutonomousActivity}
      />
    </div>
  );
}
