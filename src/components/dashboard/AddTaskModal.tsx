"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { mockCategories, todayISO } from "@/lib/mock";
import type { Priority, Task } from "@/types";
import { cn } from "@/lib/utils";

export interface AddTaskModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (task: Task) => void;
}

const priorityOptions: { value: Priority; label: string }[] = [
  { value: "low", label: "Низкий" },
  { value: "medium", label: "Средний" },
  { value: "high", label: "Высокий" },
];

const inputClasses =
  "w-full rounded-xl border border-brand-border bg-brand-black px-4 py-2.5 text-brand-text placeholder:text-brand-muted/70 transition-all duration-200 focus:border-brand-yellow focus:shadow-yellow-glow focus:outline-none";

export default function AddTaskModal({
  open,
  onClose,
  onAdd,
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(todayISO());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [categoryId, setCategoryId] = useState<string>(mockCategories[0].id);
  const [priority, setPriority] = useState<Priority>("medium");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [timeError, setTimeError] = useState("");

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Сброс формы при открытии.
  useEffect(() => {
    if (open) {
      setTitle("");
      setDate(todayISO());
      setStartTime("09:00");
      setEndTime("10:00");
      setCategoryId(mockCategories[0].id);
      setPriority("medium");
      setNote("");
      setError("");
      setTimeError("");
      setDropdownOpen(false);
    }
  }, [open]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [dropdownOpen]);

  const selectedCategory = mockCategories.find((c) => c.id === categoryId);

  function handleSave() {
    if (!title.trim()) {
      setError("Введите название задачи");
      return;
    }
    if (startTime && endTime && endTime <= startTime) {
      setTimeError("Время конца должно быть позже начала");
      return;
    }
    const task: Task = {
      id: `new-${Date.now()}`,
      title: title.trim(),
      description: note.trim() || null,
      date,
      startTime: startTime || null,
      endTime: endTime || null,
      categoryId,
      priority,
      isCompleted: false,
      isRecurring: false,
      recurrencePattern: null,
    };
    onAdd(task);
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} title="Новая задача">
      <div className="flex flex-col gap-4">
        <Input
          label="Название"
          placeholder="Например: Подготовить презентацию"
          value={title}
          error={error}
          autoFocus
          onChange={(e) => {
            setTitle(e.target.value);
            if (error) setError("");
          }}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-muted">
            Дата
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={cn(inputClasses, "[color-scheme:dark]")}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-muted">
              Начало
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                if (timeError) setTimeError("");
              }}
              className={cn(inputClasses, "[color-scheme:dark]")}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-brand-muted">
              Конец
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                if (timeError) setTimeError("");
              }}
              className={cn(inputClasses, "[color-scheme:dark]")}
            />
          </div>
        </div>
        {timeError && <p className="-mt-2 text-sm text-red-400">{timeError}</p>}

        {/* Категория — кастомный дропдаун */}
        <div ref={dropdownRef} className="relative">
          <label className="mb-1.5 block text-sm font-medium text-brand-muted">
            Категория
          </label>
          <button
            type="button"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            className={cn(inputClasses, "flex items-center justify-between gap-2 text-left")}
          >
            <span className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: selectedCategory?.color }}
              />
              <span>{selectedCategory?.name}</span>
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 shrink-0 text-brand-muted transition-transform",
                dropdownOpen && "rotate-180",
              )}
            />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.ul
                role="listbox"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute z-20 mt-1 w-full overflow-hidden rounded-xl border border-brand-border bg-brand-card shadow-yellow-glow"
              >
                {mockCategories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={cat.id === categoryId}
                      onClick={() => {
                        setCategoryId(cat.id);
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-white/5"
                    >
                      <span className="flex items-center gap-2 text-brand-text">
                        <span
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                      </span>
                      {cat.id === categoryId && (
                        <Check className="h-4 w-4 text-brand-yellow" />
                      )}
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Приоритет — сегментированный переключатель */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-muted">
            Приоритет
          </label>
          <div className="grid grid-cols-3 gap-1 rounded-xl border border-brand-border bg-brand-black p-1">
            {priorityOptions.map((opt) => {
              const active = priority === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={cn(
                    "rounded-lg py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-brand-yellow text-brand-black"
                      : "text-brand-muted hover:text-brand-text",
                  )}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Заметка */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-brand-muted">
            Заметка
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Дополнительные детали…"
            className={cn(inputClasses, "resize-none")}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            Отмена
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Сохранить
          </Button>
        </div>
      </div>
    </Modal>
  );
}
