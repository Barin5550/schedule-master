"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Flame } from "lucide-react";
import Card from "@/components/ui/Card";
import { mockHabits } from "@/lib/mock";
import type { Habit } from "@/types";
import { cn } from "@/lib/utils";

const HABITS_KEY = "schedulemaster_habits";

/** Карточка «Привычки» с сохранением состояния в localStorage. */
export default function HabitsCard() {
  // Старт с детерминированного набора (чтобы не было рассинхрона гидрации),
  // затем подменяем сохранённым состоянием после монтирования.
  const [habits, setHabits] = useState<Habit[]>(() =>
    mockHabits.map((h) => ({ ...h })),
  );

  useEffect(() => {
    try {
      const raw = localStorage.getItem(HABITS_KEY);
      if (raw) setHabits(JSON.parse(raw) as Habit[]);
    } catch {
      // ignore — используем значения по умолчанию
    }
  }, []);

  function toggle(id: string) {
    setHabits((prev) => {
      const next = prev.map((h) =>
        h.id === id ? { ...h, doneToday: !h.doneToday } : h,
      );
      try {
        localStorage.setItem(HABITS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }

  return (
    <Card hover className="flex flex-col gap-3">
      <h2 className="text-base font-semibold text-brand-text">Привычки</h2>
      <ul className="flex flex-col gap-1">
        {habits.map((habit) => {
          const done = !!habit.doneToday;
          return (
            <li key={habit.id}>
              <button
                type="button"
                onClick={() => toggle(habit.id)}
                className="group flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-white/5"
              >
                <span
                  className={cn(
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
                    done
                      ? "border-green-500 bg-green-500/20 text-green-400"
                      : "border-brand-border text-transparent group-hover:border-brand-yellow",
                  )}
                >
                  <motion.span
                    initial={false}
                    animate={{ scale: done ? 1 : 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </motion.span>
                </span>
                <span
                  className={cn(
                    "flex-1 text-sm transition-colors",
                    done
                      ? "text-brand-muted line-through"
                      : "text-brand-text",
                  )}
                >
                  {habit.name}
                </span>
                <span className="flex shrink-0 items-center gap-1 text-xs font-medium tabular-nums text-brand-muted">
                  <Flame className="h-3.5 w-3.5 text-brand-yellow" />
                  {habit.streak}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
