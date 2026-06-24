"use client";

import { useEffect, useRef, useState } from "react";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import type { Task } from "@/types";
import { cn } from "@/lib/utils";
import TaskBlock from "./TaskBlock";
import {
  HOURS,
  isSameDay,
  minutesToTime,
  taskDuration,
  timeToMinutes,
} from "./scheduleUtils";

const TRACK_HEIGHT = 24 * 60; // 1px = 1 минута, удобно и точно
const HOUR_HEIGHT = TRACK_HEIGHT / 24;

interface DayViewProps {
  date: Date;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onTaskUpdate: (id: string, patch: Partial<Task>) => void;
  onEmptyClick: (startTime: string) => void;
}

export default function DayView({
  date,
  tasks,
  onTaskClick,
  onTaskUpdate,
  onEmptyClick,
}: DayViewProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => new Date());
  // Временный сдвиг длительности при ресайзе: { [id]: deltaMinutes }
  const [resizeDelta, setResizeDelta] = useState<Record<string, number>>({});

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60 * 1000);
    return () => clearInterval(t);
  }, []);

  function handleDragEnd(event: DragEndEvent) {
    const { active, delta } = event;
    const id = String(active.id).replace("task-", "");
    const task = tasks.find((x) => x.id === id);
    if (!task) return;

    // delta.y в пикселях == минуты (1px = 1мин). Снап к 15 минутам.
    const moved = Math.round(delta.y / 15) * 15;
    if (moved === 0) return;

    const duration = taskDuration(task);
    let newStart = timeToMinutes(task.startTime) + moved;
    newStart = Math.max(0, Math.min(24 * 60 - duration, newStart));
    const newEnd = newStart + duration;

    onTaskUpdate(id, {
      startTime: minutesToTime(newStart),
      endTime: minutesToTime(newEnd),
    });
  }

  function handleResize(task: Task, deltaY: number, committed: boolean) {
    // deltaY px == минуты. Снап к 15.
    const snapped = Math.round(deltaY / 15) * 15;
    if (!committed) {
      setResizeDelta((prev) => ({ ...prev, [task.id]: snapped }));
      return;
    }
    setResizeDelta((prev) => {
      const next = { ...prev };
      delete next[task.id];
      return next;
    });
    const start = timeToMinutes(task.startTime);
    const duration = taskDuration(task);
    const newDuration = Math.max(15, duration + snapped);
    const newEnd = Math.min(24 * 60, start + newDuration);
    onTaskUpdate(task.id, { endTime: minutesToTime(newEnd) });
  }

  function handleTrackClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return;
    const y = e.clientY - rect.top;
    const minutes = Math.max(0, Math.min(24 * 60 - 15, y));
    const snapped = Math.round(minutes / 30) * 30;
    onEmptyClick(minutesToTime(snapped));
  }

  const showNowLine = isSameDay(date, now);
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const nowTop = (nowMinutes / (24 * 60)) * TRACK_HEIGHT;

  // Применяем временный resize-сдвиг для визуального превью через endTime
  const renderTasks = tasks.map((t) => {
    const d = resizeDelta[t.id];
    if (d === undefined) return t;
    const start = timeToMinutes(t.startTime);
    const dur = taskDuration(t);
    const newEnd = Math.min(24 * 60, start + Math.max(15, dur + d));
    return { ...t, endTime: minutesToTime(newEnd) };
  });

  return (
    <div className="overflow-y-auto rounded-xl border border-brand-border bg-brand-card">
      <div className="relative flex" style={{ height: TRACK_HEIGHT }}>
        {/* Колонка часов */}
        <div className="w-14 shrink-0 border-r border-brand-border">
          {HOURS.slice(0, 24).map((h) => (
            <div
              key={h}
              className="relative text-right"
              style={{ height: HOUR_HEIGHT }}
            >
              <span className="absolute right-2 -top-2 text-[11px] text-brand-muted">
                {h === 0 ? "" : `${String(h).padStart(2, "0")}:00`}
              </span>
            </div>
          ))}
        </div>

        {/* Трек */}
        <DndContext onDragEnd={handleDragEnd}>
          <div
            ref={trackRef}
            onClick={handleTrackClick}
            className="relative flex-1"
            style={{ height: TRACK_HEIGHT }}
          >
            {/* Часовые линии */}
            {HOURS.map((h) => (
              <div
                key={h}
                className={cn(
                  "absolute inset-x-0 border-t",
                  h % 1 === 0 ? "border-brand-border/60" : "",
                )}
                style={{ top: h * HOUR_HEIGHT }}
              />
            ))}

            {/* Блоки задач */}
            {renderTasks.map((task) => (
              <TaskBlock
                key={task.id}
                task={task}
                trackHeight={TRACK_HEIGHT}
                onClick={onTaskClick}
                onResize={handleResize}
              />
            ))}

            {/* Линия текущего времени */}
            {showNowLine && (
              <div
                className="pointer-events-none absolute inset-x-0 z-20 flex items-center"
                style={{ top: nowTop }}
              >
                <span className="-ml-1 h-2 w-2 rounded-full bg-brand-yellow" />
                <span className="h-0 flex-1 border-t border-dashed border-brand-yellow" />
              </div>
            )}
          </div>
        </DndContext>
      </div>
    </div>
  );
}
