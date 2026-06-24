"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Анимированный счётчик от 0 до `end`. Запускается, когда `start` становится true
 * (например, при появлении элемента во вьюпорте).
 */
export function useCountUp(end: number, start = true, durationMs = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setValue(end * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setValue(end);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, start, durationMs]);

  return value;
}
