"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { mockCategories } from "@/lib/mock";
import type { Priority, RecurrencePattern } from "@/types";
import { cn } from "@/lib/utils";
import { recurrenceLabels } from "./scheduleUtils";

export interface ScheduleTaskDraft {
  title: string;
  description?: string | null;
  date: string;
  startTime: string;
  endTime: string;
  categoryId: string;
  priority: Priority;
  isRecurring: boolean;
  recurrencePattern: RecurrencePattern;
}

interface ScheduleTaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (draft: ScheduleTaskDraft) => void;
  /** Дата по умолчанию (YYYY-MM-DD). */
  defaultDate: string;
  /** Время начала по умолчанию (HH:mm). */
  defaultStart?: string;
}

const priorities: { key: Priority; label: string }[] = [
  { key: "low", label: "Низкий" },
  { key: "medium", label: "Средний" },
  { key: "high", label: "Высокий" },
];

const recurrenceOptions: { key: string; pattern: RecurrencePattern }[] = [
  { key: "none", pattern: null },
  { key: "daily", pattern: "daily" },
  { key: "weekdays", pattern: "weekdays" },
  { key: "weekly", pattern: "weekly" },
  { key: "custom", pattern: "custom" },
];

function addHour(time: string): string {
  const [h, m] = time.split(":").map((x) => parseInt(x, 10));
  const next = (Number.isNaN(h) ? 9 : h) + 1;
  return `${String(Math.min(next, 23)).padStart(2, "0")}:${String(
    Number.isNaN(m) ? 0 : m,
  ).padStart(2, "0")}`;
}

export default function ScheduleTaskModal({
  open,
  onClose,
  onSave,
  defaultDate,
  defaultStart = "09:00",
}: ScheduleTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState(defaultStart);
  const [endTime, setEndTime] = useState(addHour(defaultStart));
  const [categoryId, setCategoryId] = useState(mockCategories[0]?.id ?? "work");
  const [priority, setPriority] = useState<Priority>("medium");
  const [recurrenceKey, setRecurrenceKey] = useState("none");
  const [error, setError] = useState("");

  // Сброс полей при открытии
  useEffect(() => {
    if (open) {
      setTitle("");
      setDescription("");
      setDate(defaultDate);
      setStartTime(defaultStart);
      setEndTime(addHour(defaultStart));
      setCategoryId(mockCategories[0]?.id ?? "work");
      setPriority("medium");
      setRecurrenceKey("none");
      setError("");
    }
  }, [open, defaultDate, defaultStart]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Введите название задачи");
      return;
    }
    const option = recurrenceOptions.find((o) => o.key === recurrenceKey);
    const pattern = option?.pattern ?? null;
    onSave({
      title: title.trim(),
      description: description.trim() || null,
      date,
      startTime,
      endTime,
      categoryId,
      priority,
      isRecurring: pattern !== null,
      recurrencePattern: pattern,
    });
  }

  return (
    <Modal open={open} onClose={onClose} title="Новая задача">
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Название"
          placeholder="Например, Глубокая работа"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
          error={error}
          autoFocus
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-muted">
            Описание
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Необязательно"
            rows={2}
            className="w-full rounded-xl border border-brand-border bg-brand-black px-4 py-2.5 text-brand-text placeholder:text-brand-muted/70 transition-all duration-200 focus:border-brand-yellow focus:shadow-yellow-glow focus:outline-none"
          />
        </div>

        <Input
          label="Дата"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Начало"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
          <Input
            label="Конец"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-brand-muted">
            Категория
          </span>
          <div className="flex flex-wrap gap-2">
            {mockCategories.map((cat) => {
              const active = cat.id === categoryId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryId(cat.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "border-brand-yellow bg-brand-yellow/10 text-brand-text"
                      : "border-brand-border text-brand-muted hover:text-brand-text",
                  )}
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-brand-muted">
            Приоритет
          </span>
          <div className="inline-flex rounded-lg border border-brand-border p-1">
            {priorities.map((p) => {
              const active = p.key === priority;
              return (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setPriority(p.key)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-yellow text-brand-black"
                      : "text-brand-muted hover:text-brand-text",
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="mb-1.5 block text-sm font-medium text-brand-muted">
            Повторять
          </span>
          <div className="flex flex-wrap gap-2">
            {recurrenceOptions.map((o) => {
              const active = o.key === recurrenceKey;
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => setRecurrenceKey(o.key)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                    active
                      ? "border-brand-yellow bg-brand-yellow/10 text-brand-text"
                      : "border-brand-border text-brand-muted hover:text-brand-text",
                  )}
                >
                  {recurrenceLabels[o.key]}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" variant="primary">
            Сохранить
          </Button>
        </div>
      </form>
    </Modal>
  );
}
