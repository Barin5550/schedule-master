"use client";

import useSWR from "swr";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getTasks, type TaskRange } from "@/lib/api/tasks";
import { getMockTodayTasks, getMockWeekTasks, todayISO } from "@/lib/mock";
import type { Task } from "@/types";

function mockFallback(range: TaskRange): Task[] {
  if (range.date) {
    if (range.date === todayISO()) return getMockTodayTasks();
    return getMockWeekTasks().filter((t) => t.date === range.date);
  }
  if (range.from || range.to) {
    return getMockWeekTasks().filter(
      (t) =>
        (!range.from || t.date >= range.from) &&
        (!range.to || t.date <= range.to),
    );
  }
  return getMockTodayTasks();
}

/**
 * Загрузка задач. Если Supabase не настроен — возвращает mock-данные
 * (демо-режим), иначе тянет реальные задачи через SWR с loading/error.
 */
export function useTasks(range: TaskRange = {}) {
  const key = isSupabaseConfigured ? ["tasks", JSON.stringify(range)] : null;
  const { data, error, isLoading, mutate } = useSWR<Task[]>(
    key,
    () => getTasks(range),
    { revalidateOnFocus: false },
  );

  if (!isSupabaseConfigured) {
    return {
      tasks: mockFallback(range),
      isLoading: false,
      error: null as Error | null,
      mutate: async () => {},
      isDemo: true,
    };
  }

  return {
    tasks: data ?? [],
    isLoading,
    error: (error as Error) ?? null,
    mutate,
    isDemo: false,
  };
}
