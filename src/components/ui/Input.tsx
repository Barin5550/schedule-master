"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  /** Optional element rendered on the right side of the field (e.g. show/hide password). */
  rightSlot?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, rightSlot, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="mb-1.5 block text-sm font-medium text-brand-muted"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "h-11 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-brand-text",
              "placeholder:text-brand-muted/70",
              "transition-all duration-200",
              "focus:border-brand-yellow focus:shadow-yellow-glow focus:outline-none",
              error && "border-red-500/70 focus:border-red-500 focus:shadow-none",
              rightSlot && "pr-11",
              className,
            )}
            aria-invalid={!!error}
            {...props}
          />
          {rightSlot && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-brand-muted">
              {rightSlot}
            </div>
          )}
        </div>
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
