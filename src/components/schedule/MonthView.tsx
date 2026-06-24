"use client";

import { useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Repeat } from "lucide-react";
import type { Task } from "@/types";
import { getCategory } from "@/lib/mock";
import EmptyState from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";
import {
  addDays,
  formatDayLabel,
  isSameDay,
  startOfWeek,
  toISODate,
} from "./scheduleUtils";

const weekDayShort = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

interface MonthViewProps {
  date: Date;
  tasks: Task[];
  selectedDay: Date | null;
  onSelectDay: (d: Date) => void;
  onTaskClick: (task: Task) => void;
}

export default function MonthView({
  date,
  tasks,
  selectedDay,
  onSelectDay,
  onTaskClick,
}: MonthViewProps) {
  const today = new Date();

  // Сетка из 6 недель, начиная с понедельника недели, содержащей 1-е число
  const cells = useMemo(() => {
    const first = new Date(date.getFullYear(), date.getMonth(), 1, 12);
    const gridStart = startOfWeek(first);
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [date]);

  const tasksByDate = useMemo(() => {
    const map: Record<string, Task[]> = {};
    for (const t of tasks) {
      (map[t.date] ??= []).push(t);
    }
    return map;
  }, [tasks]);

  const selectedTasks = selectedDay
    ? (tasksByDate[toISODate(selectedDay)] ?? [])
    : [];

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-brand-border bg-brand-card">
        {/* Шапка дней недели */}
        <div className="grid grid-cols-7 border-b border-brand-border">
          {weekDayShort.map((d) => (
            <div
              key={d}
              className="py-2 text-center text-xs font-medium text-brand-muted"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Сетка дней */}
        <div className="grid grid-cols-7">
          {cells.map((cell) => {
            const iso = toISODate(cell);
            const inMonth = cell.getMonth() === date.getMonth();
            const isToday = isSameDay(cell, today);
            const isSelected = selectedDay
              ? isSameDay(cell, selectedDay)
              : false;
            const dayTasks = tasksByDate[iso] ?? [];
            return (
              <button
                key={iso}
                type="button"
                onClick={() => onSelectDay(cell)}
                className={cn(
                  "flex min-h-[72px] flex-col items-start gap-1 border-b border-r border-brand-border/50 p-1.5 text-left transition-colors hover:bg-white/5",
                  !inMonth && "opacity-40",
                  isSelected && "bg-brand-yellow/10",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium",
                    isToday
                      ? "bg-brand-yellow text-brand-black"
                      : "text-brand-text",
                  )}
                >
                  {cell.getDate()}
                </span>
                <div className="flex flex-wrap gap-1">
                  {dayTasks.slice(0, 3).map((t) => {
                    const cat = getCategory(t.categoryId);
                    return (
                      <span
                        key={t.id}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: cat?.color ?? "#F5C518" }}
                      />
                    );
                  })}
                  {dayTasks.length > 3 && (
                    <span className="text-[9px] leading-none text-brand-muted">
                      +{dayTasks.length - 3}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Панель выбранного дня */}
      <AnimatePresence mode="wait">
        {selectedDay && (
          <motion.div
            key={toISODate(selectedDay)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-brand-border bg-brand-card p-5"
          >
            <h3 className="mb-3 text-sm font-semibold capitalize text-brand-text">
              {formatDayLabel(selectedDay)}
            </h3>
            {selectedTasks.length === 0 ? (
              <EmptyState
                title="Нет задач"
                description="На этот день задачи не запланированы."
              />
            ) : (
              <ul className="space-y-2">
                {selectedTasks
                  .slice()
                  .sort((a, b) =>
                    (a.startTime ?? "").localeCompare(b.startTime ?? ""),
                  )
                  .map((t) => {
                    const cat = getCategory(t.categoryId);
                    return (
                      <li key={t.id}>
                        <button
                          type="button"
                          onClick={() => onTaskClick(t)}
                          className="flex w-full items-center gap-3 rounded-lg border border-brand-border px-3 py-2 text-left transition-colors hover:border-brand-yellow"
                        >
                          <span
                            className="h-8 w-1 shrink-0 rounded-full"
                            style={{ backgroundColor: cat?.color ?? "#F5C518" }}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="flex items-center gap-1 truncate text-sm font-medium text-brand-text">
                              {t.title}
                              {t.isRecurring && (
                                <Repeat className="h-3 w-3 shrink-0 text-brand-muted" />
                              )}
                            </p>
                            <p className="text-xs text-brand-muted">
                              {t.startTime ?? "—"}
                              {t.endTime ? ` – ${t.endTime}` : ""}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
              </ul>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
