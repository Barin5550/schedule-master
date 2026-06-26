import type { Category, Habit, Task, UserProfile } from "@/types";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function rowToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? null,
    date: row.date,
    startTime: row.start_time ?? null,
    endTime: row.end_time ?? null,
    categoryId: row.category_id ?? null,
    priority: row.priority,
    isCompleted: row.is_completed,
    isRecurring: row.is_recurring,
    recurrencePattern: row.recurrence_pattern ?? null,
    createdAt: row.created_at,
  };
}

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** В БД category_id — uuid с внешним ключом. Любой не-uuid (демо-id «work»,
 * пустая строка) превращаем в null, иначе Postgres падает с ошибкой типа. */
function toUuidOrNull(value: unknown): string | null {
  return typeof value === "string" && UUID_RE.test(value) ? value : null;
}

export function taskToRow(task: Partial<Task>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (task.title !== undefined) row.title = task.title;
  if (task.description !== undefined) row.description = task.description;
  if (task.date !== undefined) row.date = task.date;
  if (task.startTime !== undefined) row.start_time = task.startTime;
  if (task.endTime !== undefined) row.end_time = task.endTime;
  if (task.categoryId !== undefined) row.category_id = toUuidOrNull(task.categoryId);
  if (task.priority !== undefined) row.priority = task.priority;
  if (task.isCompleted !== undefined) row.is_completed = task.isCompleted;
  if (task.isRecurring !== undefined) row.is_recurring = task.isRecurring;
  if (task.recurrencePattern !== undefined)
    row.recurrence_pattern = task.recurrencePattern;
  return row;
}

export function rowToCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    color: row.color,
    icon: row.icon ?? null,
  };
}

export function rowToHabit(row: any): Habit {
  return {
    id: row.id,
    name: row.name,
    streak: row.streak ?? 0,
    lastCompleted: row.last_completed ?? null,
  };
}

export function rowToProfile(row: any): UserProfile {
  return {
    id: row.id,
    displayName: row.display_name ?? null,
    goal: row.goal ?? null,
    productiveTime: row.productive_time ?? null,
    dailyHours: row.daily_hours ?? null,
    avatarUrl: row.avatar_url ?? null,
  };
}
