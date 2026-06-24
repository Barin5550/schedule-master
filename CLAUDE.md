# ScheduleMaster

Профессиональный веб-сайт для дисциплины и расписания. Чёрно-жёлтая тема.

## Стек

- Framework: Next.js 14 (App Router) — 14.2.35
- Язык: TypeScript
- Стили: Tailwind CSS 3.4 (кастомная тема — чёрный + жёлтый)
- База данных + Auth: Supabase (@supabase/supabase-js, @supabase/ssr)
- Анимации: Framer Motion (v12)
- Иконки: Lucide React
- Формы: React Hook Form + Zod (v4) + @hookform/resolvers
- Drag & Drop: @dnd-kit/core
- Данные: SWR
- Утилиты: clsx + tailwind-merge (`cn` в `src/lib/utils.ts`), date-fns

## Цветовая палитра (СТРОГО)

| Назначение      | HEX       | Tailwind                  |
| --------------- | --------- | ------------------------- |
| Фон основной    | `#0A0A0A` | `brand-black`             |
| Фон карточек    | `#111111` | `brand-card`              |
| Акцент          | `#F5C518` | `brand-yellow`            |
| Акцент hover    | `#FFD700` | `brand-yellow-hover`      |
| Текст основной  | `#FFFFFF` | `brand-text`              |
| Текст вторичный | `#888888` | `brand-muted`             |
| Бордер          | `#222222` | `brand-border`            |

- Shadow: `shadow-yellow-glow` = `0 0 20px rgba(245,197,24,0.3)`
- Шрифт: Inter (next/font/google, переменная `--font-inter`)
- Утилиты CSS: `.bg-grid` (клетка), `.mask-radial`, `.skeleton` (shimmer)

## Структура папок

```
/src
  /app
    /auth/login, /auth/register   — авторизация
    /dashboard                    — главный дашборд
    /schedule                     — расписание
    /tips                         — советы
    /profile                      — профиль
  /components
    /ui        — Button, Card, Input, Badge
    /layout    — Header, Sidebar
    /schedule  — компоненты расписания
    /tips      — компоненты советов
  /lib
    utils.ts       — cn()
    supabase.ts    — клиент БД (Задача 3)
    /api           — CRUD-обёртки (Задача 7)
  /hooks           — useAuth и др.
  /types           — TypeScript типы (index.ts)
  /data            — статические данные (tips.ts)
```

## API компонентов UI

- `Button` — `variant: primary | outline | ghost`, `size: sm | md | lg`, `loading`, `fullWidth`. Default import.
- `Card` — `hover?: boolean` (добавляет hover:border-brand-yellow + glow). Default import.
- `Input` — `label`, `error`, `rightSlot`. Default import.
- `Badge` — `variant: yellow | gray | green | red`. Default import.
- `Header` — sticky-шапка лендинга; экспорт `Logo` (именованный).

## Готовые модули (НЕ ТРОГАТЬ без явного запроса)

- [x] **Задача 1** — Инициализация + дизайн-система: тема, `cn`, UI (Button/Card/Input/Badge), Header, globals.css, типы.
- [x] **Задача 2** — Лендинг `src/app/page.tsx` + `src/components/landing/*` (hero, статистика, фичи, шаги, отзывы, CTA, footer).
- [x] **Задача 3** — Авторизация: `src/lib/supabase.ts`, `src/hooks/useAuth.ts`, `src/middleware.ts`, `src/app/auth/*` (login + 2-шаговый register), `src/components/auth/*`. Демо-режим, если Supabase не настроен.
- [x] **Задача 4** — Дашборд `src/app/dashboard/*` + `src/components/dashboard/*`; Sidebar/AppShell в `src/components/layout/*`.
- [x] **Задача 5** — Расписание `src/app/schedule/*` + `src/components/schedule/*` (День/Неделя/Месяц, dnd-kit, шаблоны, повторы).
- [x] **Задача 6** — Советы `src/app/tips/*` + `src/components/tips/*`; данные в `src/data/tips.ts`.
- [x] **Задача 7** — БД: `supabase/schema.sql` (таблицы + RLS + триггер), `src/lib/api/*` (CRUD), `src/hooks/useTasks.ts` (SWR + mock-fallback).
- [x] **Задача 8** — Профиль `src/app/profile/*` + `src/components/profile/*` (шапка, статистика, настройки-аккордеон, достижения, опасная зона).
- [x] **Задача 9** — Полиш: `src/app/template.tsx` (переходы), `*/loading.tsx` (скелетоны), `not-found.tsx`/`error.tsx`, `opengraph-image.tsx`, SEO-метаданные, мобильный drawer.

### Реестр данных/демо-режим

- Без настоящего Supabase (`.env.local` с placeholder) приложение работает на mock-данных: `isSupabaseConfigured===false`, middleware пропускает все маршруты, страницы видны без логина.
- Чтобы включить бэкенд: выполнить `supabase/schema.sql`, прописать `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY` в `.env.local`.
- Даты форматируются локально (`toLocalISO` в `src/lib/mock.ts`, `toISODate` в `scheduleUtils`) — НЕ через `toISOString()` (сдвиг по TZ).

### Общее хранилище задач (единый источник)

- `useTasks()` (`src/hooks/useTasks.ts`) — ЕДИНЫЙ источник задач для дашборда и расписания. В демо-режиме все экземпляры делят один SWR-ключ `demo-tasks` → правки видны на всех страницах; данные пишутся в `localStorage` (`schedulemaster_tasks`). `mutate(updater)` принимает массив или `(prev)=>next`, сам сохраняет в localStorage.
- НЕ возвращать к локальному `useState` для задач в dashboard/schedule — это рассинхронизирует страницы.
- Привычки сохраняются в `localStorage` (`schedulemaster_habits`) в `HabitsCard` (гидрация после монтирования, чтобы не было SSR-mismatch).
- **«Основа» расписания**: `loadBaseSchedule`/`saveBaseSchedule`/`buildTasksFromBase` (`src/lib/mock.ts`, ключ `schedulemaster_base`). На странице расписания в `CategoryPanel` секция «Моя основа»: «Закрепить текущий день» → сохраняет задачи дня как шаблон; «Применить основу» → заполняет выбранный день этим шаблоном.
- Демо-режим помечен баннером `DemoBanner` (`src/components/ui/DemoBanner.tsx`), вставлен в `AppShell`.

## Правила кода

- Все компоненты — функциональные, TypeScript.
- CSS — только Tailwind, никакого inline style кроме анимаций (Framer Motion).
- Async — только async/await.
- Именование: PascalCase компоненты, camelCase всё остальное.
- Каждый компонент — отдельный файл.
- Объединение классов — через `cn()` из `@/lib/utils`.
