# ScheduleMaster

Профессиональное веб-приложение для дисциплины и управления расписанием.
Чёрно-жёлтая тема, плавные анимации, авторизация и библиотека советов по продуктивности.

## Стек

Next.js 14 (App Router) · TypeScript · Tailwind CSS 3 · Supabase · Framer Motion · Lucide · React Hook Form + Zod · @dnd-kit · SWR

## Возможности

- **Лендинг** — hero, статистика, фичи, шаги, отзывы, CTA.
- **Авторизация** — split-screen вход и 2-шаговая регистрация (валидация RHF + Zod), вход через Google.
- **Дашборд** — приветствие, карточки статистики со счётчиками, таймлайн дня, совет дня, прогресс недели, привычки, модалка добавления задачи.
- **Расписание** — режимы День / Неделя / Месяц, drag & drop (день), категории, шаблоны, повторяющиеся задачи.
- **Советы** — поиск, фильтры, избранный совет, сетка карточек, техники, личная коллекция.
- **Профиль** — редактирование, статистика, настройки (аккордеон), достижения, опасная зона.

## Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # продакшен-сборка
```

Приложение работает «из коробки» без бэкенда: данные хранятся в `localStorage`
браузера. Подключение Supabase (ниже) включает реальную авторизацию и облачную
синхронизацию — **без правок кода**.

## Подключение Supabase

1. Создай проект на [supabase.com](https://supabase.com) → запиши **Project URL** и **anon public key** (Settings → API).
2. Выполни SQL из [`supabase/schema.sql`](supabase/schema.sql) в SQL Editor (таблицы, RLS, триггер профиля).
3. Скопируй `.env.local.example` → `.env.local` и подставь `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Перезапусти dev-сервер. `isSupabaseConfigured` станет `true` и приложение
   переключится на БД: регистрация/вход через Supabase Auth, задачи и
   сохранённые советы пишутся в Postgres (RLS — каждый видит только своё).
5. (Опц.) Для входа через Google — включи Google-провайдер в Supabase Auth и
   добавь redirect URL твоего домена.

## Деплой на Vercel

1. Запушь репозиторий на GitHub:
   ```bash
   git remote add origin <твой-репозиторий>.git
   git push -u origin main
   ```
2. На [vercel.com](https://vercel.com) → **Add New Project** → импортируй репозиторий
   (Vercel сам определит Next.js, команда сборки `next build`).
3. В **Environment Variables** добавь `NEXT_PUBLIC_SUPABASE_URL` и
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` (если используешь Supabase). Без них сайт
   соберётся и будет работать на `localStorage`.
4. **Deploy** → получишь публичный HTTPS-адрес. Для своего домена — Project → Domains.

`.env.local` в гите игнорируется — ключи задаются в настройках Vercel.

## Структура

См. [`CLAUDE.md`](CLAUDE.md) — палитра, структура папок, API компонентов и реестр готовых модулей.
