# ScheduleMaster — Промпт: Чистый интерфейс и готовая версия
### Пишу себе

---

## Контекст

Проект ScheduleMaster полностью собран (9 задач). Прочитай CLAUDE.md.
Всё что описано ниже — уже частично реализовано в коде. Твоя задача:
проверить каждый пункт, доделать что не готово, ничего лишнего не трогать.

**Стек:** Next.js 14, TypeScript, Tailwind, Supabase (демо-режим через localStorage).

---

## Что уже сделано (не трогать)

- `src/lib/mock.ts` — `loadPersistedTasks`, `persistTasks`, `saveBaseSchedule`,
  `loadBaseSchedule`, `buildTasksFromBase` — всё готово
- `src/hooks/useTasks.ts` — общий SWR-ключ `demo-tasks`, localStorage
- `src/app/dashboard/page.tsx` — использует `useTasks`, есть `deleteTask`
- `src/app/schedule/page.tsx` — использует `useTasks`, есть `deleteTask`
- `src/components/dashboard/TimelineItem.tsx` — кнопка удаления при hover
- `src/components/schedule/TaskBlock.tsx` — кнопка удаления при hover
- `src/components/schedule/CategoryPanel.tsx` — «Основа расписания» (закрепить / применить)
- `src/components/ui/DemoBanner.tsx` + `AppShell.tsx` — баннер демо-режима
- `src/components/dashboard/HabitsCard.tsx` — localStorage

---

## ЗАДАЧА 1 — Пустой старт (чистый интерфейс)

**Проблема:** при первом запуске пользователь видит чужие задачи.
**Решение:** уже исправлено в `loadPersistedTasks` — возвращает `[]` если localStorage пуст.

**Проверь:** открой приложение в режиме инкогнито (чистый localStorage).
Дашборд должен показывать пустой экран с кнопкой «Добавить первую задачу».
Расписание — пустую временную шкалу.

Если видишь старые mock-задачи — значит в localStorage осталось старое значение.
Добавь в `src/lib/mock.ts` функцию сброса и вызови её один раз при старте:

```typescript
// Вызвать ОДИН РАЗ для очистки старых mock-данных у существующих пользователей
export function resetIfLegacy(): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem("schedulemaster_tasks");
  if (!raw) return;
  try {
    const tasks = JSON.parse(raw);
    // Если есть задачи со старыми mock-id (t1, t2...) — сбросить
    const hasLegacy = tasks.some((t: { id: string }) =>
      ["t1","t2","t3","t4","t5","t6","w0","w1","w2","w3","w4","w5","w6","w7","w8"].includes(t.id)
    );
    if (hasLegacy) localStorage.removeItem("schedulemaster_tasks");
  } catch { /* ignore */ }
}
```

Вызови `resetIfLegacy()` в `src/app/layout.tsx` через `useEffect` на клиенте.

---

## ЗАДАЧА 2 — Удаление задач везде

### 2.1 Дашборд (таймлайн)

Файл: `src/components/dashboard/TimelineItem.tsx`

При наведении на задачу справа появляется иконка корзины.
Нажатие вызывает `onDelete(task.id)`.

**Проверь:** задача добавлена → навёл → нажал корзину → задача исчезла → F5 → задача не вернулась.

### 2.2 Расписание (вид «День»)

Файл: `src/components/schedule/TaskBlock.tsx`

При наведении на блок задачи — маленькая иконка корзины в правом верхнем углу.
`onPointerDown` останавливает drag, `onClick` вызывает `onDelete(task.id)`.

**Проверь:** то же самое — удалил, перезагрузил, не вернулась.

---

## ЗАДАЧА 3 — Основа расписания

Файл: `src/app/schedule/page.tsx` + `src/components/schedule/CategoryPanel.tsx`

**Как это работает:**
1. Пользователь составляет расписание на один день (например, понедельник)
2. Открывает боковую панель (кнопка PanelRight вверху справа)
3. Нажимает «Закрепить текущий день» → этот день сохраняется как шаблон
4. Переходит на любой другой день
5. Нажимает «Применить основу» → день заполняется задачами из шаблона

**Проверь:**
- Составил расписание на сегодня (3-5 задач)
- Закрепил как основу (счётчик в панели показывает кол-во задач)
- Перешёл на завтра — день пустой
- Нажал «Применить основу» — задачи появились
- F5 — задачи на завтра остались

---

## ЗАДАЧА 4 — UX: понятный пустой экран

### 4.1 Дашборд — нет задач на сегодня

Файл: `src/components/dashboard/TodayTimeline.tsx`

Уже есть EmptyState компонент. Убедись что он показывается когда `tasks.length === 0`:
- Иконка CalendarClock жёлтая
- Текст «На сегодня задач нет»
- Кнопка «Добавить первую задачу» → открывает модалку

### 4.2 Расписание — пустой день

Файл: `src/components/schedule/DayView.tsx`

Если на выбранный день нет задач — показать по центру:
```tsx
{tasks.length === 0 && (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none">
    <p className="text-brand-muted text-sm">Нет задач — кликни на шкалу чтобы добавить</p>
  </div>
)}
```

