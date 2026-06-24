"use client";

import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { CalendarClock } from "lucide-react";
import type { Task } from "@/types";
import TimelineItem from "./TimelineItem";

export interface TodayTimelineProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onAdd?: () => void;
}

/** Расписание на сегодня с индикатором текущего времени. */
export default function TodayTimeline({
  tasks,
  onToggle,
  onAdd,
}: TodayTimelineProps) {
  const [nowLabel, setNowLabel] = useState<string>("");
  // Индекс позиции, перед которой вставить линию текущего времени.
  const [nowIndex, setNowIndex] = useState<number>(-1);

  useEffect(() => {
    function update() {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      setNowLabel(
        now.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      );

      const toMinutes = (t?: string | null) => {
        if (!t) return Number.POSITIVE_INFINITY;
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      };

      let idx = tasks.findIndex((task) => toMinutes(task.startTime) >= minutes);
      if (idx === -1) idx = tasks.length;
      setNowIndex(idx);
    }
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [tasks]);

  const NowLine = (
    <div className="relative flex items-center gap-2 py-1" aria-hidden="true">
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-yellow opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-yellow" />
      </span>
      <span className="h-px flex-1 bg-brand-yellow/60" />
      <span className="shrink-0 text-[10px] font-medium tabular-nums text-brand-yellow">
        {nowLabel}
      </span>
    </div>
  );

  return (
    <Card className="flex h-full flex-col gap-3">
      <h2 className="text-lg font-semibold text-brand-text">
        Расписание на сегодня
      </h2>

      {tasks.length === 0 ? (
        <EmptyState
          title="На сегодня задач нет"
          description="Добавьте первую задачу, чтобы спланировать день."
          icon={<CalendarClock className="h-8 w-8 text-brand-yellow" />}
          action={
            onAdd && (
              <Button variant="outline" size="sm" onClick={onAdd}>
                Добавить первую задачу
              </Button>
            )
          }
        />
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task, i) => (
            <div key={task.id} className="flex flex-col gap-2">
              {i === nowIndex && NowLine}
              <TimelineItem task={task} index={i} onToggle={onToggle} />
            </div>
          ))}
          {nowIndex >= tasks.length && NowLine}
        </div>
      )}
    </Card>
  );
}
