"use client";

import { useDraggable } from "@dnd-kit/core";
import { Repeat } from "lucide-react";
import type { Task } from "@/types";
import { getCategory } from "@/lib/mock";
import { cn } from "@/lib/utils";
import { hexToRgba, taskDuration, timeToMinutes } from "./scheduleUtils";

interface TaskBlockProps {
  task: Task;
  trackHeight: number;
  onClick: (task: Task) => void;
  onResize: (task: Task, deltaY: number, committed: boolean) => void;
  /** Активный сдвиг по Y во время перетаскивания. */
  liveOffsetY?: number;
}

export default function TaskBlock({
  task,
  trackHeight,
  onClick,
  onResize,
  liveOffsetY = 0,
}: TaskBlockProps) {
  const category = getCategory(task.categoryId);
  const color = category?.color ?? "#F5C518";

  const startMin = timeToMinutes(task.startTime);
  const duration = taskDuration(task);
  const top = (startMin / (24 * 60)) * trackHeight + liveOffsetY;
  const height = Math.max(24, (duration / (24 * 60)) * trackHeight);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: `task-${task.id}` });

  const dragY = transform?.y ?? 0;

  function handleResizeStart(e: React.PointerEvent) {
    e.preventDefault();
    e.stopPropagation();
    const startY = e.clientY;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

    function move(ev: PointerEvent) {
      onResize(task, ev.clientY - startY, false);
    }
    function up(ev: PointerEvent) {
      onResize(task, ev.clientY - startY, true);
      target.releasePointerCapture(e.pointerId);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "absolute left-1 right-1 z-10 select-none overflow-hidden rounded-lg border-l-4 px-2 py-1 transition-shadow",
        isDragging ? "z-30 cursor-grabbing shadow-yellow-glow" : "cursor-grab",
      )}
      style={{
        top,
        height,
        transform: `translateY(${dragY}px)`,
        backgroundColor: hexToRgba(color, 0.16),
        borderLeftColor: color,
      }}
      onClick={(e) => {
        // Не открывать модалку, если только что перетаскивали
        if (Math.abs(dragY) > 2) return;
        e.stopPropagation();
        onClick(task);
      }}
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start gap-1">
        <p className="flex-1 truncate text-xs font-semibold text-brand-text">
          {task.title}
        </p>
        {task.isRecurring && (
          <Repeat className="mt-0.5 h-3 w-3 shrink-0 text-brand-muted" />
        )}
      </div>
      {height > 34 && (
        <p className="truncate text-[10px] text-brand-muted">
          {task.startTime}
          {task.endTime ? ` – ${task.endTime}` : ""}
        </p>
      )}

      {/* Ручка изменения длительности */}
      <div
        onPointerDown={handleResizeStart}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 flex h-2.5 cursor-ns-resize items-center justify-center"
        aria-label="Изменить длительность"
      >
        <span className="h-1 w-6 rounded-full bg-white/30" />
      </div>
    </div>
  );
}
