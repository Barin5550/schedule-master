import {
  Brain,
  Clock,
  HeartPulse,
  Flame,
  Repeat,
  type LucideIcon,
} from "lucide-react";
import type { TipCategory } from "@/types";

/** Иконка для каждой категории совета. */
export const categoryIcons: Record<TipCategory, LucideIcon> = {
  focus: Brain,
  time: Clock,
  health: HeartPulse,
  motivation: Flame,
  habits: Repeat,
};
