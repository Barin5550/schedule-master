"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, PanelRight, Plus } from "lucide-react";
import type { Category, Task } from "@/types";
import {
  buildTasksFromBase,
  loadBaseSchedule,
  mockCategories,
  saveBaseSchedule,
} from "@/lib/mock";
import { useTasks } from "@/hooks/useTasks";
import Button from "@/components/ui/Button";
import ViewSwitcher, {
  type ScheduleView,
} from "@/components/schedule/ViewSwitcher";
import DayView from "@/components/schedule/DayView";
import WeekView from "@/components/schedule/WeekView";
import MonthView from "@/components/schedule/MonthView";
import CategoryPanel, {
  type TemplateKey,
} from "@/components/schedule/CategoryPanel";
import ScheduleTaskModal, {
  type ScheduleTaskDraft,
} from "@/components/schedule/ScheduleTaskModal";
import { buildTemplateTasks } from "@/components/schedule/templates";
import {
  addDays,
  addMonths,
  formatDayLabel,
  formatMonthLabel,
  startOfWeek,
  toISODate,
} from "@/components/schedule/scheduleUtils";

export default function SchedulePage() {
  const [view, setView] = useState<ScheduleView>("day");
  const [cursor, setCursor] = useState<Date>(() => new Date());
  const { tasks, mutate } = useTasks();
  const [categories, setCategories] = useState<Category[]>(() => [
    ...mockCategories,
  ]);
  const [panelOpen, setPanelOpen] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [monthSelected, setMonthSelected] = useState<Date | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalStart, setModalStart] = useState("09:00");

  // Закреплённая «основа» расписания (количество задач; 0 — основы нет).
  const [baseCount, setBaseCount] = useState(0);
  useEffect(() => {
    setBaseCount(loadBaseSchedule()?.length ?? 0);
  }, []);

  // Фильтрация по категории
  const visibleTasks = useMemo(
    () => (filter ? tasks.filter((t) => t.categoryId === filter) : tasks),
    [tasks, filter],
  );

  const dayISO = toISODate(cursor);
  const dayTasks = useMemo(
    () => visibleTasks.filter((t) => t.date === dayISO),
    [visibleTasks, dayISO],
  );

  // ===== Навигация =====
  function shiftPrev() {
    if (view === "day") setCursor((c) => addDays(c, -1));
    else if (view === "week") setCursor((c) => addDays(c, -7));
    else setCursor((c) => addMonths(c, -1));
  }
  function shiftNext() {
    if (view === "day") setCursor((c) => addDays(c, 1));
    else if (view === "week") setCursor((c) => addDays(c, 7));
    else setCursor((c) => addMonths(c, 1));
  }
  function goToday() {
    const now = new Date();
    setCursor(now);
    if (view === "month") setMonthSelected(now);
  }

  // ===== Заголовок периода =====
  const periodLabel = useMemo(() => {
    if (view === "day") return formatDayLabel(cursor);
    if (view === "week") {
      const monday = startOfWeek(cursor);
      const sunday = addDays(monday, 6);
      const fmt = (d: Date) =>
        d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
      return `${fmt(monday)} – ${fmt(sunday)}`;
    }
    return formatMonthLabel(cursor);
  }, [view, cursor]);

  // ===== Операции с задачами (через общее хранилище) =====
  async function updateTask(id: string, patch: Partial<Task>) {
    await mutate((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    );
  }

  async function addTask(draft: ScheduleTaskDraft) {
    const task: Task = {
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      title: draft.title,
      description: draft.description,
      date: draft.date,
      startTime: draft.startTime,
      endTime: draft.endTime,
      categoryId: draft.categoryId,
      priority: draft.priority,
      isCompleted: false,
      isRecurring: draft.isRecurring,
      recurrencePattern: draft.recurrencePattern,
    };
    await mutate((prev) => [...prev, task]);
    setModalOpen(false);
  }

  function openModalAt(start: string) {
    setModalStart(start);
    setModalOpen(true);
  }

  // ===== Категории / шаблоны =====
  function renameCategory(id: string, name: string) {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name } : c)),
    );
  }

  async function applyTemplate(key: TemplateKey) {
    const targetISO =
      view === "month" && monthSelected
        ? toISODate(monthSelected)
        : dayISO;
    const fresh = buildTemplateTasks(key, targetISO);
    await mutate((prev) => [
      ...prev.filter((t) => t.date !== targetISO),
      ...fresh,
    ]);
    setFilter(null);
    setPanelOpen(false);
  }

  // ===== Основа расписания =====
  const baseTargetISO =
    view === "month" && monthSelected ? toISODate(monthSelected) : dayISO;

  function pinAsBase() {
    const dayList = tasks.filter((t) => t.date === baseTargetISO);
    saveBaseSchedule(dayList);
    setBaseCount(dayList.length);
  }

  async function applyBase() {
    const base = loadBaseSchedule();
    if (!base || base.length === 0) return;
    const fresh = buildTasksFromBase(base, baseTargetISO);
    await mutate((prev) => [
      ...prev.filter((t) => t.date !== baseTargetISO),
      ...fresh,
    ]);
    setFilter(null);
    setPanelOpen(false);
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="min-w-0 flex-1 animate-fade-in-up">
        {/* Верхняя панель */}
        <div className="mb-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-brand-text">Расписание</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPanelOpen((v) => !v)}
                aria-label="Категории и шаблоны"
                className="!px-2.5"
              >
                <PanelRight className="h-5 w-5" />
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => openModalAt("09:00")}
              >
                <Plus className="h-4 w-4" />
                Добавить
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <ViewSwitcher value={view} onChange={setView} />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={shiftPrev}
                aria-label="Назад"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:text-brand-text"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="min-w-[140px] text-center text-sm font-medium capitalize text-brand-text">
                {periodLabel}
              </span>
              <button
                type="button"
                onClick={shiftNext}
                aria-label="Вперёд"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-brand-border text-brand-muted transition-colors hover:text-brand-text"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <Button variant="outline" size="sm" onClick={goToday}>
                Сегодня
              </Button>
            </div>
          </div>
        </div>

        {/* Представления */}
        {view === "day" && (
          <DayView
            date={cursor}
            tasks={dayTasks}
            onTaskClick={() => openModalAt("09:00")}
            onTaskUpdate={updateTask}
            onEmptyClick={openModalAt}
          />
        )}
        {view === "week" && (
          <WeekView
            date={cursor}
            tasks={visibleTasks}
            onTaskClick={() => openModalAt("09:00")}
          />
        )}
        {view === "month" && (
          <MonthView
            date={cursor}
            tasks={visibleTasks}
            selectedDay={monthSelected}
            onSelectDay={setMonthSelected}
            onTaskClick={() => openModalAt("09:00")}
          />
        )}
      </div>

      {/* Правая панель категорий */}
      <CategoryPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        categories={categories}
        onRenameCategory={renameCategory}
        activeFilter={filter}
        onFilter={setFilter}
        onApplyTemplate={applyTemplate}
        hasBase={baseCount > 0}
        baseCount={baseCount}
        onPinBase={pinAsBase}
        onApplyBase={applyBase}
      />

      {/* Модалка задачи */}
      <ScheduleTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addTask}
        defaultDate={
          view === "month" && monthSelected
            ? toISODate(monthSelected)
            : dayISO
        }
        defaultStart={modalStart}
      />
    </div>
  );
}
