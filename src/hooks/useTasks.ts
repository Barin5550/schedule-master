"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getTasks, type TaskRange } from "@/lib/api/tasks";
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
      await swrMutate(
        (current?: Task[]) => {
          const base = current ?? [];
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
