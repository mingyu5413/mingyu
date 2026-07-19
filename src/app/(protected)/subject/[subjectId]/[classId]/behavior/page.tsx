import {
  getClassBehaviorNotes,
  createClassBehaviorNote,
  updateClassBehaviorNote,
  deleteClassBehaviorNote,
} from "@/lib/actions/classBehaviorNotes";
import { getSubjectStudents } from "@/lib/actions/subjectStudents";
import { getLessonSessions } from "@/lib/actions/lessons";
import { ClassBehaviorNoteForm } from "@/components/behavior/ClassBehaviorNoteForm";
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

export default async function SubjectBehaviorPage(
  props: PageProps<"/subject/[subjectId]/[classId]/behavior">
) {
  const { classId } = await props.params;
  const id = Number(classId);
  const [notes, students, lessonSessions] = await Promise.all([
    getClassBehaviorNotes(id),
    getSubjectStudents(id),
    getLessonSessions(id),
  ]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">수업 중 행동 기록</h2>
        <Dialog>
          <DialogTrigger render={<Button size="sm">기록 추가</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>행동 기록 추가</DialogTitle>
            </DialogHeader>
            <ClassBehaviorNoteForm
              action={createClassBehaviorNote.bind(null, id)}
              students={students}
              lessonSessions={lessonSessions}
              submitLabel="추가"
            />
          </DialogContent>
        </Dialog>
      </div>

      {notes.length === 0 && (
        <p className="text-sm text-muted-foreground">등록된 기록이 없습니다.</p>
      )}

      <div className="space-y-3">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="flex items-start justify-between gap-4 py-4">
              <div className="space-y-1">
                <div className="text-sm text-muted-foreground">
                  {new Date(note.date).toLocaleDateString("ko-KR")} · {note.subjectStudent.number}번{" "}
                  {note.subjectStudent.name}
                  {note.lessonSession ? ` · ${note.lessonSession.unit}` : ""}
                </div>
                <p className="whitespace-pre-wrap text-sm">{note.content}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Dialog>
                  <DialogTrigger render={<Button variant="outline" size="sm">수정</Button>} />
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>행동 기록 수정</DialogTitle>
                    </DialogHeader>
                    <ClassBehaviorNoteForm
                      action={updateClassBehaviorNote.bind(null, note.id)}
                      lessonSessions={lessonSessions}
                      defaultValues={note}
                      submitLabel="수정 저장"
                    />
                  </DialogContent>
                </Dialog>
                <form action={deleteClassBehaviorNote.bind(null, note.id)}>
                  <ConfirmSubmitButton
                    confirmMessage="이 기록을 삭제할까요?"
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
