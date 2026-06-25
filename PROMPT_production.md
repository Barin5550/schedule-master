# ScheduleMaster — Промпт: Production-уровень
### Пишу себе

---

## Контекст

Прочитай CLAUDE.md. Сайт визуально готов и выглядит профессионально.
На скриншоте видно: чистый дашборд, имя пользователя подтягивается правильно,
задач нет — пользователь добавляет сам. Это правильное состояние.

Сейчас: демо-режим через localStorage (один браузер, один пользователь).
Цель этой сессии: сделать настоящий продакшн-сайт с реальными данными на каждого пользователя,
онбордингом, email-подтверждением, аналитикой и без багов.

**Стек:** Next.js 14, TypeScript, Tailwind, Supabase, Framer Motion, Vercel (деплой).

---

## Что уже готово (не трогать)

- Весь UI — дашборд, расписание, советы, профиль, авторизация
- `useTasks` — общий SWR-хук, localStorage в демо-режиме
- `src/lib/api/tasks.ts` — CRUD для Supabase (написан, ждёт подключения)
- `supabase/schema.sql` — схема БД с RLS (каждый видит только своё)
- Удаление задач (hover → корзина), основа расписания

---

## ЗАДАЧА 1 — Реальные данные для каждого пользователя (Supabase)

Это главная задача. Без неё всё остальное не имеет смысла.

### 1.1 Создать проект Supabase

1. https://supabase.com → New project → запомни регион (лучше EU)
2. Settings → API → скопируй `Project URL` и `anon public key`

### 1.2 Выполнить схему БД

В Supabase → SQL Editor → выполни `supabase/schema.sql`.
Создаст таблицы: `tasks`, `categories`, `habits`, `saved_tips`, `user_profiles`.
Row Level Security уже настроен — каждый пользователь видит только свои данные.

### 1.3 Прописать переменные окружения

Создай `.env.local` в корне:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

После этого `isSupabaseConfigured` вернёт `true` и приложение само переключится
на реальную БД. Никаких правок кода не нужно.

### 1.4 Проверить изоляцию данных

- Зарегистрируй пользователя А → добавь 3 задачи
- Зарегистрируй пользователя Б (другой браузер/инкогнито) → задачи А не видны
- Это должно работать автоматически благодаря RLS в Supabase

### 1.5 Убрать DemoBanner в продакшне

Файл `src/components/ui/DemoBanner.tsx`:
После подключения Supabase баннер исчезнет автоматически (проверяет `isSupabaseConfigured`).
Если хочешь скрыть баннер совсем — верни `null` безусловно.

---

## ЗАДАЧА 2 — Email-подтверждение + SMTP

### 2.1 Включить подтверждение в Supabase

Supabase Dashboard → Authentication → Providers → Email:
- ✅ Enable email confirmations
- ✅ Secure email change

### 2.2 Настроить SMTP (для prod-уровня)

По умолчанию Supabase шлёт письма через свой сервер (лимит 3/час).
Для продакшна подключи Resend (бесплатно до 3000 писем/мес):

1. https://resend.com → создай аккаунт → API Keys → создай ключ
2. Supabase → Project Settings → Auth → SMTP Settings:
   - Host: `smtp.resend.com`
   - Port: `465`
   - User: `resend`
   - Password: `твой API ключ Resend`
   - Sender email: `noreply@твой-домен.com`

### 2.3 Обработать состояние "email не подтверждён"

Файл `src/hooks/useAuth.ts` — проверь что после регистрации
пользователь видит экран "Проверьте почту" а не попадает сразу в дашборд.

Файл `src/app/auth/register/page.tsx` — после успешной регистрации
покажи сообщение вместо редиректа:
```tsx
if (needsEmailConfirmation) {
  return (
    <div className="text-center p-8">
      <div className="text-4xl mb-4">📧</div>
      <h2 className="text-xl font-bold text-brand-text mb-2">
        Проверьте почту
      </h2>
      <p className="text-brand-muted">
        Мы отправили письмо на {email}. 
        Перейдите по ссылке для активации аккаунта.
      </p>
    </div>
  );
}
```

