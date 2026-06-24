"use client";

import { createBrowserClient } from "@supabase/ssr";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * `true`, когда подставлены реальные креды Supabase (не заглушки).
 * Используется, чтобы приложение оставалось работоспособным в демо-режиме
 * без настроенного бэкенда.
 */
export const isSupabaseConfigured =
  !!SUPABASE_URL &&
  !!SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes("placeholder") &&
  !SUPABASE_ANON_KEY.includes("placeholder");

/** Браузерный клиент Supabase (singleton). */
export const supabase = createBrowserClient(
  SUPABASE_URL || "https://placeholder.supabase.co",
  SUPABASE_ANON_KEY || "placeholder-anon-key",
);
