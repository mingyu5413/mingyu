import { notFound } from "next/navigation";
import { getSubjectClass } from "@/lib/actions/subjectClasses";
import { SubTabs } from "@/components/nav/SubTabs";

export const dynamic = "force-dynamic";

export default async function SubjectClassLayout(
  props: LayoutProps<"/subject/[subjectId]/[classId]">
) {
  const { subjectId, classId } = await props.params;
  const subjectClass = await getSubjectClass(Number(classId));
  if (!subjectClass || subjectClass.subjectId !== Number(subjectId)) notFound();

  const base = `/subject/${subjectId}/${classId}`;
  const tabs = [
    { href: `${base}/students`, label: "학생 명단" },
    { href: `${base}/lessons`, label: "수업 진도" },
    { href: `${base}/assessments`, label: "평가·성적" },
    { href: `${base}/experiments`, label: "실험·실습" },
    { href: `${base}/homework`, label: "과제" },
    { href: `${base}/behavior`, label: "수업 중 행동" },
    { href: `${base}/seteuk`, label: "세특" },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        {subjectClass.subject.name} · {subjectClass.academicYear} {subjectClass.label}
      </h1>
      <SubTabs tabs={tabs} />
      {props.children}
    </div>
  );
}
