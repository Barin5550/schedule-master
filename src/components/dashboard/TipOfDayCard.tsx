"use client";

import { Lightbulb } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { tips, categoryLabels } from "@/data/tips";

/** Карточка «Совет дня» — выбирает совет по дню года. */
export default function TipOfDayCard() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86_400_000,
  );
  const tip = tips[dayOfYear % tips.length] ?? tips[0];

  return (
    <Card hover className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-brand-yellow" />
        <h2 className="text-base font-semibold text-brand-text">Совет дня</h2>
      </div>
      <h3 className="text-lg font-semibold leading-snug text-brand-text">
        {tip.title}
      </h3>
      <p className="text-sm leading-relaxed text-brand-muted">{tip.excerpt}</p>
      <div className="mt-1 flex items-center justify-between">
        <Badge variant="yellow">{categoryLabels[tip.category]}</Badge>
        <span className="text-xs text-brand-muted">
          {tip.readingTime} мин · {tip.author}
        </span>
      </div>
    </Card>
  );
}
