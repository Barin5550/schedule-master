"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Schedule", href: "/schedule" },
  { label: "Tips", href: "/tips" },
  { label: "Profile", href: "/profile" },
];

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("text-xl font-bold tracking-tight", className)}>
      S<span className="text-brand-yellow">•</span>M
    </span>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-border bg-brand-black/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Logo />
          <span className="hidden text-sm font-semibold text-brand-text sm:inline">
            ScheduleMaster
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative py-1 text-sm font-medium transition-colors",
                  active
                    ? "text-brand-yellow"
                    : "text-brand-muted hover:text-brand-text",
                )}
              >
                {item.label}
                {active && (
                  <span className="absolute -bottom-0.5 left-0 h-0.5 w-full rounded-full bg-brand-yellow" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/auth/login"
            className="text-sm font-medium text-brand-muted transition-colors hover:text-brand-text"
          >
            Войти
          </Link>
          <Link
            href="/auth/register"
            className="rounded-xl bg-brand-yellow px-4 py-2 text-sm font-semibold text-brand-black transition-all duration-200 hover:bg-brand-yellow-hover hover:shadow-yellow-glow"
          >
            Начать
          </Link>
        </div>
      </div>
    </header>
  );
}