Файл `src/app/auth/confirm/route.ts` — создай обработчик подтверждения:
```typescript
import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (token_hash && type) {
    const supabase = createClient(/* cookies */);
    const { error } = await supabase.auth.verifyOtp({ token_hash, type: type as any });
    if (!error) return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.redirect(new URL("/auth/login?error=invalid_token", request.url));
}
```

---

## ЗАДАЧА 3 — Инструкция / онбординг для пользователя

Новый пользователь приходит и не знает что делать. Нужен онбординг.

### 3.1 Онбординг-тур (первый вход)

Создай `src/components/ui/OnboardingTour.tsx`.

Показывается один раз — при первом входе после регистрации.
Храни флаг в `localStorage`: `schedulemaster_onboarded = true`.

Шаги тура (модальные подсказки с стрелкой и подсветкой элемента):
1. "Это твой дашборд — здесь видишь расписание на сегодня"
2. "Нажми Добавить задачу чтобы начать" (стрелка на кнопку)
3. "В расписании можно перетаскивать задачи по времени"
4. "Закрепи день как основу — применяй на любой день одним кликом"
5. "Готово! Начни с первой задачи."

Дизайн тура:
- Полупрозрачный overlay `bg-black/50`
- Белая карточка с подсказкой `bg-brand-card border-brand-yellow`
- Кнопки: "Пропустить" (ghost) + "Далее" (primary)
- Прогресс: точки снизу (1/5, 2/5...)

### 3.2 Подсказки в пустых состояниях

Уже есть EmptyState на дашборде. Добавь контекстные подсказки:

Дашборд (нет задач) — уже готово ✅

Расписание (пустой день) — добавь в `src/components/schedule/DayView.tsx`:
```tsx
{tasks.length === 0 && (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 pointer-events-none select-none">
    <p className="text-brand-muted text-sm">Нет задач</p>
    <p className="text-brand-muted/60 text-xs">Кликни на шкалу или нажми + чтобы добавить</p>
  </div>
)}
```

Советы (нет сохранённых) — в `src/app/tips/page.tsx` секция "Твоя коллекция":
```tsx
{savedTips.length === 0 && (
  <p className="text-brand-muted text-sm">
    Нажми 🔖 на любом совете чтобы сохранить его сюда
  </p>
)}
```

---

## ЗАДАЧА 4 — Аналитика посещений (Vercel Analytics)

### 4.1 Установить пакет

```bash
npm install @vercel/analytics
```

### 4.2 Подключить в layout

Файл `src/app/layout.tsx` — добавь в конец `<body>`:
```tsx
import { Analytics } from "@vercel/analytics/react";

// Внутри <body>:
<Analytics />
```

### 4.3 Настроить в Vercel

После деплоя: Vercel Dashboard → твой проект → Analytics → Enable.
Там будет: просмотры страниц, уникальные посетители, страны, устройства.
Бесплатно до 2500 событий/мес.

### 4.4 Опционально — Speed Insights

```bash
npm install @vercel/speed-insights
```

```tsx
import { SpeedInsights } from "@vercel/speed-insights/next";
// В layout.tsx рядом с Analytics:
<SpeedInsights />
```

Показывает Core Web Vitals (LCP, FID, CLS) — важно для SEO.

---

## ЗАДАЧА 5 — Поиск и исправление багов

Прочитай каждый файл ниже и проверь эти конкретные вещи:

### 5.1 Баг: streak "21 дней подряд" — захардкожен

Файл `src/app/dashboard/page.tsx`, строка: `const STREAK = 21;`

Это фиктивное число. Нужно считать реально:
```typescript
// Из задач — считаем дни подряд где isCompleted > 0
function calcStreak(tasks: Task[]): number {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = toLocalISO(d);
    const dayTasks = tasks.filter(t => t.date === iso);
    const hasCompleted = dayTasks.some(t => t.isCompleted);
    if (dayTasks.length > 0 && hasCompleted) streak++;
    else if (i > 0) break; // прерываем серию
  }
  return streak;
}
```

Замени `const STREAK = 21` на `const STREAK = useMemo(() => calcStreak(allTasks), [allTasks])`.
Используй `allTasks` из `useTasks` (не только сегодняшние).

