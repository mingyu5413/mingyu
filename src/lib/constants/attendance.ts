import type { AttendanceStatus } from "@/generated/prisma/enums";

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  PRESENT: "출석",
  LATE: "지각",
  EARLY_LEAVE: "조퇴",
  ABSENT_SICK: "결석(병)",
  ABSENT_UNEXCUSED: "결석(무단)",
  ABSENT_ETC: "결석(기타)",
};

export const ATTENDANCE_STATUS_ORDER: AttendanceStatus[] = [
  "PRESENT",
  "LATE",
  "EARLY_LEAVE",
  "ABSENT_SICK",
  "ABSENT_UNEXCUSED",
  "ABSENT_ETC",
];
