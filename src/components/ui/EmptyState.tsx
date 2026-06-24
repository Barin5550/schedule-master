import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

/** Иллюстрация-заглушка для пустых списков. */
export default function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-brand-border bg-brand-card/40 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-5">{icon ?? <DefaultIllustration />}</div>
      <h3 className="text-lg font-semibold text-brand-text">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-brand-muted">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

function DefaultIllustration() {
  return (
    <svg
      width="120"
      height="96"
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect
        x="18"
        y="14"
        width="84"
        height="68"
        rx="10"
        fill="#111111"
        stroke="#222222"
        strokeWidth="2"
      />
      <rect x="30" y="30" width="60" height="6" rx="3" fill="#222222" />
      <rect x="30" y="44" width="44" height="6" rx="3" fill="#222222" />
      <rect x="30" y="58" width="52" height="6" rx="3" fill="#1a1a1a" />
      <circle cx="92" cy="70" r="18" fill="#0A0A0A" stroke="#F5C518" strokeWidth="3" />
      <path
        d="M86 70h12M92 64v12"
        stroke="#F5C518"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