### 5.2 Баг: "Продуктивность недели" 68% — захардкожена

Файл `src/app/dashboard/page.tsx`:
`const weekAvg = Math.round(mockWeekProgress.reduce(...))` — берёт `mockWeekProgress = [60, 80, 45, 90, 70, 100, 30]`.

Нужно считать из реальных задач:
```typescript
const weekAvg = useMemo(() => {
  const days = 7;
  const today = new Date();
  const percents: number[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const iso = toLocalISO(d);
    const dayTasks = allTasks.filter(t => t.date === iso);
    if (dayTasks.length === 0) continue;
    const pct = Math.round(dayTasks.filter(t => t.isCompleted).length / dayTasks.length * 100);
    percents.push(pct);
  }
  return percents.length > 0 ? Math.round(percents.reduce((a,b) => a+b,0) / percents.length) : 0;
}, [allTasks]);
```

### 5.3 Баг: WeekProgressCard — статичные данные

Файл `src/components/dashboard/WeekProgressCard.tsx` — скорее всего использует `mockWeekProgress`.
Передай реальные данные как пропс из `dashboard/page.tsx` — массив из 7 чисел (% выполнения по дням).

### 5.4 Проверить: авторизация + middleware

Файл `src/middleware.ts` — убедись что:
- `/dashboard`, `/schedule`, `/tips`, `/profile` — только для авторизованных
- Неавторизованный → редирект на `/auth/login`
- Авторизованный на `/auth/*` → редирект на `/dashboard`

### 5.5 Проверить: мобильная адаптация

Открой на телефоне (или DevTools → мобильный):
- Sidebar → drawer (гамбургер-меню) — должен работать
- Карточки статистики → 2 колонки (не 4)
- Timeline → скролл без горизонтального overflow
- Модалка добавления задачи → не обрезается клавиатурой

### 5.6 Проверить: форма добавления задачи

Файл `src/components/dashboard/AddTaskModal.tsx`:
- При открытии поле "Название" должно быть в фокусе (`autoFocus`)
- Нельзя сохранить задачу с пустым названием (валидация)
- Время окончания не может быть раньше времени начала (проверка)
- После добавления форма сбрасывается

---

## ЗАДАЧА 6 — Деплой на Vercel

```bash
# 1. Инициализировать git если ещё нет
git init
git add .
git commit -m "feat: production ready"

# 2. Залить на GitHub
# Создай репо на github.com, затем:
git remote add origin https://github.com/твой-юзер/schedule-master.git
git push -u origin main
```

На Vercel:
1. vercel.com → New Project → Import из GitHub
2. Framework: Next.js (определится автоматически)
3. Environment Variables → добавь:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

После деплоя добавь домен в Supabase:
Authentication → URL Configuration → Site URL = `https://твой-домен.vercel.app`
Redirect URLs добавь: `https://твой-домен.vercel.app/auth/confirm`

---

## Порядок выполнения

1. Задача 1 (Supabase) — без этого ничто не имеет смысла
2. Задача 5.1 и 5.2 (исправить streak и продуктивность) — пока в Supabase нет данных
3. Задача 2 (email-подтверждение)
4. Задача 3 (онбординг)
5. Задача 4 (аналитика)
6. Задача 5 (остальные баги)
7. Задача 6 (деплой)

---

## Что НЕЛЬЗЯ трогать

```
❌ src/components/ui/* (Button, Card, Input, Badge...)
❌ src/components/landing/*
❌ tailwind.config.ts
❌ globals.css
❌ src/data/tips.ts
❌ Любые JSX/стили — только логика
```

---

## Ожидаемый результат

✅ Каждый пользователь видит только свои задачи  
✅ Регистрация отправляет письмо подтверждения  
✅ Данные сохраняются в PostgreSQL, не в браузере  
✅ Streak и продуктивность считаются из реальных данных  
✅ Новый пользователь проходит онбординг-тур  
✅ Аналитика посещений на Vercel  
✅ Сайт задеплоен и доступен по ссылке  
✅ Мобильная версия работает корректно  
