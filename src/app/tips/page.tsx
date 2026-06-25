"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  X,
  Bookmark,
  Timer,
  CalendarRange,
  ListChecks,
  Zap,
  PieChart,
} from "lucide-react";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import EmptyState from "@/components/ui/EmptyState";
import Button from "@/components/ui/Button";
import { tips, tipCategories } from "@/data/tips";
import { cn } from "@/lib/utils";
import type { Tip, TipCategory } from "@/types";
import { useSavedTips } from "@/hooks/useSavedTips";
import TipCard from "@/components/tips/TipCard";
import TipModal from "@/components/tips/TipModal";
import FeaturedTip from "@/components/tips/FeaturedTip";
import TechniqueCard, { type Technique } from "@/components/tips/TechniqueCard";

type CategoryKey = TipCategory | "all";

const techniques: Technique[] = [
  {
    id: "pomodoro",
    name: "Pomodoro",
    description: "25 минут фокуса, затем 5 минут отдыха.",
    detail:
      "Техника Pomodoro делит работу на интервалы по 25 минут с короткими перерывами. После четырёх «помидоров» — длинный перерыв 15–30 минут. Короткий горизонт снижает прокрастинацию и удерживает концентрацию.",
    icon: Timer,
  },
  {
    id: "time-blocking",
    name: "Time Blocking",
    description: "Каждой задаче — конкретный слот в календаре.",
    detail:
      "Резервируй в календаре отрезок под каждую задачу вместо размытого списка дел. Это убирает паралич выбора и заставляет реалистично оценивать день. Оставляй 20% времени пустым под непредвиденное.",
    icon: CalendarRange,
  },
  {
    id: "gtd",
    name: "Метод GTD",
    description: "Выгрузи всё из головы в надёжную систему.",
    detail:
      "Getting Things Done: фиксируй все задачи во внешней системе, проясняй следующее действие, организуй по контекстам и регулярно пересматривай. Голова — для мыслей, а не для хранения списков.",
    icon: ListChecks,
  },
  {
    id: "two-minute",
    name: "Правило 2 минут",
    description: "Дело меньше двух минут — сделай сразу.",
    detail:
      "Если задача занимает меньше двух минут, выполнить её сразу дешевле, чем записывать и возвращаться. Для новых привычек начни с двухминутной версии, чтобы снизить барьер входа.",
    icon: Zap,
  },
  {
    id: "pareto",
    name: "Принцип Парето",
    description: "80% результата дают 20% усилий.",
    detail:
      "Вклад задач в результат неравномерен: малая часть дел приносит большую часть пользы. Выдели эти 20% и вложись в них в первую очередь, остальное делегируй или убирай.",
    icon: PieChart,
  },
];

export default function TipsPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("all");
  const [activeTip, setActiveTip] = useState<Tip | null>(null);
  const [activeTechnique, setActiveTechnique] = useState<Technique | null>(null);

  // Сохранённые советы: демо → localStorage, реальный режим → Supabase.
  const { savedIds, toggle: toggleSave, isSaved } = useSavedTips();

  const hasQuery = query.trim().length > 0;

  const filteredTips = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tips.filter((tip) => {
      const matchesCategory =
        activeCategory === "all" || tip.category === activeCategory;
      const matchesQuery =
        q.length === 0 ||
        tip.title.toLowerCase().includes(q) ||
        tip.excerpt.toLowerCase().includes(q) ||
        tip.body.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, activeCategory]);

  const featuredTip = tips[0];
  const savedTips = tips.filter((t) => savedIds.includes(t.id));

  return (
    <div className="flex flex-col gap-12">
      {/* HERO */}
      <section className="flex flex-col gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col gap-2"
        >
          <h1 className="text-3xl font-bold tracking-tight text-brand-text sm:text-4xl">
            База знаний
          </h1>
          <p className="max-w-2xl text-brand-muted">
            Конкретные, применимые советы по дисциплине и продуктивности.
          </p>
        </motion.div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 z-10 h-5 w-5 -translate-y-1/2 text-brand-muted" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по советам…"
            aria-label="Поиск по советам"
            className="h-12 pl-12 text-base"
            rightSlot={
              hasQuery ? (
                <button
                  type="button"
                  aria-label="Очистить поиск"
                  onClick={() => setQuery("")}
                  className="rounded-md p-1 transition-colors hover:text-brand-text"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : undefined
            }
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {tipCategories.map((cat) => {
            const active = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key as CategoryKey)}
                className={cn(
                  "rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "border-brand-yellow bg-brand-yellow text-brand-black"
                    : "border-brand-border bg-brand-card text-brand-muted hover:border-brand-yellow/50 hover:text-brand-text",
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* FEATURED */}
      {!hasQuery && (
        <FeaturedTip
          tip={featuredTip}
          saved={isSaved(featuredTip.id)}
          onToggleSave={toggleSave}
          onOpen={setActiveTip}
        />
      )}

      {/* GRID */}
      <section className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-brand-text">
          {hasQuery ? "Результаты поиска" : "Все советы"}
        </h2>

        {filteredTips.length === 0 ? (
          <EmptyState
            title="Ничего не найдено"
            description="Попробуй изменить запрос или выбрать другую категорию."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("all");
                }}
              >
                Сбросить фильтры
              </Button>
            }
          />
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredTips.map((tip) => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  saved={isSaved(tip.id)}
                  onToggleSave={toggleSave}
                  onOpen={setActiveTip}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* TECHNIQUES */}
      <section className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <h2 className="text-xl font-semibold text-brand-text">Техники</h2>
          <p className="text-sm text-brand-muted">
            Проверенные методы, которые легко начать применять сегодня.
          </p>
        </div>
        <div className="-mx-1 flex snap-x gap-4 overflow-x-auto px-1 pb-2">
          {techniques.map((technique) => (
            <TechniqueCard
              key={technique.id}
              technique={technique}
              onLearnMore={setActiveTechnique}
            />
          ))}
        </div>
      </section>

      {/* COLLECTION */}
      {savedTips.length > 0 && (
        <section className="flex flex-col gap-5">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-brand-yellow" />
            <h2 className="text-xl font-semibold text-brand-text">
              Твоя коллекция
            </h2>
            <span className="text-sm text-brand-muted">
              ({savedTips.length})
            </span>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {savedTips.map((tip) => (
                <TipCard
                  key={tip.id}
                  tip={tip}
                  saved
                  onToggleSave={toggleSave}
                  onOpen={setActiveTip}
                />
              ))}
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* TIP MODAL */}
      <TipModal
        tip={activeTip}
        open={activeTip !== null}
        onClose={() => setActiveTip(null)}
        saved={activeTip ? isSaved(activeTip.id) : false}
        onToggleSave={toggleSave}
      />

      {/* TECHNIQUE MODAL */}
      <Modal
        open={activeTechnique !== null}
        onClose={() => setActiveTechnique(null)}
        title={activeTechnique?.name}
      >
        {activeTechnique && (
          <div className="flex flex-col gap-4">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow/15 text-brand-yellow">
              <activeTechnique.icon className="h-6 w-6" />
            </div>
            <p className="text-[15px] leading-relaxed text-brand-text/90">
              {activeTechnique.detail}
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
}
