"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  type TaskRange,
} from "@/lib/api/tasks";
import { loadPersistedTasks, persistTasks } from "@/lib/mock";
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
 * Реальный режим: вычисляем разницу между старым и новым списком задач
 * и применяем её к Supabase (создать / удалить / обновить). Это позволяет
 * страницам работать через один и тот же `mutate((prev) => next)`, не зная
 * про БД. Временные клиентские id заменяются настоящими uuid после ревалидации.
 */
async function persistTaskDiff(base: Task[], next: Task[]): Promise<void> {
  const baseById = new Map(base.map((t) => [t.id, t]));
  const nextById = new Map(next.map((t) => [t.id, t]));

  for (const t of next) {
    if (!baseById.has(t.id)) {
      await createTask(t);
    }
  }
  for (const t of base) {
    if (!nextById.has(t.id)) {
      await deleteTask(t.id);
    }
  }
  for (const t of next) {
    const old = baseById.get(t.id);
    if (old && JSON.stringify(old) !== JSON.stringify(t)) {
      await updateTask(t.id, t);
    }
  }
}

export function useTasks(range: TaskRange = {}) {
  const demo = !isSupabaseConfigured;
  const swrKey = demo ? "demo-tasks" : JSON.stringify({ tasks: range });

  const { data, error, isLoading, mutate: swrMutate } = useSWR<Task[]>(
    swrKey,
    () => (demo ? loadPersistedTasks() : getTasks(range)),
    { revalidateOnFocus: false },
  );

  const allTasks = data ?? [];
  const tasks = demo ? filterByRange(allTasks, range) : (data ?? []);

  const mutate = useCallback(
    async (updater?: TasksUpdater) => {
      // Демо-режим: единый источник в localStorage, без ревалидации.
      if (demo) {
        await swrMutate(
          (current?: Task[]) => {
            const base = current ?? [];
            const next =
              typeof updater === "function"
                ? updater(base)
                : (updater ?? base);
            persistTasks(next);
            return next;
          },
          { revalidate: false },
        );
        return;
      }

      // Реальный режим: оптимистично обновляем кэш, пишем разницу в Supabase,
      // затем ревалидируем (подтянуть настоящие id / откатить при ошибке).
      let base: Task[] = [];
      let next: Task[] = [];
      await swrMutate(
        (current?: Task[]) => {
          base = current ?? [];
          next =
            typeof updater === "function" ? updater(base) : (updater ?? base);
          return next;
        },
        { revalidate: false },
      );
      try {
        await persistTaskDiff(base, next);
      } finally {
        await swrMutate();
      }
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
