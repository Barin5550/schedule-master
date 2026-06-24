"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { useCountUp } from "@/hooks/useCountUp";

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  formatThousands?: boolean;
}

export default function StatItem({
  value,
  suffix,
  label,
  formatThousands = false,
}: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const current = useCountUp(value, inView);
  const rounded = Math.round(current);
  const display = formatThousands
    ? rounded.toLocaleString("ru-RU")
    : String(rounded);

  return (
    <div ref={ref} className="text-center">
      <p className="text-4xl font-bold text-brand-yellow sm:text-5xl">
        {display}
        <span>{suffix}</span>
      </p>
      <p className="mt-2 text-sm text-brand-muted sm:text-base">{label}</p>
    </div>
  );
}
