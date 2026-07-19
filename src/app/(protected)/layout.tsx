import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { logout } from "@/lib/auth";
import { TopTabs } from "@/components/nav/TopTabs";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireSession();

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="flex items-center justify-between border-b bg-background px-6 py-3">
        <TopTabs />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            nativeButton={false}
            render={<Link href="/settings">설정</Link>}
          />
          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm">
              로그아웃
            </Button>
          </form>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
