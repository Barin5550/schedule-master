"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Clock } from "lucide-react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { categoryLabels } from "@/data/tips";
import { categoryIcons } from "./tipIcons";
import { cn } from "@/lib/utils";
import type { Tip } from "@/types";

export interface TipCardProps {
  tip: Tip;
  saved: boolean;
  onToggleSave: (id: string) => void;
  onOpen: (tip: Tip) => void;
}

const TipCard = forwardRef<HTMLDivElement, TipCardProps>(function TipCard(
  { tip, saved, onToggleSave, onOpen },
  ref,
) {
  const Icon = categoryIcons[tip.category];

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Card
        hover
        role="button"
        tabIndex={0}
        onClick={() => onOpen(tip)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onOpen(tip);
          }
        }}
        className="group flex h-full cursor-pointer flex-col"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <Badge variant="yellow">
            <Icon className="h-3.5 w-3.5" />
            {categoryLabels[tip.category]}
          </Badge>
          <button
            type="button"
            aria-label={saved ? "Убрать из сохранённого" : "Сохранить совет"}
            aria-pressed={saved}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(tip.id);
            }}
            className={cn(
              "-mr-1 -mt-1 shrink-0 rounded-lg p-1.5 transition-colors",
              saved
                ? "text-brand-yellow hover:bg-brand-yellow/10"
                : "text-brand-muted hover:bg-white/5 hover:text-brand-text",
            )}
          >
            {saved ? (
              <BookmarkCheck className="h-5 w-5 fill-brand-yellow" />
            ) : (
              <Bookmark className="h-5 w-5" />
            )}
          </button>
        </div>

        <h3 className="text-base font-semibold leading-snug text-brand-text transition-colors group-hover:text-brand-yellow">
          {tip.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-brand-muted">
          {tip.excerpt}
        </p>

        <div className="mt-4 flex items-center gap-1.5 text-xs text-brand-muted">
          <Clock className="h-3.5 w-3.5" />
          {tip.readingTime} мин
        </div>
      </Card>
    </motion.div>
  );
});

TipCard.displayName = "TipCard";

export default TipCard;
