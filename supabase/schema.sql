-- ============================================================
--  ScheduleMaster — схема базы данных (выполнить в Supabase SQL Editor)
-- ============================================================

-- ---------- ENUM приоритета ----------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'task_priority') then
    create type task_priority as enum ('low', 'medium', 'high');
  end if;
end$$;

-- ---------- categories ----------
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  color text not null,
  icon text,
  created_at timestamptz not null default now()
);

-- ---------- tasks ----------
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  description text,
  date date not null,
  start_time time,
  end_time time,
  category_id uuid references public.categories (id) on delete set null,
  priority task_priority not null default 'medium',
  is_completed boolean not null default false,
  is_recurring boolean not null default false,
  recurrence_pattern text,
  created_at timestamptz not null default now()
);

create index if not exists tasks_user_date_idx on public.tasks (user_id, date);

-- ---------- habits ----------
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  streak integer not null default 0,
  last_completed date,
  created_at timestamptz not null default now()
);

-- ---------- saved_tips ----------
create table if not exists public.saved_tips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  tip_id text not null,
  saved_at timestamptz not null default now(),
  unique (user_id, tip_id)
);

-- ---------- user_profiles ----------
create table if not exists public.user_profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  goal text,
  productive_time text,
  daily_hours integer,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- ============================================================
--  Row Level Security — каждый видит только свои строки
-- ============================================================
alter table public.categories     enable row level security;
alter table public.tasks          enable row level security;
alter table public.habits         enable row level security;
alter table public.saved_tips     enable row level security;
alter table public.user_profiles  enable row level security;

-- categories
drop policy if exists "categories_select_own" on public.categories;
create policy "categories_select_own" on public.categories
  for select using (auth.uid() = user_id);
drop policy if exists "categories_modify_own" on public.categories;
create policy "categories_modify_own" on public.categories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- tasks
drop policy if exists "tasks_select_own" on public.tasks;
create policy "tasks_select_own" on public.tasks
  for select using (auth.uid() = user_id);
drop policy if exists "tasks_modify_own" on public.tasks;
create policy "tasks_modify_own" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- habits
drop policy if exists "habits_select_own" on public.habits;
create policy "habits_select_own" on public.habits
  for select using (auth.uid() = user_id);
drop policy if exists "habits_modify_own" on public.habits;
create policy "habits_modify_own" on public.habits
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- saved_tips
drop policy if exists "saved_tips_select_own" on public.saved_tips;
create policy "saved_tips_select_own" on public.saved_tips
  for select using (auth.uid() = user_id);
drop policy if exists "saved_tips_modify_own" on public.saved_tips;
create policy "saved_tips_modify_own" on public.saved_tips
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- user_profiles
drop policy if exists "profiles_select_own" on public.user_profiles;
create policy "profiles_select_own" on public.user_profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_modify_own" on public.user_profiles;
create policy "profiles_modify_own" on public.user_profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);

-- ============================================================
--  Триггер: создаём профиль и стартовые категории при регистрации
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, display_name, goal, productive_time, daily_hours)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'goal',
    new.raw_user_meta_data ->> 'productive_time',
    nullif(new.raw_user_meta_data ->> 'daily_hours', '')::int
  )
  on conflict (id) do nothing;

  insert into public.categories (user_id, name, color, icon) values
    (new.id, 'Работа',  '#F5C518', 'briefcase'),
    (new.id, 'Учёба',   '#3B82F6', 'book'),
    (new.id, 'Спорт',   '#22C55E', 'dumbbell'),
    (new.id, 'Личное',  '#A855F7', 'heart'),
    (new.id, 'Отдых',   '#64748B', 'coffee');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
