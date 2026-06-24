"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // В реальном проекте здесь был бы вызов системы логирования.
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-6xl font-bold text-brand-yellow">Упс</p>
      <h1 className="mt-4 text-2xl font-semibold">Что-то пошло не так</h1>
      <p className="mt-2 max-w-sm text-brand-muted">
        Произошла непредвиденная ошибка. Попробуй обновить — обычно это помогает.
      </p>
      <div className="mt-8">
        <Button variant="primary" onClick={reset}>
          Попробовать снова
        </Button>
      </div>
    </div>
  );
}
