import type { Category, Habit, Task } from "@/types";

export const mockCategories: Category[] = [
  { id: "work", name: "Работа", color: "#F5C518", icon: "briefcase" },
  { id: "study", name: "Учёба", color: "#3B82F6", icon: "book" },
  { id: "sport", name: "Спорт", color: "#22C55E", icon: "dumbbell" },
  { id: "personal", name: "Личное", color: "#A855F7", icon: "heart" },
  { id: "rest", name: "Отдых", color: "#64748B", icon: "coffee" },
];

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getCategory(id?: string | null): Category | undefined {
  return mockCategories.find((c) => c.id === id);
}

/** Задачи на сегодня (mock). Дата подставляется текущая. */
export function getMockTodayTasks(): Task[] {
  const date = todayISO();
  return [
    {
      id: "t1",
      title: "Глубокая работа: проект ScheduleMaster",
      date,
      startTime: "09:00",
      endTime: "10:30",
      categoryId: "work",
      priority: "high",
      isCompleted: true,
      isRecurring: false,
    },
    {
      id: "t2",
      title: "Английский язык",
      date,
      startTime: "11:00",
      endTime: "12:00",
      categoryId: "study",
      priority: "medium",
      isCompleted: true,
      isRecurring: true,
      recurrencePattern: "weekdays",
    },
    {
      id: "t3",
      title: "Обед и прогулка",
      date,
      startTime: "13:00",
      endTime: "14:00",
      categoryId: "rest",
      priority: "low",
      isCompleted: false,
      isRecurring: false,
    },
    {
      id: "t4",
      title: "Созвон с командой",
      date,
      startTime: "15:00",
      endTime: "15:45",
      categoryId: "work",
      priority: "high",
      isCompleted: false,
      isRecurring: true,
      recurrencePattern: "weekly",
    },
    {
      id: "t5",
      title: "Тренировка",
      date,
      startTime: "18:00",
      endTime: "19:00",
      categoryId: "sport",
      priority: "medium",
      isCompleted: false,
      isRecurring: true,
      recurrencePattern: "daily",
    },
    {
      id: "t6",
      title: "Чтение книги",
      date,
      startTime: "21:00",
      endTime: "21:30",
      categoryId: "personal",
      priority: "low",
      isCompleted: false,
      isRecurring: true,
      recurrencePattern: "daily",
    },
  ];
}

/** Набор задач на неделю/месяц (mock) для страницы расписания. */
export function getMockWeekTasks(): Task[] {
  const base = new Date();
  const day = base.getDay();
  const monday = new Date(base);
  monday.setDate(base.getDate() - ((day + 6) % 7));

  function dateAt(offset: number): string {
    const d = new Date(monday);
    d.setDate(monday.getDate() + offset);
    return d.toISOString().slice(0, 10);
  }

  const seed: Array<Omit<Task, "id" | "date"> & { offset: number }> = [
    { offset: 0, title: "Планирование недели", startTime: "09:00", endTime: "09:30", categoryId: "work", priority: "high", isCompleted: false, isRecurring: false },
    { offset: 0, title: "Английский", startTime: "11:00", endTime: "12:00", categoryId: "study", priority: "medium", isCompleted: false, isRecurring: true, recurrencePattern: "weekdays" },
    { offset: 1, title: "Тренировка", startTime: "07:30", endTime: "08:30", categoryId: "sport", priority: "medium", isCompleted: false, isRecurring: true, recurrencePattern: "daily" },
    { offset: 1, title: "Спринт-ревью", startTime: "14:00", endTime: "15:00", categoryId: "work", priority: "high", isCompleted: false, isRecurring: false },
    { offset: 2, title: "Курс по дизайну", startTime: "19:00", endTime: "20:30", categoryId: "study", priority: "medium", isCompleted: false, isRecurring: false },
    { offset: 3, title: "Глубокая работа", startTime: "09:00", endTime: "11:00", categoryId: "work", priority: "high", isCompleted: false, isRecurring: false },
    { offset: 4, title: "Тренировка", startTime: "18:00", endTime: "19:00", categoryId: "sport", priority: "medium", isCompleted: false, isRecurring: true, recurrencePattern: "daily" },
    { offset: 5, title: "Встреча с друзьями", startTime: "16:00", endTime: "18:00", categoryId: "personal", priority: "low", isCompleted: false, isRecurring: false },
    { offset: 6, title: "Подведение итогов", startTime: "20:00", endTime: "20:30", categoryId: "personal", priority: "medium", isCompleted: false, isRecurring: true, recurrencePattern: "weekly" },
  ];

  return seed.map((s, i) => {
    const { offset, ...rest } = s;
    return { ...rest, id: `w${i}`, date: dateAt(offset) } as Task;
  });
}

export const mockHabits: Habit[] = [
  { id: "h1", name: "Чтение 20 минут", streak: 12, doneToday: true },
  { id: "h2", name: "Медитация", streak: 5, doneToday: false },
  { id: "h3", name: "Без сахара", streak: 3, doneToday: false },
  { id: "h4", name: "10 000 шагов", streak: 21, doneToday: true },
];

/** Процент выполнения по дням недели (Пн–Вс). */
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
