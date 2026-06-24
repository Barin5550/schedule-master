import { supabase } from "@/lib/supabase";

async function requireUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Не авторизован");
  return user.id;
}

/** Возвращает массив tip_id, сохранённых пользователем. */
export async function getSavedTips(): Promise<string[]> {
  const { data, error } = await supabase
    .from("saved_tips")
    .select("tip_id")
    .order("saved_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((r) => r.tip_id as string);
}

export async function saveTip(tipId: string): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase
    .from("saved_tips")
    .upsert(
      { user_id: userId, tip_id: tipId },
      { onConflict: "user_id,tip_id" },
    );
  if (error) throw error;
}

export async function unsaveTip(tipId: string): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase
    .from("saved_tips")
    .delete()
    .eq("user_id", userId)
    .eq("tip_id", tipId);
  if (error) throw error;
}
