import { SubTabs } from "@/components/nav/SubTabs";

const TABS = [
  { href: "/homeroom/students", label: "학생 명단" },
  { href: "/homeroom/attendance", label: "출결 관리" },
  { href: "/homeroom/notices", label: "학급 공지·일정" },
];

export default function HomeroomLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <SubTabs tabs={TABS} />
      {children}
    </div>
  );
}
