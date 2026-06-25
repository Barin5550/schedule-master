"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSavedTips, saveTip, unsaveTip } from "@/lib/api/tips";

const STORAGE_KEY = "sm:saved-tips";

function loadLocal(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(ids: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

/**
 * Сохранённые советы. Демо-режим — localStorage; реальный — таблица
 * saved_tips в Supabase (оптимистично + ревалидация). API одинаков для UI.
 */
export function useSavedTips() {
  const demo = !isSupabaseConfigured;
  const { data, mutate: swrMutate } = useSWR<string[]>(
    demo ? "demo-saved-tips" : "saved-tips",
    () => (demo ? loadLocal() : getSavedTips()),
    { revalidateOnFocus: false },
  );

  const savedIds = data ?? [];

  const toggle = useCallback(
    async (id: string) => {
      const currentlySaved = savedIds.includes(id);
      const next = currentlySaved
        ? savedIds.filter((x) => x !== id)
        : [...savedIds, id];

      if (demo) {
        saveLocal(next);
        await swrMutate(next, { revalidate: false });
        return;
      }

      await swrMutate(next, { revalidate: false }); // оптимистично
      try {
        if (currentlySaved) await unsaveTip(id);
        else await saveTip(id);
      } finally {
        await swrMutate();
      }
    },
    [savedIds, demo, swrMutate],
  );

  const isSaved = useCallback((id: string) => savedIds.includes(id), [savedIds]);

  return { savedIds, toggle, isSaved };
}
