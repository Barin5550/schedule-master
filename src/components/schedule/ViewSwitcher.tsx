"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ScheduleView = "day" | "week" | "month";

interface ViewSwitcherProps {
  value: ScheduleView;
  onChange: (view: ScheduleView) => void;
}

const items: { key: ScheduleView; label: string }[] = [
  { key: "day", label: "День" },
  { key: "week", label: "Неделя" },
  { key: "month", label: "Месяц" },
];

export default function ViewSwitcher({ value, onChange }: ViewSwitcherProps) {
  return (
    <div className="inline-flex rounded-xl border border-brand-border bg-brand-card p-1">
      {items.map((item) => {
        const active = value === item.key;
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onChange(item.key)}
            className={cn(
              "relative rounded-lg px-4 py-1.5 text-sm font-medium transition-colors",
              active ? "text-brand-black" : "text-brand-muted hover:text-brand-text",
            )}
          >
            {active && (
              <motion.span
                layoutId="view-switcher-active"
                className="absolute inset-0 rounded-lg bg-brand-yellow"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
}
