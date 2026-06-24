import { supabase } from "@/lib/supabase";
import type { Task } from "@/types";
import { rowToTask, taskToRow } from "@/lib/api/mappers";

async function requireUserId(): Promise<string> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Не авторизован");
  return user.id;
}

export interface TaskRange {
  /** одна дата YYYY-MM-DD */
  date?: string;
  /** диапазон дат (включительно) */
  from?: string;
  to?: string;
}

export async function getTasks(range: TaskRange = {}): Promise<Task[]> {
  let query = supabase
    .from("tasks")
    .select("*")
    .order("start_time", { ascending: true, nullsFirst: true });

  if (range.date) query = query.eq("date", range.date);
  if (range.from) query = query.gte("date", range.from);
  if (range.to) query = query.lte("date", range.to);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map(rowToTask);
}

export async function createTask(
  task: Omit<Task, "id" | "createdAt">,
): Promise<Task> {
  const userId = await requireUserId();
  const { data, error } = await supabase
    .from("tasks")
    .insert({ ...taskToRow(task), user_id: userId })
    .select("*")
    .single();
  if (error) throw error;
  return rowToTask(data);
}

export async function updateTask(
  id: string,
  patch: Partial<Task>,
): Promise<Task> {
  const { data, error } = await supabase
    .from("tasks")
    .update(taskToRow(patch))
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return rowToTask(data);
}

export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleComplete(
  id: string,
  isCompleted: boolean,
): Promise<Task> {
  return updateTask(id, { isCompleted });
}

export async function deleteAllTasks(): Promise<void> {
  const userId = await requireUserId();
  const { error } = await supabase
    .from("tasks")
    .delete()
    .eq("user_id", userId);
  if (error) throw error;
}
