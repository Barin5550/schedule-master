"use client";

import { Repeat } from "lucide-react";
import type { Task } from "@/types";
import { getCategory } from "@/lib/mock";
import { cn } from "@/lib/utils";
import {
  HOURS,
  addDays,
  hexToRgba,
  isSameDay,
  startOfWeek,
  taskDuration,
  timeToMinutes,
  toISODate,
} from "./scheduleUtils";

const TRACK_HEIGHT = 16 * 60; // компактнее, чем день: 16px на час? -> 0.667px/мин
const PX_PER_MIN = TRACK_HEIGHT / (24 * 60);
const HOUR_HEIGHT = TRACK_HEIGHT / 24;

const weekDayShort = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

interface WeekViewProps {
  date: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

export default function WeekView({ date, tasks, onTaskClick }: WeekViewProps) {
  const monday = startOfWeek(date);
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => addDays(monday, i));

  return (
    <div className="overflow-x-auto rounded-xl border border-brand-border bg-brand-card">
      <div className="min-w-[640px]">
        {/* Шапка дней */}
        <div className="sticky top-0 z-10 flex border-b border-brand-border bg-brand-card">
          <div className="w-12 shrink-0" />
          {days.map((d) => {
            const isToday = isSameDay(d, today);
            return (
              <div
                key={d.toISOString()}
                className="flex flex-1 flex-col items-center py-2"
              >
                <span className="text-xs text-brand-muted">
                  {weekDayShort[(d.getDay() + 6) % 7]}
                </span>
                <span
                  className={cn(
                    "mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
                    isToday
                      ? "bg-brand-yellow text-brand-black"
                      : "text-brand-text",
                  )}
                >
                  {d.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        {/* Сетка */}
        <div className="relative flex" style={{ height: TRACK_HEIGHT }}>
          {/* Часы */}
          <div className="w-12 shrink-0 border-r border-brand-border">
            {HOURS.slice(0, 24).map((h) => (
              <div
                key={h}
                className="relative"
                style={{ height: HOUR_HEIGHT }}
              >
                <span className="absolute right-1.5 -top-1.5 text-[10px] text-brand-muted">
                  {h === 0 ? "" : String(h).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>

          {/* Колонки дней */}
          {days.map((d) => {
            const iso = toISODate(d);
            const dayTasks = tasks.filter((t) => t.date === iso);
            return (
              <div
                key={iso}
                className="relative flex-1 border-r border-brand-border/40 last:border-r-0"
              >
                {HOURS.map((h) => (
                  <div
                    key={h}
                    className="absolute inset-x-0 border-t border-brand-border/40"
                    style={{ top: h * HOUR_HEIGHT }}
                  />
                ))}
                {dayTasks.map((task) => {
                  const cat = getCategory(task.categoryId);
                  const color = cat?.color ?? "#F5C518";
                  const top = timeToMinutes(task.startTime) * PX_PER_MIN;
                  const height = Math.max(
                    14,
                    taskDuration(task) * PX_PER_MIN,
                  );
                  return (
                    <button
                      key={task.id}
                      type="button"
                      onClick={() => onTaskClick(task)}
                      className="absolute left-0.5 right-0.5 overflow-hidden rounded-md border-l-2 px-1 py-0.5 text-left"
                      style={{
                        top,
                        height,
                        backgroundColor: hexToRgba(color, 0.18),
                        borderLeftColor: color,
                      }}
                    >
                      <span className="flex items-center gap-0.5">
                        <span className="truncate text-[10px] font-medium text-brand-text">
                          {task.title}
                        </span>
                        {task.isRecurring && (
                          <Repeat className="h-2.5 w-2.5 shrink-0 text-brand-muted" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
