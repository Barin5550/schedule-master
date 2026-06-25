"use client";

import { useCallback } from "react";
import useSWR from "swr";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getProfile, updateProfile } from "@/lib/api/profile";
import type { UserProfile } from "@/types";

const KEY = "schedulemaster_profile";

function loadLocal(): Partial<UserProfile> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<UserProfile>) : {};
  } catch {
    return {};
  }
}

function saveLocal(profile: Partial<UserProfile>): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
}

/**
 * Профиль пользователя. Демо — localStorage; реальный режим — таблица
 * user_profiles (Supabase). `save(patch)` сохраняет изменения и в том, и в
 * другом режиме одинаковым API.
 */
export function useProfile() {
  const demo = !isSupabaseConfigured;
  const { data, mutate } = useSWR<Partial<UserProfile>>(
    demo ? "demo-profile" : "profile",
    async () => (demo ? loadLocal() : ((await getProfile()) ?? {})),
    { revalidateOnFocus: false },
  );

  const profile = data ?? {};

  const save = useCallback(
    async (patch: Partial<UserProfile>) => {
      const next = { ...profile, ...patch };
      if (demo) {
        saveLocal(next);
        await mutate(next, { revalidate: false });
        return;
      }
      await mutate(next, { revalidate: false });
      try {
        await updateProfile(patch);
      } finally {
        await mutate();
      }
    },
    [profile, demo, mutate],
  );

  return { profile, save };
}
