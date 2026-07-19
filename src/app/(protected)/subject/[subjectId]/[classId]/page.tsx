import { redirect } from "next/navigation";

export default async function SubjectClassIndexPage(
  props: PageProps<"/subject/[subjectId]/[classId]">
) {
  const { subjectId, classId } = await props.params;
  redirect(`/subject/${subjectId}/${classId}/students`);
}
