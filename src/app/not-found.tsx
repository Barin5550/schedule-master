import Link from "next/link";
import Button from "@/components/ui/Button";
import { Logo } from "@/components/layout/Header";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-grid mask-radial opacity-60" />
      <div className="relative z-10 flex flex-col items-center">
        <Logo className="mb-6 text-3xl" />
        <p className="text-7xl font-bold text-brand-yellow">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Страница не найдена</h1>
        <p className="mt-2 max-w-sm text-brand-muted">
          Похоже, этот блок выпал из расписания. Вернись на главную и продолжай
          двигаться к цели.
        </p>
        <Link href="/" className="mt-8">
          <Button variant="primary">На главную</Button>
        </Link>
      </div>
    </div>
  );
}
