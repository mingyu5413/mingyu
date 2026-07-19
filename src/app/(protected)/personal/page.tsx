import {
  getPersonalTasks,
  createPersonalTask,
  updatePersonalTask,
  deletePersonalTask,
  toggleTaskDone,
} from "@/lib/actions/personalTasks";
import { PersonalTaskForm } from "@/components/personal/PersonalTaskForm";
import { MonthCalendar } from "@/components/calendar/MonthCalendar";
import { MonthNav } from "@/components/attendance/MonthNav";
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
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function PersonalTasksPage(props: PageProps<"/personal">) {
  const searchParams = await props.searchParams;
  const now = new Date();
  const year = Number(searchParams.year) || now.getFullYear();
  const month = Number(searchParams.month) || now.getMonth() + 1;

  const tasks = await getPersonalTasks();
  const events = tasks.map((t) => ({
    date: t.date,
    label: t.title,
    variant: t.done ? ("muted" as const) : ("default" as const),
  }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">개인업무</h1>
        <Dialog>
          <DialogTrigger render={<Button size="sm">일정 추가</Button>} />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>일정 추가</DialogTitle>
            </DialogHeader>
            <PersonalTaskForm action={createPersonalTask} submitLabel="추가" />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <MonthNav year={year} month={month} basePath="/personal" />
          <MonthCalendar year={year} month={month} events={events} />
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-medium text-muted-foreground">전체 일정</h2>
          {tasks.length === 0 && (
            <p className="text-sm text-muted-foreground">등록된 일정이 없습니다.</p>
          )}
          {tasks.map((task) => (
            <Card key={task.id} className={cn(task.done && "opacity-50")}>
              <CardContent className="space-y-2 py-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className={cn("font-medium", task.done && "line-through")}>{task.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(task.date).toLocaleDateString("ko-KR")}
                      {task.dueDate &&
                        ` · 마감 ${new Date(task.dueDate).toLocaleDateString("ko-KR")}`}
                    </p>
                    {task.content && (
                      <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                        {task.content}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1">
                  <form action={toggleTaskDone.bind(null, task.id)}>
                    <Button type="submit" size="sm" variant={task.done ? "outline" : "default"}>
                      {task.done ? "완료 취소" : "완료"}
                    </Button>
                  </form>
                  <Dialog>
                    <DialogTrigger render={<Button variant="outline" size="sm">수정</Button>} />
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>일정 수정</DialogTitle>
                      </DialogHeader>
                      <PersonalTaskForm
                        action={updatePersonalTask.bind(null, task.id)}
                        defaultValues={task}
                        submitLabel="수정 저장"
                      />
                    </DialogContent>
                  </Dialog>
                  <form action={deletePersonalTask.bind(null, task.id)}>
                    <ConfirmSubmitButton
                      confirmMessage="이 일정을 삭제할까요?"
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
    </div>
  );
}
