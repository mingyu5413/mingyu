import { notFound } from "next/navigation";
import { getStudent } from "@/lib/actions/students";
import { SubTabs } from "@/components/nav/SubTabs";

export const dynamic = "force-dynamic";

export default async function StudentLayout(
  props: LayoutProps<"/homeroom/students/[studentId]">
) {
  const { studentId } = await props.params;
  const id = Number(studentId);
  const student = await getStudent(id);
  if (!student) notFound();

  const base = `/homeroom/students/${id}`;
  const tabs = [
    { href: base, label: "학생 정보" },
    { href: `${base}/counseling`, label: "상담 기록" },
    { href: `${base}/career`, label: "진로활동" },
    { href: `${base}/volunteer`, label: "봉사활동" },
    { href: `${base}/autonomous`, label: "자율·자치활동" },
    { href: `${base}/club`, label: "동아리활동" },
    { href: `${base}/behavior`, label: "행동특성" },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">
        {student.academicYear}학년도 {student.number}번 {student.name}
      </h1>
      <SubTabs tabs={tabs} exact />
      {props.children}
    </div>
  );
}
