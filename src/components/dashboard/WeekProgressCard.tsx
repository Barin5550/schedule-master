"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { weekDayLabels } from "@/lib/mock";

const TRACK_HEIGHT = 120;

export interface WeekProgressCardProps {
  /** Процент выполнения по дням недели (Пн–Вс), 7 чисел. */
  data?: number[];
}

/** Карточка «Прогресс недели» — 7 вертикальных столбиков. */
export default function WeekProgressCard({ data }: WeekProgressCardProps) {
  const todayIndex = (new Date().getDay() + 6) % 7; // Пн = 0
  const values = data && data.length === 7 ? data : [0, 0, 0, 0, 0, 0, 0];

  return (
    <Card hover className="flex flex-col gap-4">
      <h2 className="text-base font-semibold text-brand-text">
        Прогресс недели
      </h2>
      <div
        className="flex items-end justify-between gap-2"
        style={{ height: TRACK_HEIGHT }}
      >
        {values.map((pct, i) => {
          const isToday = i === todayIndex;
          return (
            <div
              key={i}
              className="flex h-full flex-1 flex-col items-center justify-end gap-1"
            >
              <span className="text-[10px] font-medium tabular-nums text-brand-muted">
                {pct}%
              </span>
              <div
                className="relative flex w-full max-w-[18px] flex-1 items-end overflow-hidden rounded-md bg-brand-border"
              >
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: i * 0.06,
                  }}
                  className={
                    isToday
                      ? "w-full rounded-md bg-brand-yellow shadow-yellow-glow"
                      : "w-full rounded-md bg-brand-yellow/70"
                  }
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between gap-2">
        {weekDayLabels.map((label, i) => (
          <span
            key={label}
            className={
              "flex-1 text-center text-xs " +
              (i === todayIndex
                ? "font-semibold text-brand-yellow"
                : "text-brand-muted")
            }
          >
            {label}
          </span>
        ))}
      </div>
    </Card>
  );
}
