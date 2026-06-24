import type { ReactNode } from "react";

export interface AuthSplitProps {
  quote: string;
  author: string;
  children: ReactNode;
}

export default function AuthSplit({ quote, author, children }: AuthSplitProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left — decorative panel */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-brand-yellow p-12 lg:flex">
        {/* Decorative geometric shapes */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full border-[3px] border-white/20" />
          <div className="absolute right-12 top-24 h-40 w-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 left-24 h-56 w-56 rounded-full border-[3px] border-brand-black/10" />
          <div className="absolute bottom-32 right-[-3rem] h-64 w-64 rounded-full bg-brand-black/5" />
          <svg
            className="absolute right-16 top-1/3 h-32 w-32 text-white/20"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden="true"
          >
            <rect
              x="10"
              y="10"
              width="80"
              height="80"
              rx="12"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute left-10 top-1/2 h-px w-40 bg-brand-black/10" />
          <div className="absolute bottom-44 left-10 h-px w-24 bg-white/30" />
        </div>

        {/* Brand mark */}
        <div className="relative z-10 flex items-center gap-2 text-brand-black">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-black text-brand-yellow font-bold">
            S
          </span>
          <span className="text-lg font-semibold">ScheduleMaster</span>
        </div>

        {/* Quote */}
        <blockquote className="relative z-10 max-w-md">
          <p className="text-3xl font-semibold leading-snug text-white lg:text-4xl">
            «{quote}»
          </p>
        </blockquote>

        {/* Author */}
        <p className="relative z-10 text-sm font-medium text-brand-black/70">
          — {author}
        </p>
      </div>

      {/* Right — form panel */}
      <div className="flex w-full flex-col items-center justify-center bg-brand-black px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
