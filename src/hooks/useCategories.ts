"use client";

import useSWR from "swr";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getCategories } from "@/lib/api/categories";
import { mockCategories } from "@/lib/mock";
import type { Category } from "@/types";

/**
 * Категории пользователя. Демо — статичный `mockCategories` (id вида «work»).
 * Реальный режим — таблица `categories` из Supabase (настоящие uuid, которые
 * создаёт триггер при регистрации). Важно: в реальном режиме именно эти uuid
 * должны уходить в `category_id`, иначе вставка задачи падает (FK на uuid).
 */
export function useCategories() {
  const demo = !isSupabaseConfigured;
  const { data } = useSWR<Category[]>(
    demo ? "demo-categories" : "categories",
    () => (demo ? mockCategories : getCategories()),
    {
      revalidateOnFocus: false,
      fallbackData: demo ? mockCategories : undefined,
    },
  );
  return { categories: data ?? [] };
}
