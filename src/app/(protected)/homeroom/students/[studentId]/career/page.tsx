import {
  getCareerActivities,
  createCareerActivity,
  updateCareerActivity,
  deleteCareerActivity,
} from "@/lib/actions/career";
import { AddRecordDialog } from "@/components/records/AddRecordDialog";
import { RecordList } from "@/components/records/RecordList";

export const dynamic = "force-dynamic";

const FIELDS = [
  { name: "title", label: "제목", required: true },
  { name: "semester", label: "학기", type: "number" as const },
];

export default async function CareerPage(
  props: PageProps<"/homeroom/students/[studentId]/career">
) {
  const { studentId } = await props.params;
  const id = Number(studentId);
  const items = await getCareerActivities(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">진로활동</h2>
        <AddRecordDialog
          title="진로활동 추가"
          action={createCareerActivity.bind(null, id)}
          fields={FIELDS}
        />
      </div>
      <RecordList
        items={items}
        fields={FIELDS}
        renderMeta={(item) => `· ${item.title}${item.semester ? ` (${item.semester}학기)` : ""}`}
        updateAction={updateCareerActivity}
        deleteAction={deleteCareerActivity}
      />
    </div>
  );
}
