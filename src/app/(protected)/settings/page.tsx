import Link from "next/link";
import { ResetForm } from "@/components/settings/ResetForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-xl font-semibold">설정</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">데이터 내보내기</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            학생 명단, 출결, 상담·활동 기록, 수업·평가·세특 등 모든 데이터를 JSON 파일로
            다운로드합니다. 새 학년도를 시작하기 전, 또는 정기적으로 백업해두는 것을 권장합니다.
          </p>
          <Button render={<a href="/api/export" download>백업 다운로드</a>} nativeButton={false} />
        </CardContent>
      </Card>

      <Card className="border-destructive/40">
        <CardHeader>
          <CardTitle className="text-base text-destructive">위험 구역 — 전체 초기화</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            매년 담임 반이 바뀔 때 사용하세요. <span className="font-medium text-foreground">
              먼저 위의 백업 다운로드를 완료하셨는지 꼭 확인해주세요.
            </span>{" "}
            아래 초기화를 실행하면 학생 명단, 출결, 상담·활동 기록, 과목·반·수업·평가·세특, 학급
            공지·일정, 개인업무까지 <span className="font-medium text-foreground">전부 삭제</span>
            되며 되돌릴 수 없습니다.
          </p>
          <ResetForm />
        </CardContent>
      </Card>

      <p className="text-sm">
        <Link href="/homeroom" className="text-muted-foreground hover:underline">
          ← 돌아가기
        </Link>
      </p>
    </div>
  );
}
