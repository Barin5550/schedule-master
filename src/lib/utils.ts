import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge conditional class names and resolve Tailwind conflicts.
 * Используется во всех UI-компонентах для объединения вариантов и className.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
