"use client";

import { motion } from "framer-motion";
import { Check, Repeat, Trash2 } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getCategory } from "@/lib/mock";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";

export interface TimelineItemProps {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onDelete?: (id: string) => void;
}

/** Одна строка расписания с чекбоксом, цветной полосой и категорией. */
export default function TimelineItem({
  task,
  index,
  onToggle,
  onDelete,
}: TimelineItemProps) {
  const category = getCategory(task.categoryId);
  const barColor =
    task.priority === "high" ? "#F5C518" : category?.color ?? "#222222";
  const done = task.isCompleted;

  const timeRange =
    task.startTime && task.endTime
      ? `${task.startTime} – ${task.endTime}`
      : task.startTime ?? "";

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.05 }}
      className="group relative flex items-stretch gap-3 rounded-xl border border-brand-border bg-brand-black/40 p-3 transition-colors hover:border-brand-yellow/40 hover:pr-10"
    >
      <span
        aria-hidden="true"
        className="w-1 shrink-0 rounded-full"
        style={{ backgroundColor: barColor }}
      />

      <button
        type="button"
        onClick={() => onToggle(task.id)}
        aria-pressed={done}
        aria-label={done ? "Отметить как невыполненное" : "Отметить как выполненное"}
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors",
          done
            ? "border-green-500 bg-green-500/20 text-green-400"
            : "border-brand-border text-transparent hover:border-brand-yellow",
        )}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </button>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "truncate text-sm font-medium transition-colors",
              done ? "text-brand-muted line-through" : "text-brand-text",
            )}
          >
            {task.title}
          </p>
          {task.isRecurring && (
            <Repeat
              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-muted"
              aria-label="Повторяющаяся задача"
            />
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {timeRange && (
            <span className="text-xs tabular-nums text-brand-muted">
              {timeRange}
            </span>
          )}
          {category && (
            <Badge variant={task.priority === "high" ? "yellow" : "gray"}>
              {category.name}
            </Badge>
          )}
        </div>
      </div>

      {/* Кнопка удаления — видна при hover */}
      {onDelete && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          aria-label="Удалить задачу"
          className="absolute right-2 top-1/2 -translate-y-1/2 hidden h-7 w-7 items-center justify-center rounded-lg text-brand-muted transition-colors hover:bg-red-500/10 hover:text-red-400 group-hover:flex"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </motion.div>
  );
}
