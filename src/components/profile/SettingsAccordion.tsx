"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bell,
  Calendar,
  Check,
  Palette,
  Shield,
  Trash2,
  User,
} from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Toggle from "@/components/ui/Toggle";
import Slider from "@/components/ui/Slider";
import { cn } from "@/lib/utils";
import AccordionSection from "@/components/profile/AccordionSection";
import Segmented from "@/components/profile/Segmented";
import DangerZone from "@/components/profile/DangerZone";

type SectionKey =
  | "personal"
  | "schedule"
  | "notifications"
  | "appearance"
  | "security"
  | "danger";

type Goal = "study" | "work" | "growth";
type ProductiveTime = "morning" | "day" | "evening";
type BlockLen = "15" | "30" | "60";
type FontSize = "s" | "m" | "l";
type Density = "compact" | "comfortable";

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function SavedHint({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-green-400"
        >
          <Check className="h-4 w-4" />
          Сохранено
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export interface SettingsAccordionProps {
  initialName: string;
}

export default function SettingsAccordion({
  initialName,
}: SettingsAccordionProps) {
  const [openKey, setOpenKey] = useState<SectionKey | null>("personal");
  const [savedKey, setSavedKey] = useState<SectionKey | null>(null);

  function toggle(key: SectionKey) {
    setOpenKey((prev) => (prev === key ? null : key));
  }

  function flagSaved(key: SectionKey) {
    setSavedKey(key);
    window.setTimeout(
      () => setSavedKey((prev) => (prev === key ? null : prev)),
      2500,
    );
  }

  // Личные данные
  const [name, setName] = useState(initialName);
  const [goal, setGoal] = useState<Goal>("work");
  const [productive, setProductive] = useState<ProductiveTime>("morning");

  // Расписание
  const [workFrom, setWorkFrom] = useState("09:00");
  const [workTo, setWorkTo] = useState("18:00");
  const [activeDays, setActiveDays] = useState<boolean[]>([
    true,
    true,
    true,
    true,
    true,
    false,
    false,
  ]);
  const [blockLen, setBlockLen] = useState<BlockLen>("30");

  // Уведомления
  const [remindBefore, setRemindBefore] = useState(15);
  const [dailyDigest, setDailyDigest] = useState(true);

  // Внешний вид
  const [fontSize, setFontSize] = useState<FontSize>("m");
  const [density, setDensity] = useState<Density>("comfortable");

  // Безопасность
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [repeatPw, setRepeatPw] = useState("");

  function toggleDay(i: number) {
    setActiveDays((prev) => prev.map((d, idx) => (idx === i ? !d : d)));
  }

  return (
    <div className="space-y-3">
      {/* Личные данные */}
      <AccordionSection
        icon={<User className="h-5 w-5" />}
        title="Личные данные"
        open={openKey === "personal"}
        onToggle={() => toggle("personal")}
      >
        <div className="space-y-5">
          <Input
            label="Имя"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <span className="mb-1.5 block text-sm font-medium text-brand-muted">
                Цель
              </span>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value as Goal)}
                className="h-11 w-full rounded-xl border border-brand-border bg-brand-black px-4 text-brand-text transition-all duration-200 focus:border-brand-yellow focus:shadow-yellow-glow focus:outline-none"
              >
                <option value="study">Учёба</option>
                <option value="work">Работа</option>
                <option value="growth">Личное развитие</option>
              </select>
            </div>
            <Segmented<ProductiveTime>
              label="Продуктивное время"
              value={productive}
              onChange={setProductive}
              options={[
                { value: "morning", label: "Утро" },
                { value: "day", label: "День" },
                { value: "evening", label: "Вечер" },
              ]}
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" onClick={() => flagSaved("personal")}>
              Сохранить
            </Button>
            <SavedHint show={savedKey === "personal"} />
          </div>
        </div>
      </AccordionSection>

      {/* Расписание */}
      <AccordionSection
        icon={<Calendar className="h-5 w-5" />}
        title="Расписание"
        open={openKey === "schedule"}
        onToggle={() => toggle("schedule")}
      >
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Рабочие часы: с"
              type="time"
              value={workFrom}
              onChange={(e) => setWorkFrom(e.target.value)}
            />
            <Input
              label="до"
              type="time"
              value={workTo}
              onChange={(e) => setWorkTo(e.target.value)}
            />
          </div>
          <div>
            <span className="mb-2 block text-sm font-medium text-brand-muted">
              Дни недели
            </span>
            <div className="flex flex-wrap gap-2">
              {weekDays.map((d, i) => (
                <button
                  key={d}
                  type="button"
                  aria-pressed={activeDays[i]}
                  onClick={() => toggleDay(i)}
                  className={cn(
                    "h-10 w-12 rounded-lg border text-sm font-medium transition-all duration-200",
                    activeDays[i]
                      ? "border-brand-yellow bg-brand-yellow text-brand-black"
                      : "border-brand-border bg-brand-black text-brand-muted hover:text-brand-text",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
          <Segmented<BlockLen>
            label="Длина блока по умолчанию"
            value={blockLen}
            onChange={setBlockLen}
            options={[
              { value: "15", label: "15 мин" },
              { value: "30", label: "30 мин" },
              { value: "60", label: "60 мин" },
            ]}
          />
          <div className="flex items-center gap-3">
            <Button type="button" onClick={() => flagSaved("schedule")}>
              Сохранить
            </Button>
            <SavedHint show={savedKey === "schedule"} />
          </div>
        </div>
      </AccordionSection>

      {/* Уведомления */}
      <AccordionSection
        icon={<Bell className="h-5 w-5" />}
        title="Уведомления"
        open={openKey === "notifications"}
        onToggle={() => toggle("notifications")}
      >
        <div className="space-y-6">
          <Slider
            label="Напоминать за"
            value={remindBefore}
            onChange={setRemindBefore}
            min={0}
            max={60}
            step={5}
            suffix=" мин"
          />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-brand-text">Ежедневный дайджест</p>
              <p className="text-sm text-brand-muted">
                Сводка задач каждое утро
              </p>
            </div>
            <Toggle
              checked={dailyDigest}
              onChange={setDailyDigest}
              label="Ежедневный дайджест"
            />
          </div>
          <div className="flex items-center gap-3">
            <Button type="button" onClick={() => flagSaved("notifications")}>
              Сохранить
            </Button>
            <SavedHint show={savedKey === "notifications"} />
          </div>
        </div>
      </AccordionSection>

      {/* Внешний вид */}
      <AccordionSection
        icon={<Palette className="h-5 w-5" />}
        title="Внешний вид"
        open={openKey === "appearance"}
        onToggle={() => toggle("appearance")}
      >
        <div className="space-y-5">
          <Segmented<FontSize>
            label="Размер шрифта"
            value={fontSize}
            onChange={setFontSize}
            options={[
              { value: "s", label: "S" },
              { value: "m", label: "M" },
              { value: "l", label: "L" },
            ]}
          />
          <Segmented<Density>
            label="Плотность контента"
            value={density}
            onChange={setDensity}
            options={[
              { value: "compact", label: "Компактно" },
              { value: "comfortable", label: "Комфортно" },
            ]}
          />
          <div className="flex items-center gap-3">
            <Button type="button" onClick={() => flagSaved("appearance")}>
              Сохранить
            </Button>
            <SavedHint show={savedKey === "appearance"} />
          </div>
        </div>
      </AccordionSection>

      {/* Безопасность */}
      <AccordionSection
        icon={<Shield className="h-5 w-5" />}
        title="Безопасность"
        open={openKey === "security"}
        onToggle={() => toggle("security")}
      >
        <div className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Текущий пароль"
              type="password"
              value={currentPw}
              onChange={(e) => setCurrentPw(e.target.value)}
              placeholder="••••••••"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Новый пароль"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                placeholder="••••••••"
              />
              <Input
                label="Повторите пароль"
                type="password"
                value={repeatPw}
                onChange={(e) => setRepeatPw(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={() => {
                  flagSaved("security");
                  setCurrentPw("");
                  setNewPw("");
                  setRepeatPw("");
                }}
              >
                Сменить пароль
              </Button>
              <SavedHint show={savedKey === "security"} />
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-medium text-brand-muted">
              Активные сессии
            </p>
            <ul className="divide-y divide-brand-border overflow-hidden rounded-xl border border-brand-border">
              {[
                { device: "Windows · Chrome", when: "сейчас", current: true },
                {
                  device: "iPhone · Safari",
                  when: "2 дня назад",
                  current: false,
                },
              ].map((s) => (
                <li
                  key={s.device}
                  className="flex items-center justify-between bg-brand-black px-4 py-3"
                >
                  <div>
                    <p className="text-sm text-brand-text">{s.device}</p>
                    <p className="text-xs text-brand-muted">{s.when}</p>
                  </div>
                  {s.current ? (
                    <span className="text-xs text-brand-muted">
                      Текущая сессия
                    </span>
                  ) : (
                    <button
                      type="button"
                      className="text-sm font-medium text-red-400 transition-colors hover:text-red-300"
                    >
                      Завершить
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </AccordionSection>

      {/* Опасная зона */}
      <AccordionSection
        icon={<Trash2 className="h-5 w-5" />}
        title="Опасная зона"
        open={openKey === "danger"}
        onToggle={() => toggle("danger")}
      >
        <DangerZone />
      </AccordionSection>
    </div>
  );
}
