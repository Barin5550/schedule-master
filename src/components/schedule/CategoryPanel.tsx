"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pencil, X } from "lucide-react";
import type { Category } from "@/types";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export type TemplateKey = "work" | "study" | "weekend";

interface CategoryPanelProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  onRenameCategory: (id: string, name: string) => void;
  activeFilter: string | null;
  onFilter: (id: string | null) => void;
  onApplyTemplate: (key: TemplateKey) => void;
}

const templates: { key: TemplateKey; label: string; desc: string }[] = [
  { key: "work", label: "Рабочий день", desc: "Митинги, фокус-сессии, обед" },
  { key: "study", label: "Учебный день", desc: "Лекции, практика, чтение" },
  { key: "weekend", label: "Выходной", desc: "Спорт, отдых, личные дела" },
];

export default function CategoryPanel({
  open,
  onClose,
  categories,
  onRenameCategory,
  activeFilter,
  onFilter,
  onApplyTemplate,
}: CategoryPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setDraftName(cat.name);
  }

  function commitEdit() {
    if (editingId && draftName.trim()) {
      onRenameCategory(editingId, draftName.trim());
    }
    setEditingId(null);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Затемнение на мобильных */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
          <motion.aside
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
            className="fixed right-0 top-0 z-50 flex h-full w-80 max-w-[85vw] flex-col border-l border-brand-border bg-brand-card lg:sticky lg:top-20 lg:z-0 lg:h-auto lg:max-h-[calc(100vh-6rem)] lg:rounded-xl lg:border"
          >
            <div className="flex items-center justify-between border-b border-brand-border px-4 py-3">
              <h2 className="text-sm font-semibold text-brand-text">
                Категории
              </h2>
              <button
                onClick={onClose}
                aria-label="Закрыть панель"
                className="rounded-lg p-1.5 text-brand-muted transition-colors hover:bg-white/5 hover:text-brand-text"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-4">
              {/* Фильтр + список категорий */}
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => onFilter(null)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors",
                    activeFilter === null
                      ? "bg-brand-yellow/10 text-brand-text"
                      : "text-brand-muted hover:bg-white/5 hover:text-brand-text",
                  )}
                >
                  <span className="h-3 w-3 rounded-full border border-brand-border" />
                  Все категории
                </button>

                {categories.map((cat) => {
                  const active = activeFilter === cat.id;
                  const editing = editingId === cat.id;
                  return (
                    <div
                      key={cat.id}
                      className={cn(
                        "flex items-center gap-2 rounded-lg px-2.5 py-1.5 transition-colors",
                        active ? "bg-brand-yellow/10" : "hover:bg-white/5",
                      )}
                    >
                      <span
                        className="h-3 w-3 shrink-0 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      {editing ? (
                        <input
                          autoFocus
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          onBlur={commitEdit}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commitEdit();
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="h-7 flex-1 rounded-md border border-brand-yellow bg-brand-black px-2 text-sm text-brand-text focus:outline-none"
                        />
                      ) : (
                        <button
                          type="button"
                          onClick={() => onFilter(active ? null : cat.id)}
                          className={cn(
                            "flex-1 truncate text-left text-sm",
                            active ? "text-brand-text" : "text-brand-muted",
                          )}
                        >
                          {cat.name}
                        </button>
                      )}
                      {editing ? (
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={commitEdit}
                          aria-label="Сохранить"
                          className="rounded-md p-1 text-brand-yellow hover:bg-white/5"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEdit(cat)}
                          aria-label="Переименовать"
                          className="rounded-md p-1 text-brand-muted opacity-60 hover:bg-white/5 hover:text-brand-text"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Шаблоны */}
              <div>
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-brand-muted">
                  Шаблоны
                </h3>
                <div className="space-y-2">
                  {templates.map((tpl) => (
                    <button
                      key={tpl.key}
                      type="button"
                      onClick={() => onApplyTemplate(tpl.key)}
                      className="w-full rounded-lg border border-brand-border px-3 py-2 text-left transition-colors hover:border-brand-yellow hover:bg-white/5"
                    >
                      <p className="text-sm font-medium text-brand-text">
                        {tpl.label}
                      </p>
                      <p className="text-xs text-brand-muted">{tpl.desc}</p>
                    </button>
                  ))}
                </div>
                <p className="mt-3 text-[11px] leading-snug text-brand-muted">
                  Шаблон заменит задачи выбранного дня готовым набором.
                </p>
              </div>
            </div>

            <div className="border-t border-brand-border p-4 lg:hidden">
              <Button variant="outline" fullWidth onClick={onClose}>
                Готово
              </Button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
