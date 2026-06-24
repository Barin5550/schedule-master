"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getTasks, type TaskRange } from "@/lib/api/tasks";
import {
  getInitialTasks,
  loadPersistedTasks,
  persistTasks,
} from "@/lib/mock";
import type { Task } from "@/types";

export type TasksUpdater = Task[] | ((prev: Task[]) => Task[]);

function filterByRange(all: Task[], range: TaskRange): Task[] {
  if (range.date) return all.filter((t) => t.date === range.date);
  if (range.from || range.to) {
    return all.filter(
      (t) =>
        (!range.from || t.date >= range.from) &&
        (!range.to || t.date <= range.to),
    );
  }
  return all;
}

/**
 * Единый источник задач для дашборда и расписания.
 *
 * Демо-режим (Supabase не настроен): все вызовы хука делят один SWR-ключ
 * `demo-tasks`, поэтому правки видны на всех страницах; данные сохраняются
 * в localStorage. Реальный режим: задачи тянутся из Supabase по диапазону.
 *
 * `mutate` принимает новый массив или функцию-апдейтер `(prev) => next`.
 */
export function useTasks(range: TaskRange = {}) {
  const demo = !isSupabaseConfigured;
  // В демо-режиме ключ общий — общее хранилище между страницами.
  const key = demo ? "demo-tasks" : ["tasks", JSON.stringify(range)];

  const {
    data,
    error,
    isLoading,
    mutate: swrMutate,
  } = useSWR<Task[]>(
    key,
    () => (demo ? loadPersistedTasks() : getTasks(range)),
    { revalidateOnFocus: false },
  );

  // До завершения первого фетча отдаём детерминированный seed (без чтения
  // localStorage при рендере) — чтобы не было рассинхрона гидрации.
  const allTasks = data ?? (demo ? getInitialTasks() : []);
  const tasks = demo ? filterByRange(allTasks, range) : (data ?? []);

  const mutate = useCallback(
    async (updater?: TasksUpdater) => {
      await swrMutate(
        (current?: Task[]) => {
          const base = current ?? (demo ? loadPersistedTasks() : []);
          const next =
            typeof updater === "function" ? updater(base) : (updater ?? base);
          if (demo) persistTasks(next);
          return next;
        },
        { revalidate: false },
      );
    },
    [swrMutate, demo],
  );

  return {
    tasks,
    allTasks,
    isLoading: demo ? false : isLoading,
    error: demo ? null : ((error as Error) ?? null),
    mutate,
    isDemo: demo,
  };
}
