"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import Card from "@/components/ui/Card";
import { useCountUp } from "@/hooks/useCountUp";

export interface ProfileStatCardProps {
  /** Иконка статистики (Lucide). */
  icon: ReactNode;
  /** Подпись под значением. */
  label: string;
  /** Числовое значение для анимированного счётчика. Если не задано — выводится textValue. */
  value?: number;
  /** Текстовое значение (для нечисловых статистик, напр. категории). */
  textValue?: string;
  /** Суффикс к числу (напр. "%", " дня"). */
  suffix?: string;
  /** Запуск счётчика (например, при появлении во вьюпорте). */
  start?: boolean;
  /** Задержка появления для каскадной анимации. */
  delay?: number;
}

export default function ProfileStatCard({
  icon,
  label,
  value,
  textValue,
  suffix,
  start = true,
  delay = 0,
}: ProfileStatCardProps) {
  const counted = useCountUp(value ?? 0, start && value !== undefined);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut", delay }}
    >
      <Card hover className="h-full">
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-brand-yellow/15 text-brand-yellow">
          {icon}
        </div>
        <div className="text-3xl font-bold text-brand-text">
          {value !== undefined ? (
            <>
              {Math.round(counted)}
              {suffix && (
                <span className="text-2xl text-brand-muted">{suffix}</span>
              )}
            </>
          ) : (
            textValue
          )}
        </div>
        <div className="mt-1 text-sm text-brand-muted">{label}</div>
      </Card>
    </motion.div>
  );
}
