import { supabase } from "@/lib/supabase";
import type { UserProfile } from "@/types";
import { rowToProfile } from "@/lib/api/mappers";

export async function getProfile(): Promise<UserProfile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data ? rowToProfile(data) : null;
}

export async function updateProfile(
  patch: Partial<UserProfile>,
): Promise<UserProfile> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Не авторизован");

  const row: Record<string, unknown> = { id: user.id };
  if (patch.displayName !== undefined) row.display_name = patch.displayName;
  if (patch.goal !== undefined) row.goal = patch.goal;
  if (patch.productiveTime !== undefined)
    row.productive_time = patch.productiveTime;
  if (patch.dailyHours !== undefined) row.daily_hours = patch.dailyHours;
  if (patch.avatarUrl !== undefined) row.avatar_url = patch.avatarUrl;

  const { data, error } = await supabase
    .from("user_profiles")
    .upsert(row, { onConflict: "id" })
    .select("*")
    .single();
  if (error) throw error;
  return rowToProfile(data);
}
