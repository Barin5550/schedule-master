import type { Task } from "@/types";

/** Минут от полуночи из строки "HH:mm". */
export function timeToMinutes(time?: string | null): number {
  if (!time) return 0;
  const [h, m] = time.split(":").map((x) => parseInt(x, 10));
  if (Number.isNaN(h)) return 0;
  return h * 60 + (Number.isNaN(m) ? 0 : m);
}

/** Минуты от полуночи в строку "HH:mm". */
export function minutesToTime(total: number): string {
  const clamped = Math.max(0, Math.min(24 * 60, Math.round(total)));
  const h = Math.floor(clamped / 60) % 24;
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** Длительность задачи в минутах (по умолчанию 60). */
export function taskDuration(task: Task): number {
  const start = timeToMinutes(task.startTime);
  const end = timeToMinutes(task.endTime);
  const d = end - start;
  return d > 0 ? d : 60;
}

/** Локальная ISO-дата YYYY-MM-DD без сдвига по часовому поясу. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Парсинг "YYYY-MM-DD" в локальный Date (полдень для устойчивости). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split("-").map((x) => parseInt(x, 10));
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0, 0);
}

/** Понедельник недели, содержащей дату. */
export function startOfWeek(d: Date): Date {
  const res = new Date(d);
  res.setHours(12, 0, 0, 0);
  const day = res.getDay();
  res.setDate(res.getDate() - ((day + 6) % 7));
  return res;
}

/** Добавить дни к дате (новый объект). */
export function addDays(d: Date, n: number): Date {
  const res = new Date(d);
  res.setDate(res.getDate() + n);
  return res;
}

/** Добавить месяцы к дате (новый объект). */
export function addMonths(d: Date, n: number): Date {
  const res = new Date(d);
  res.setMonth(res.getMonth() + n);
  return res;
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Форматирование заголовка-даты. */
export function formatDayLabel(d: Date): string {
  return d.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatMonthLabel(d: Date): string {
  return d.toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
}

/** Преобразование hex (#RRGGBB) в rgba-строку с заданной прозрачностью. */
export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = parseInt(full.slice(0, 2), 16) || 0;
  const g = parseInt(full.slice(2, 4), 16) || 0;
  const b = parseInt(full.slice(4, 6), 16) || 0;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const HOURS: number[] = Array.from({ length: 25 }, (_, i) => i);

export const recurrenceLabels: Record<string, string> = {
  none: "Не повторять",
  daily: "Ежедневно",
  weekdays: "По будням",
  weekly: "Еженедельно",
  custom: "Произвольно",
};
