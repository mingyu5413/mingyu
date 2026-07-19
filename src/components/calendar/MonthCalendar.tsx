import Link from "next/link";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  format,
} from "date-fns";
import { cn } from "@/lib/utils";

export type CalendarEvent = {
  date: Date;
  label: string;
  href?: string;
  variant?: "default" | "muted";
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function MonthCalendar({
  year,
  month,
  events,
  dayHref,
}: {
  year: number;
  month: number;
  events: CalendarEvent[];
  dayHref?: (dateStr: string) => string;
}) {
  const monthStart = startOfMonth(new Date(year, month - 1, 1));
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  return (
    <div className="rounded-lg border">
      <div className="grid grid-cols-7 border-b">
        {WEEKDAYS.map((w) => (
          <div key={w} className="p-2 text-center text-xs font-medium text-muted-foreground">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const dayEvents = events.filter((e) => isSameDay(e.date, day));
          const inMonth = isSameMonth(day, monthStart);
          const cell = (
            <div
              className={cn(
                "min-h-24 border-b border-r p-1.5 last:border-r-0",
                !inMonth && "bg-muted/30"
              )}
            >
              <div
                className={cn(
                  "mb-1 text-xs",
                  !inMonth && "text-muted-foreground/50",
                  isToday(day) && "font-bold text-primary"
                )}
              >
                {day.getDate()}
              </div>
              <div className="space-y-0.5">
                {dayEvents.map((event, i) =>
                  event.href ? (
                    <Link
                      key={i}
                      href={event.href}
                      className="block truncate rounded bg-primary/10 px-1 py-0.5 text-xs hover:bg-primary/20"
                    >
                      {event.label}
                    </Link>
                  ) : (
                    <div
                      key={i}
                      className="truncate rounded bg-muted px-1 py-0.5 text-xs text-muted-foreground"
                    >
                      {event.label}
                    </div>
                  )
                )}
              </div>
            </div>
          );

          return dayHref ? (
            <Link key={dateStr} href={dayHref(dateStr)} className="block hover:bg-muted/50">
              {cell}
            </Link>
          ) : (
            <div key={dateStr}>{cell}</div>
          );
        })}
      </div>
    </div>
  );
}
