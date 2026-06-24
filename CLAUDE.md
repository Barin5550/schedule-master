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

## Правила кода

- Все компоненты — функциональные, TypeScript.
- CSS — только Tailwind, никакого inline style кроме анимаций (Framer Motion).
- Async — только async/await.
- Именование: PascalCase компоненты, camelCase всё остальное.
- Каждый компонент — отдельный файл.
- Объединение классов — через `cn()` из `@/lib/utils`.
