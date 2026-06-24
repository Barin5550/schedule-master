"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  /** Главное значение карточки (уже отформатированное). */
  value: React.ReactNode;
  icon?: React.ReactNode;
  /** Подпись/доп. контент под значением (ProgressBar, "из N", и т.п.). */
  footer?: React.ReactNode;
  index?: number;
  className?: string;
}

/** Статистическая карточка с появлением по стаггеру. */
export default function StatCard({
  label,
  value,
  icon,
  footer,
  index = 0,
  className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: index * 0.1 }}
    >
      <Card hover className={cn("flex h-full flex-col gap-3", className)}>
        <div className="flex items-start justify-between">
          <p className="text-sm font-medium text-brand-muted">{label}</p>
          {icon && <span className="shrink-0 text-brand-yellow">{icon}</span>}
        </div>
        <div className="text-3xl font-bold tabular-nums text-brand-text">
          {value}
        </div>
        {footer && <div className="mt-auto">{footer}</div>}
      </Card>
    </motion.div>
  );
}
