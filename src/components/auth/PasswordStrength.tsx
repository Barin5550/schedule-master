"use client";

import { cn } from "@/lib/utils";

export interface PasswordStrengthProps {
  value: string;
}

function scorePassword(value: string): number {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 6) score += 1;
  if (value.length >= 10) score += 1;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1;
  if (/\d/.test(value) || /[^A-Za-z0-9]/.test(value)) score += 1;
  return Math.min(score, 4);
}

const labels = ["Слабый", "Слабый", "Средний", "Хороший", "Надёжный"];

export default function PasswordStrength({ value }: PasswordStrengthProps) {
  const score = scorePassword(value);

  if (!value) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-colors duration-300",
              i < score ? "bg-brand-yellow" : "bg-brand-border",
            )}
          />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-brand-muted">
        Надёжность пароля:{" "}
        <span className="font-medium text-brand-text">{labels[score]}</span>
      </p>
    </div>
  );
}
