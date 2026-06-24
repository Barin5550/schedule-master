"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Анимированный счётчик до `end`. Запускается, когда `start` становится true
 * (например, при появлении элемента во вьюпорте). При изменении `end` плавно
 * доезжает от текущего значения к новому — без сброса в ноль, поэтому живые
 * обновления (отметил/добавил задачу) не «моргают».
 */
export function useCountUp(end: number, start = true, durationMs = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  // Текущее отображаемое значение — стартовая точка следующего твина.
  const fromRef = useRef(0);

  useEffect(() => {
    if (!start) return;
    const from = fromRef.current;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const next = from + (end - from) * eased;
      fromRef.current = next;
      setValue(next);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = end;
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
