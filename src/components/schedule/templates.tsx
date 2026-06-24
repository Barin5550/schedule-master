import type { Task } from "@/types";
import type { TemplateKey } from "./CategoryPanel";

type Preset = Omit<Task, "id" | "date">;

const presets: Record<TemplateKey, Preset[]> = {
  work: [
    {
      title: "Планирование дня",
      startTime: "09:00",
      endTime: "09:30",
      categoryId: "work",
      priority: "medium",
      isCompleted: false,
      isRecurring: false,
    },
    {
      title: "Глубокая работа",
      startTime: "09:30",
      endTime: "12:00",
      categoryId: "work",
      priority: "high",
      isCompleted: false,
      isRecurring: false,
    },
    {
      title: "Обед",
      startTime: "13:00",
      endTime: "14:00",
      categoryId: "rest",
      priority: "low",
      isCompleted: false,
      isRecurring: false,
    },
    {
      title: "Созвон с командой",
      startTime: "15:00",
      endTime: "15:45",
      categoryId: "work",
      priority: "medium",
      isCompleted: false,
      isRecurring: true,
      recurrencePattern: "weekdays",
    },
  ],
  study: [
    {
      title: "Лекция",
      startTime: "10:00",
      endTime: "11:30",
      categoryId: "study",
      priority: "high",
      isCompleted: false,
      isRecurring: false,
    },
    {
      title: "Практика",
      startTime: "12:00",
      endTime: "13:30",
      categoryId: "study",
      priority: "medium",
      isCompleted: false,
      isRecurring: false,
    },
    {
      title: "Английский язык",
      startTime: "16:00",
      endTime: "17:00",
      categoryId: "study",
      priority: "medium",
      isCompleted: false,
      isRecurring: true,
      recurrencePattern: "weekdays",
    },
    {
      title: "Чтение",
      startTime: "20:00",
      endTime: "20:45",
      categoryId: "personal",
      priority: "low",
      isCompleted: false,
      isRecurring: false,
    },
  ],
  weekend: [
    {
      title: "Утренняя пробежка",
      startTime: "08:00",
      endTime: "09:00",
      categoryId: "sport",
      priority: "medium",
      isCompleted: false,
      isRecurring: false,
    },
    {
      title: "Прогулка",
      startTime: "12:00",
      endTime: "13:30",
      categoryId: "rest",
      priority: "low",
      isCompleted: false,
      isRecurring: false,
    },
    {
      title: "Встреча с друзьями",
      startTime: "16:00",
      endTime: "18:00",
      categoryId: "personal",
      priority: "low",
      isCompleted: false,
      isRecurring: false,
    },
  ],
};

/** Сгенерировать задачи шаблона для указанной даты. */
export function buildTemplateTasks(key: TemplateKey, date: string): Task[] {
  return presets[key].map((p, i) => ({
    ...p,
    id: `tpl-${key}-${date}-${i}-${Math.random().toString(36).slice(2, 7)}`,
    date,
  }));
}
