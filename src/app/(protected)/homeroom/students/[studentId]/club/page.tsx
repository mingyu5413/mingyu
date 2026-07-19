import {
  getClubActivities,
  createClubActivity,
  updateClubActivity,
  deleteClubActivity,
} from "@/lib/actions/club";
import { AddRecordDialog } from "@/components/records/AddRecordDialog";
import { RecordList } from "@/components/records/RecordList";

export const dynamic = "force-dynamic";

const FIELDS = [
  { name: "clubName", label: "동아리명", required: true },
  { name: "semester", label: "학기", type: "number" as const },
];

export default async function ClubPage(
  props: PageProps<"/homeroom/students/[studentId]/club">
) {
  const { studentId } = await props.params;
  const id = Number(studentId);
  const items = await getClubActivities(id);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">동아리활동</h2>
        <AddRecordDialog
          title="동아리활동 추가"
          action={createClubActivity.bind(null, id)}
          fields={FIELDS}
        />
      </div>
      <RecordList
        items={items}
        fields={FIELDS}
        renderMeta={(item) => `· ${item.clubName}${item.semester ? ` (${item.semester}학기)` : ""}`}
        updateAction={updateClubActivity}
        deleteAction={deleteClubActivity}
      />
    </div>
  );
}
