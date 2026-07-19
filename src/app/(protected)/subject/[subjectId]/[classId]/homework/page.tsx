import Link from "next/link";
import { getHomeworkList, createHomework, deleteHomework } from "@/lib/actions/homework";
import { HomeworkForm } from "@/components/homework/HomeworkForm";
import { ConfirmSubmitButton } from "@/components/shared/ConfirmSubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const dynamic = "force-dynamic";

export default async function HomeworkPage(
  props: PageProps<"/subject/[subjectId]/[classId]/homework">
) {
  const { subjectId, classId } = await props.params;
  const id = Number(classId);
  const items = await getHomeworkList(id);
  const basePath = `/subject/${subjectId}/${classId}/homework`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">과제 관리</h2>
        <Dialog>
          <DialogTrigger render={<Button size="sm">과제 추가</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>과제 추가</DialogTitle>
            </DialogHeader>
            <HomeworkForm action={createHomework.bind(null, id)} />
          </DialogContent>
        </Dialog>
      </div>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">등록된 과제가 없습니다.</p>
      )}

      <div className="space-y-3">
        {items.map((hw) => (
          <Card key={hw.id}>
            <CardContent className="flex items-center justify-between py-4">
              <div>
                <Link href={`${basePath}/${hw.id}`} className="font-medium hover:underline">
                  {hw.title}
                </Link>
                <p className="text-sm text-muted-foreground">
                  부여 {new Date(hw.assignedDate).toLocaleDateString("ko-KR")} · 마감{" "}
                  {new Date(hw.dueDate).toLocaleDateString("ko-KR")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={<Link href={`${basePath}/${hw.id}`}>제출 확인</Link>}
                />
                <form action={deleteHomework.bind(null, id, hw.id)}>
                  <ConfirmSubmitButton
                    confirmMessage={`"${hw.title}" 과제를 삭제할까요?`}
                    variant="destructive"
                    size="sm"
                  >
                    삭제
                  </ConfirmSubmitButton>
                </form>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
