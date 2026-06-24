"use client";

import { cn } from "@/lib/utils";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
}

export interface SegmentedProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label?: string;
}

export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: SegmentedProps<T>) {
  return (
    <div>
      {label && (
        <span className="mb-1.5 block text-sm font-medium text-brand-muted">
          {label}
        </span>
      )}
      <div className="inline-flex rounded-xl border border-brand-border bg-brand-black p-1">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-brand-yellow text-brand-black"
                  : "text-brand-muted hover:text-brand-text",
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
