// ===== Domain types for ScheduleMaster =====

export type Priority = "low" | "medium" | "high";

export type RecurrencePattern =
  | "daily"
  | "weekdays"
  | "weekly"
  | "custom"
  | null;

export interface Category {
  id: string;
  name: string;
  color: string; // hex
  icon?: string | null;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  date: string; // YYYY-MM-DD
  startTime?: string | null; // HH:mm
  endTime?: string | null; // HH:mm
  categoryId?: string | null;
  priority: Priority;
  isCompleted: boolean;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  createdAt?: string;
}

export interface Habit {
  id: string;
  name: string;
  streak: number;
  lastCompleted?: string | null;
  doneToday?: boolean;
}

export type TipCategory =
  | "focus"
  | "time"
  | "health"
  | "motivation"
  | "habits";

export interface Tip {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: TipCategory;
  author: string;
  readingTime: number; // minutes
}

export interface UserProfile {
  id: string;
  displayName?: string | null;
  goal?: string | null;
  productiveTime?: string | null;
  dailyHours?: number | null;
  avatarUrl?: string | null;
}
