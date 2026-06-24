"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AchievementBadgeProps {
  icon: ReactNode;
  title: string;
  description: string;
  unlocked: boolean;
  delay?: number;
}

export default function AchievementBadge({
  icon,
  title,
  description,
  unlocked,
  delay = 0,
}: AchievementBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, ease: "easeOut", delay }}
      className={cn(
        "relative flex flex-col items-center gap-2 rounded-xl border p-5 text-center transition-all duration-200",
        unlocked
          ? "border-brand-yellow/40 bg-brand-yellow/5 hover:shadow-yellow-glow"
          : "border-brand-border bg-brand-card",
      )}
    >
      {!unlocked && (
        <div className="absolute right-2 top-2 text-brand-muted">
          <Lock className="h-4 w-4" />
        </div>
      )}
      <div
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full",
          unlocked
            ? "bg-brand-yellow text-brand-black"
            : "bg-white/5 text-brand-muted",
        )}
      >
        {icon}
      </div>
      <div
        className={cn(
          "text-sm font-semibold",
          unlocked ? "text-brand-text" : "text-brand-muted",
        )}
      >
        {title}
      </div>
      <p className="text-xs leading-snug text-brand-muted">{description}</p>
    </motion.div>
  );
}
