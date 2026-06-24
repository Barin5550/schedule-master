import { supabase } from "@/lib/supabase";
import type { Habit } from "@/types";
import { rowToHabit } from "@/lib/api/mappers";

async function requireUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Не авторизован");
  return user.id;
}

export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map(rowToHabit);
}

export async function createHabit(name: string): Promise<Habit> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("habits")
    .insert({ user_id: userId, name })
    .select("*")
    .single();
  if (error) throw error;
  return rowToHabit(data);
}

export async function updateHabit(
  id: string,
  patch: Partial<Pick<Habit, "name" | "streak" | "lastCompleted">>,
): Promise<Habit> {
  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.streak !== undefined) row.streak = patch.streak;
  if (patch.lastCompleted !== undefined) row.last_completed = patch.lastCompleted;

  const { data, error } = await supabase
    .from("habits")
    .update(row)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return rowToHabit(data);
}

export async function deleteHabit(id: string): Promise<void> {
  const { error } = await supabase.from("habits").delete().eq("id", id);
  if (error) throw error;
}
