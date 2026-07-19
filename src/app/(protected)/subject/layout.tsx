import { SubTabs } from "@/components/nav/SubTabs";

const TABS = [
  { href: "/subject/lessons", label: "수업 진도" },
  { href: "/subject/assessments", label: "평가·성적" },
  { href: "/subject/experiments", label: "실험·실습" },
  { href: "/subject/homework", label: "과제" },
  { href: "/subject/behavior", label: "수업 중 행동" },
  { href: "/subject/seteuk", label: "세특" },
];

export default function SubjectLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <SubTabs tabs={TABS} />
      {children}
    </div>
  );
}
