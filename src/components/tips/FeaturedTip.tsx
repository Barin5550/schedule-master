"use client";

import { motion } from "framer-motion";
import { Bookmark, BookmarkCheck, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { categoryLabels } from "@/data/tips";
import { categoryIcons } from "./tipIcons";
import type { Tip } from "@/types";

export interface FeaturedTipProps {
  tip: Tip;
  saved: boolean;
  onToggleSave: (id: string) => void;
  onOpen: (tip: Tip) => void;
}

export default function FeaturedTip({
  tip,
  saved,
  onToggleSave,
  onOpen,
}: FeaturedTipProps) {
  const Icon = categoryIcons[tip.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={() => onOpen(tip)}
      className="group relative w-full cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-br from-brand-yellow to-amber-600 p-7 text-brand-black shadow-yellow-glow sm:p-9"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full bg-white/20 blur-2xl" />

      <div className="relative flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-black/15 px-3 py-1 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Совет дня
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-black/15 px-3 py-1 text-xs font-semibold">
            <Icon className="h-3.5 w-3.5" />
            {categoryLabels[tip.category]}
          </span>
        </div>

        <h2 className="max-w-2xl text-2xl font-bold leading-tight sm:text-3xl">
          {tip.title}
        </h2>
        <p className="max-w-2xl text-[15px] font-medium leading-relaxed text-brand-black/80">
          {tip.excerpt}
        </p>

        <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-semibold text-brand-black/70">
            {tip.author}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(tip.id);
            }}
            className="bg-brand-black text-brand-yellow hover:bg-brand-black/85 hover:text-brand-yellow"
          >
            {saved ? (
              <>
                <BookmarkCheck className="h-4 w-4" />
                Сохранено
              </>
            ) : (
              <>
                <Bookmark className="h-4 w-4" />
                Сохранить
              </>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
