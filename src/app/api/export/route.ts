import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    students,
    attendances,
    counselingNotes,
    careerActivities,
    volunteerActivities,
    autonomousActivities,
    clubActivities,
    behaviorCharacteristics,
    classNotices,
    lessonSessions,
    assessments,
    scores,
    experiments,
    homework,
    homeworkSubmissions,
    classBehaviorNotes,
    seteukEntries,
    seteukDrafts,
  ] = await Promise.all([
    db.student.findMany(),
    db.attendance.findMany(),
    db.counselingNote.findMany(),
    db.careerActivity.findMany(),
    db.volunteerActivity.findMany(),
    db.autonomousActivity.findMany(),
    db.clubActivity.findMany(),
    db.behaviorCharacteristic.findMany(),
    db.classNotice.findMany(),
    db.lessonSession.findMany(),
    db.assessment.findMany(),
    db.score.findMany(),
    db.experiment.findMany(),
    db.homework.findMany(),
    db.homeworkSubmission.findMany(),
    db.classBehaviorNote.findMany(),
    db.seteukEntry.findMany(),
    db.seteukDraft.findMany(),
  ]);

  const data = {
    exportedAt: new Date().toISOString(),
    students,
    attendances,
    counselingNotes,
    careerActivities,
    volunteerActivities,
    autonomousActivities,
    clubActivities,
    behaviorCharacteristics,
    classNotices,
    lessonSessions,
    assessments,
    scores,
    experiments,
    homework,
    homeworkSubmissions,
    classBehaviorNotes,
    seteukEntries,
    seteukDrafts,
  };

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="class-manager-backup-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