### 4.3 Подсказка в модалке добавления задачи

Файл: `src/components/dashboard/AddTaskModal.tsx`

Убедись что поле «Название» в фокусе при открытии модалки (`autoFocus`).

---

## ЗАДАЧА 5 — Синхронизация дашборд ↔ расписание

**Проверь вручную:**
1. Добавь задачу на сегодня в дашборде → перейди в расписание → задача видна в виде «День»
2. Удали задачу в расписании → перейди в дашборд → задачи нет в таймлайне
3. Отметь задачу выполненной в дашборде → перейди в расписание → задача зачёркнута

Если синхронизация не работает — значит один из компонентов не использует `useTasks`.
Проверь что оба `dashboard/page.tsx` и `schedule/page.tsx` импортируют `useTasks` из `@/hooks/useTasks`.

---

## ЗАДАЧА 6 — Финальная проверка

```bash
npx tsc --noEmit
```

Должно быть 0 ошибок.

Затем:
```bash
npm run build
```

Если build проходит без ошибок — сайт готов к деплою.

---

## Что НЕЛЬЗЯ трогать

```
❌ src/components/ui/*
❌ src/components/landing/*
❌ src/components/auth/*
❌ src/app/auth/*
❌ src/data/tips.ts
❌ tailwind.config.ts
❌ globals.css
❌ supabase/schema.sql
```

---

## Ожидаемый результат

После этой сессии сайт работает как готовый продукт:

✅ Первый запуск — чистый экран, пользователь добавляет свои задачи  
✅ Задачи сохраняются после перезагрузки  
✅ Задачи синхронизированы между дашбордом и расписанием  
✅ Любую задачу можно удалить (hover → корзина)  
✅ Можно закрепить день как шаблон и применить его к любому другому дню  
✅ TypeScript и build — без ошибок  

---

## ЗАДАЧА 7 — Подключение реального Supabase (выход из демо-режима)

Сейчас сайт работает в «демо-режиме» — данные в localStorage браузера.
Это значит: данные теряются при очистке браузера, не синхронизируются между устройствами,
нет настоящей авторизации. Чтобы сайт работал как настоящий продукт — нужно подключить Supabase.

### Шаг 7.1 — Создать проект Supabase

1. Зайди на https://supabase.com → New project
2. Запомни: Project URL и anon public key (Settings → API)

### Шаг 7.2 — Выполнить SQL схему

В Supabase → SQL Editor выполни файл `supabase/schema.sql` из проекта.
Он создаёт таблицы tasks, categories, habits, saved_tips, user_profiles
и настраивает Row Level Security (каждый видит только свои данные).

### Шаг 7.3 — Прописать переменные окружения

Создай файл `.env.local` в корне проекта:

```
NEXT_PUBLIC_SUPABASE_URL=https://твой-проект.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=твой-anon-key
```

После этого `isSupabaseConfigured` в `src/lib/supabase.ts` вернёт `true`
и приложение автоматически переключится на реальную БД — без единой правки кода.

### Шаг 7.4 — Проверить что всё работает

- Перезапусти сервер: `npm run dev`
- Демо-баннер должен исчезнуть
- Зарегистрируйся через форму → попадаешь в дашборд
- Добавь задачу → открой в другом браузере → задача там тоже есть
- Удали задачу → она удалена в БД, не только в браузере

### Шаг 7.5 — Сохранение в реальном режиме

В реальном режиме данные сохраняются в Supabase PostgreSQL.
Хук `useTasks` автоматически использует функции из `src/lib/api/tasks.ts`
вместо localStorage. Эти функции уже написаны и готовы — ничего дописывать не нужно.

**Что сохраняется:**
- Задачи → таблица `tasks` (с RLS — только свои)
- Привычки → таблица `habits`
- Профиль → таблица `user_profiles`
- Сохранённые советы → таблица `saved_tips`

**Важно:** `src/lib/api/tasks.ts` уже содержит `getTasks`, `createTask`,
`updateTask`, `deleteTask` — не переписывай их, они уже правильные.

### Если нет Supabase — улучшенный демо-режим

Если Supabase не нужен и хочется остаться на localStorage — убери DemoBanner
и сделай localStorage единственным источником правды без упоминания «демо».

Файл `src/components/ui/DemoBanner.tsx` — просто верни `null` безусловно:
```typescript
export default function DemoBanner() {
  return null; // скрыть баннер в production без Supabase
}
```

Данные в localStorage сохраняются между сессиями — сайт работает нормально
для одного пользователя на одном устройстве.

---

## Итоговый чеклист перед деплоем

```
☐ .env.local заполнен реальными ключами Supabase (или осознанно пропущен)
☐ supabase/schema.sql выполнен в проекте
☐ npm run build — без ошибок
☐ Регистрация работает
☐ Задачи создаются, сохраняются, удаляются
☐ Основа расписания работает
☐ На мобильном: sidebar открывается через гамбургер
☐ DemoBanner скрыт (или Supabase подключён)
```
