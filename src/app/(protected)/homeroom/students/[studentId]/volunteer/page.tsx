import {
  getVolunteerActivities,
  createVolunteerActivity,
  updateVolunteerActivity,
  deleteVolunteerActivity,
} from "@/lib/actions/volunteer";
import { AddRecordDialog } from "@/components/records/AddRecordDialog";
import { RecordList } from "@/components/records/RecordList";

export const dynamic = "force-dynamic";

const FIELDS = [
  { name: "place", label: "장소", required: true },
  { name: "activityType", label: "활동 유형", required: true },
  { name: "hours", label: "시간", type: "number" as const, required: true },
  { name: "semester", label: "학기", type: "number" as const },
];

export default async function VolunteerPage(
  props: PageProps<"/homeroom/students/[studentId]/volunteer">
) {
  const { studentId } = await props.params;
  const id = Number(studentId);
  const items = await getVolunteerActivities(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">봉사활동</h2>
        <AddRecordDialog
          title="봉사활동 추가"
          action={createVolunteerActivity.bind(null, id)}
          fields={FIELDS}
        />
      </div>
      <RecordList
        items={items}
        fields={FIELDS}
        renderMeta={(item) => `· ${item.place} / ${item.activityType} / ${item.hours}시간`}
        updateAction={updateVolunteerActivity}
        deleteAction={deleteVolunteerActivity}
      />
    </div>
  );
}
