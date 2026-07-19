import { notFound } from "next/navigation";
import { getSubjectStudent } from "@/lib/actions/subjectStudents";
import {
  getSeteukEntries,
  createSeteukEntry,
  updateSeteukEntry,
  deleteSeteukEntry,
  getSeteukDrafts,
  saveSeteukDraft,
  deleteSeteukDraft,
} from "@/lib/actions/seteuk";
import { AddRecordDialog } from "@/components/records/AddRecordDialog";
import { RecordList } from "@/components/records/RecordList";
import { YearSemesterForm } from "@/components/records/YearSemesterForm";
import { ConfirmSubmitButton } from "@/components/shared/ConfirmSubmitButton";
import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getNeisByteLength } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SeteukDetailPage(
  props: PageProps<"/subject/[subjectId]/[classId]/seteuk/[subjectStudentId]">
) {
  const { classId, subjectStudentId } = await props.params;
  const classIdNum = Number(classId);
  const id = Number(subjectStudentId);
  const student = await getSubjectStudent(id);
  if (!student) notFound();

  const [entries, drafts] = await Promise.all([getSeteukEntries(id), getSeteukDrafts(id)]);

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-medium">
        {student.number}번 {student.name} · 세특
      </h2>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">수시 기록</h3>
          <AddRecordDialog
            title="세특 수시 기록 추가"
            action={createSeteukEntry.bind(null, classIdNum, id)}
          />
        </div>
        <RecordList
          items={entries}
          updateAction={updateSeteukEntry}
          deleteAction={deleteSeteukEntry}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">완성본 (학기별)</h3>
          <Dialog>
            <DialogTrigger render={<Button size="sm">완성본 작성</Button>} />
            <DialogContent>
              <DialogHeader>
                <DialogTitle>세특 완성본 작성</DialogTitle>
              </DialogHeader>
              <YearSemesterForm
                action={saveSeteukDraft.bind(null, classIdNum, id)}
                submitLabel="저장"
                contentLabel="세특 완성본"
                contentRows={10}
                showByteCounter
              />
            </DialogContent>
          </Dialog>
        </div>

        {drafts.length === 0 && (
          <p className="text-sm text-muted-foreground">작성된 완성본이 없습니다.</p>
        )}

        <div className="space-y-3">
          {drafts.map((draft) => (
            <Card key={draft.id}>
              <CardContent className="space-y-2 py-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    {draft.academicYear}학년도 {draft.semester}학기 ·{" "}
                    {getNeisByteLength(draft.finalText)} byte
                  </span>
                  <div className="flex gap-1">
                    <CopyButton text={draft.finalText} />
                    <Dialog>
                      <DialogTrigger render={<Button variant="outline" size="sm">수정</Button>} />
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>세특 완성본 수정</DialogTitle>
                        </DialogHeader>
                        <YearSemesterForm
                          action={saveSeteukDraft.bind(null, classIdNum, id)}
                          defaultValues={{
                            academicYear: draft.academicYear,
                            semester: draft.semester,
                            content: draft.finalText,
                          }}
                          submitLabel="수정 저장"
                          contentLabel="세특 완성본"
                          contentRows={10}
                          showByteCounter
                        />
                      </DialogContent>
                    </Dialog>
                    <form action={deleteSeteukDraft.bind(null, draft.id)}>
                      <ConfirmSubmitButton
                        confirmMessage="이 완성본을 삭제할까요?"
                        variant="destructive"
                        size="sm"
                      >
                        삭제
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </div>
                <p className="whitespace-pre-wrap rounded-md bg-muted/50 p-3 text-sm">
                  {draft.finalText}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
