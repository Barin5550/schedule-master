"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  className?: string;
  barClassName?: string;
}

export default function ProgressBar({
  value,
  className,
  barClassName,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-brand-border",
        className,
      )}
    >
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={cn("h-full rounded-full bg-brand-yellow", barClassName)}
      />
    </div>
  );
}
