"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getHabits, createHabit, updateHabit } from "@/lib/api/habits";
import { mockHabits, todayISO } from "@/lib/mock";
import type { Habit } from "@/types";

const HABITS_KEY = "schedulemaster_habits";

function defaults(): Habit[] {
  return mockHabits.map((h) => ({ ...h }));
}

function loadLocal(): Habit[] {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = localStorage.getItem(HABITS_KEY);
    return raw ? (JSON.parse(raw) as Habit[]) : defaults();
  } catch {
    return defaults();
  }
}

function saveLocal(habits: Habit[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  } catch {
    // ignore
  }
}

async function loadReal(): Promise<Habit[]> {
  let rows = await getHabits();
  if (rows.length === 0) {
    // Засеваем дефолтные привычки новому пользователю.
    for (const h of mockHabits) {
      await createHabit(h.name);
    }
    rows = await getHabits();
  }
  const today = todayISO();
  return rows.map((h) => ({ ...h, doneToday: h.lastCompleted === today }));
}

/**
 * Привычки. Демо — localStorage (`schedulemaster_habits`, флаг `doneToday`).
 * Реальный режим — таблица `habits`: `doneToday` выводится из `last_completed`
 * (= сегодня), переключение пишет дату в БД. UI одинаковый.
 */
export function useHabits() {
  const demo = !isSupabaseConfigured;
  const { data, mutate: swrMutate } = useSWR<Habit[]>(
    demo ? "demo-habits" : "habits",
    () => (demo ? loadLocal() : loadReal()),
    { revalidateOnFocus: false, fallbackData: demo ? defaults() : undefined },
  );

  const habits = data ?? [];

  const toggle = useCallback(
    async (id: string) => {
      const target = habits.find((h) => h.id === id);
      if (!target) return;
      const nextDone = !target.doneToday;
      const next = habits.map((h) =>
        h.id === id ? { ...h, doneToday: nextDone } : h,
      );

      if (demo) {
        saveLocal(next);
        await swrMutate(next, { revalidate: false });
        return;
      }

      await swrMutate(next, { revalidate: false }); // оптимистично
      try {
        await updateHabit(id, { lastCompleted: nextDone ? todayISO() : null });
      } finally {
        await swrMutate();
      }
    },
    [habits, demo, swrMutate],
  );

  return { habits, toggle };
}
