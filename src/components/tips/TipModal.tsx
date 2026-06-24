"use client";

import { Bookmark, BookmarkCheck, Clock } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { categoryLabels } from "@/data/tips";
import { categoryIcons } from "./tipIcons";
import type { Tip } from "@/types";

export interface TipModalProps {
  tip: Tip | null;
  open: boolean;
  onClose: () => void;
  saved: boolean;
  onToggleSave: (id: string) => void;
}

export default function TipModal({
  tip,
  open,
  onClose,
  saved,
  onToggleSave,
}: TipModalProps) {
  if (!tip) return null;

  const Icon = categoryIcons[tip.category];

  return (
    <Modal open={open} onClose={onClose} title={tip.title}>
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="yellow">
            <Icon className="h-3.5 w-3.5" />
            {categoryLabels[tip.category]}
          </Badge>
          <span className="inline-flex items-center gap-1 text-sm text-brand-muted">
            <Clock className="h-4 w-4" />
            {tip.readingTime} мин
          </span>
        </div>

        <p className="text-[15px] leading-relaxed text-brand-text/90">
          {tip.body}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-brand-border pt-4">
          <span className="text-sm text-brand-muted">
            Автор: <span className="text-brand-text">{tip.author}</span>
          </span>
          <Button
            variant={saved ? "primary" : "outline"}
            size="sm"
            onClick={() => onToggleSave(tip.id)}
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
    </Modal>
  );
}
