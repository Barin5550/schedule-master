"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Lightbulb,
  User,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Logo } from "@/components/layout/Header";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Дашборд", href: "/dashboard", icon: LayoutDashboard },
  { label: "Расписание", href: "/schedule", icon: CalendarDays },
  { label: "Советы", href: "/tips", icon: Lightbulb },
  { label: "Профиль", href: "/profile", icon: User },
];

export default function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();

  const displayName =
    (user?.user_metadata?.first_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    "Гость";
  const email = user?.email ?? "demo@schedulemaster.app";
  const initials = displayName.slice(0, 2).toUpperCase();

  async function handleSignOut() {
    await signOut();
    onNavigate?.();
    router.push("/auth/login");
  }

  return (
    <div className="flex h-full flex-col border-r border-brand-border bg-brand-card">
      <div className="flex h-16 items-center gap-2 border-b border-brand-border px-6">
        <Link href="/" className="flex items-center gap-2" onClick={onNavigate}>
          <Logo />
          <span className="text-sm font-semibold">ScheduleMaster</span>
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-brand-yellow text-brand-black"
                  : "text-brand-muted hover:bg-white/5 hover:text-brand-text",
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-sm font-bold text-brand-black">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{displayName}</p>
            <p className="truncate text-xs text-brand-muted">{email}</p>
          </div>
          <button
            onClick={handleSignOut}
            aria-label="Выйти"
            className="rounded-lg p-2 text-brand-muted transition-colors hover:bg-white/5 hover:text-red-400"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
