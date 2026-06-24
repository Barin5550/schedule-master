import { supabase } from "@/lib/supabase";
import type { Category } from "@/types";
import { rowToCategory } from "@/lib/api/mappers";

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToCategory);
}

export async function updateCategory(
  id: string,
  patch: Partial<Pick<Category, "name" | "color" | "icon">>,
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return rowToCategory(data);
}
