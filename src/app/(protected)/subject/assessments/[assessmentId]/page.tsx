import { notFound } from "next/navigation";
import { getScoreRows } from "@/lib/actions/assessments";
import { ScoreGrid } from "@/components/assessments/ScoreGrid";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  WRITTEN: "지필평가",
  PERFORMANCE: "수행평가",
};

export default async function AssessmentScoresPage(
  props: PageProps<"/subject/assessments/[assessmentId]">
) {
  const { assessmentId } = await props.params;
  const { assessment, rows } = await getScoreRows(Number(assessmentId));
  if (!assessment) notFound();

  const validScores = rows
    .map((r) => r.score?.score)
    .filter((s): s is number => typeof s === "number");
  const average =
    validScores.length > 0
      ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(1)
      : "-";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold">{assessment.title}</h1>
        <p className="text-sm text-muted-foreground">
          {TYPE_LABELS[assessment.type]} · 만점 {assessment.maxScore} · 평균 {average}점 (
          {validScores.length}/{rows.length}명 입력)
        </p>
      </div>
      <ScoreGrid assessmentId={assessment.id} rows={rows} />
    </div>
  );
}
