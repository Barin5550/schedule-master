"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Flame, Pencil, Upload, X } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useCountUp } from "@/hooks/useCountUp";

export interface ProfileHeaderProps {
  /** Текущее отображаемое имя. */
  name: string;
  /** Email пользователя (только для чтения). */
  email: string;
  /** Дата регистрации (человекочитаемая строка). */
  joinedLabel: string;
  /** Текущая серия дней подряд. */
  streak: number;
  /** Сохранение нового имени. */
  onNameChange: (name: string) => void;
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export default function ProfileHeader({
  name,
  email,
  joinedLabel,
  streak,
  onNameChange,
}: ProfileHeaderProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(name);
  const streakCount = useCountUp(streak);

  function save() {
    const next = draft.trim();
    if (next) onNameChange(next);
    setEditing(false);
  }

  function cancel() {
    setDraft(name);
    setEditing(false);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-start">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-brand-yellow text-3xl font-bold text-brand-black shadow-yellow-glow">
              {initialsOf(name)}
            </div>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="text-brand-muted"
            >
              <Upload className="h-4 w-4" />
              Загрузить фото
            </Button>
          </div>

          {/* Identity */}
          <div className="flex flex-col items-center gap-1.5 sm:items-start">
            {editing ? (
              <div className="flex items-end gap-2">
                <Input
                  autoFocus
                  value={draft}
                  aria-label="Имя"
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") save();
                    if (e.key === "Escape") cancel();
                  }}
                  className="h-10 w-56"
                />
                <Button
                  size="sm"
                  type="button"
                  onClick={save}
                  aria-label="Сохранить имя"
                >
                  <Check className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  type="button"
                  onClick={cancel}
                  aria-label="Отменить"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-brand-text">{name}</h1>
                <button
                  type="button"
                  onClick={() => {
                    setDraft(name);
                    setEditing(true);
                  }}
                  aria-label="Изменить имя"
                  className="rounded-lg p-1.5 text-brand-muted transition-colors hover:bg-white/5 hover:text-brand-yellow"
                >
                  <Pencil className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="text-sm text-brand-muted">{email}</p>
            <p className="text-sm text-brand-muted">
              Дата регистрации: {joinedLabel}
            </p>
          </div>
        </div>

        {/* Streak */}
        <div className="flex shrink-0 flex-col items-center gap-1 rounded-xl border border-brand-border bg-brand-black px-6 py-4">
          <Flame className="h-7 w-7 text-brand-yellow" />
          <div className="text-4xl font-bold text-brand-yellow">
            {Math.round(streakCount)}
          </div>
          <div className="text-xs uppercase tracking-wide text-brand-muted">
            Серия дней
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
