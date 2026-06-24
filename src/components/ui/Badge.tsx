import { cn } from "@/lib/utils";

type BadgeVariant = "yellow" | "gray" | "green" | "red";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  yellow: "bg-brand-yellow/15 text-brand-yellow border-brand-yellow/30",
  gray: "bg-white/5 text-brand-muted border-brand-border",
  green: "bg-green-500/15 text-green-400 border-green-500/30",
  red: "bg-red-500/15 text-red-400 border-red-500/30",
};

export default function Badge({
  className,
  variant = "gray",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
