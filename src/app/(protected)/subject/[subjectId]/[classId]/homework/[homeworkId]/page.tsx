import { notFound } from "next/navigation";
import { getSubmissionRows } from "@/lib/actions/homework";
import { SubmissionGrid } from "@/components/homework/SubmissionGrid";

export const dynamic = "force-dynamic";

export default async function HomeworkSubmissionsPage(
  props: PageProps<"/subject/[subjectId]/[classId]/homework/[homeworkId]">
) {
  const { homeworkId } = await props.params;
  const { homework, rows } = await getSubmissionRows(Number(homeworkId));
  if (!homework) notFound();

  const submittedCount = rows.filter((r) => r.submission?.submitted).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{homework.title}</h1>
        <p className="text-sm text-muted-foreground">
          제출 {submittedCount}/{rows.length}명 · 마감{" "}
          {new Date(homework.dueDate).toLocaleDateString("ko-KR")}
        </p>
      </div>
      <SubmissionGrid homeworkId={homework.id} rows={rows} />
    </div>
  );
}
