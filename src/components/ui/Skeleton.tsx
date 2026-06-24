import { cn } from "@/lib/utils";

/** Серый мигающий блок-заглушка для loading-состояний. */
export default function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-brand-border/50",
        className,
      )}
      {...props}
    />
  );
}
