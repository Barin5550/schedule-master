import type { Category, Habit, Task } from "@/types";

export const mockCategories: Category[] = [
  { id: "work", name: "Работа", color: "#F5C518", icon: "briefcase" },
  { id: "study", name: "Учёба", color: "#3B82F6", icon: "book" },
  { id: "sport", name: "Спорт", color: "#22C55E", icon: "dumbbell" },
  { id: "personal", name: "Личное", color: "#A855F7", icon: "heart" },
  { id: "rest", name: "Отдых", color: "#64748B", icon: "coffee" },
];

export function toLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toLocalISO(new Date());
}

export function getCategory(id?: string | null): Category | undefined {
  return mockCategories.find((c) => c.id === id);
}

export const mockHabits: Habit[] = [
  { id: "h1", name: "Чтение 20 минут", streak: 12, doneToday: true },
  { id: "h2", name: "Медитация", streak: 5, doneToday: false },
  { id: "h3", name: "Без сахара", streak: 3, doneToday: false },
  { id: "h4", name: "10 000 шагов", streak: 21, doneToday: true },
];

export const mockWeekProgress = [60, 80, 45, 90, 70, 100, 30];
export const weekDayLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function getGreeting(date = new Date()): string {
  const h = date.getHours();
  if (h < 6) return "Доброй ночи";
  if (h < 12) return "Доброе утро";
  if (h < 18) return "Добрый день";
  return "Добрый вечер";
}

export function formatRuDate(date = new Date()): string {
  return date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

// ===== Демо-хранилище задач (localStorage) =====

const STORAGE_KEY = "schedulemaster_tasks";

export function loadPersistedTasks(): Task[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Task[];
  } catch {
    return [];
  }
}

export function persistTasks(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // ignore
  }
}

// Старые демо-id, которые могли остаться в localStorage у ранних пользователей.
const LEGACY_TASK_IDS = [
  "t1", "t2", "t3", "t4", "t5", "t6",
  "w0", "w1", "w2", "w3", "w4", "w5", "w6", "w7", "w8",
];

/**
 * Одноразовая миграция: если в хранилище остались старые mock-задачи
 * (id вида t1.., w0..), очистить их, чтобы новый пользователь начинал с чистого
 * листа. Возвращает true, если что-то было удалено.
 */
export function resetIfLegacy(): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const tasks = JSON.parse(raw) as { id: string }[];
    const hasLegacy =
      Array.isArray(tasks) &&
      tasks.some((t) => LEGACY_TASK_IDS.includes(t.id));
    if (hasLegacy) {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    }
  } catch {
    // ignore
  }
  return false;
}

// ===== «Основа» расписания: закреплённый день как шаблон =====

const BASE_KEY = "schedulemaster_base";

export type BaseTaskTemplate = Pick<
  Task,
  | "title"
  | "description"
  | "startTime"
  | "endTime"
  | "categoryId"
  | "priority"
  | "isRecurring"
  | "recurrencePattern"
>;

export function loadBaseSchedule(): BaseTaskTemplate[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(BASE_KEY);
    return raw ? (JSON.parse(raw) as BaseTaskTemplate[]) : null;
  } catch {
    return null;
  }
}

export function saveBaseSchedule(tasks: Task[]): void {
  if (typeof window === "undefined") return;
  const templates: BaseTaskTemplate[] = tasks.map((t) => ({
    title: t.title,
    description: t.description ?? null,
    startTime: t.startTime ?? null,
    endTime: t.endTime ?? null,
    categoryId: t.categoryId ?? null,
    priority: t.priority,
    isRecurring: t.isRecurring,
    recurrencePattern: t.recurrencePattern ?? null,
  }));
  try {
    localStorage.setItem(BASE_KEY, JSON.stringify(templates));
  } catch {
    // ignore
  }
}

export function clearBaseSchedule(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(BASE_KEY);
  } catch {
    // ignore
  }
}

export function buildTasksFromBase(base: BaseTaskTemplate[], dateISO: string): Task[] {
  const stamp = Date.now();
  return base.map((t, i) => ({
    id: `base-${dateISO}-${i}-${stamp}`,
    title: t.title,
    description: t.description ?? null,
    date: dateISO,
    startTime: t.startTime ?? null,
    endTime: t.endTime ?? null,
    categoryId: t.categoryId ?? null,
    priority: t.priority,
    isCompleted: false,
    isRecurring: t.isRecurring,
    recurrencePattern: t.recurrencePattern ?? null,
  }));
}
