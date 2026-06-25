"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "schedulemaster_onboarded";

const steps: { title: string; text: string }[] = [
  {
    title: "Добро пожаловать!",
    text: "Это твой дашборд — здесь ты видишь расписание на сегодня и прогресс.",
  },
  {
    title: "Добавь первую задачу",
    text: "Нажми «Добавить задачу», задай время и категорию — и она появится в таймлайне.",
  },
  {
    title: "Управляй расписанием",
    text: "В разделе «Расписание» задачи можно перетаскивать по времени и переключать День / Неделя / Месяц.",
  },
  {
    title: "Закрепи день как основу",
    text: "Составил идеальный день? Закрепи его как основу и применяй на любой другой день одним кликом.",
  },
  {
    title: "Готово!",
    text: "Начни с первой задачи — маленький шаг сегодня превращается в серию завтра. 🚀",
  },
];

/** Онбординг-тур: показывается один раз при первом входе. */
export default function OnboardingTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) setOpen(true);
    } catch {
      // ignore
    }
  }, []);

  function finish() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // ignore
    }
    setOpen(false);
  }

  function next() {
    if (step < steps.length - 1) setStep((s) => s + 1);
    else finish();
  }

  const current = steps[step];
  const last = step === steps.length - 1;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={finish}
            className="absolute inset-0 bg-black/50"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm rounded-2xl border border-brand-yellow bg-brand-card p-6 shadow-yellow-glow"
          >
            <span className="text-xs font-semibold text-brand-yellow">
              {step + 1} / {steps.length}
            </span>
            <h2 className="mt-2 text-lg font-semibold text-brand-text">
              {current.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-muted">
              {current.text}
            </p>

            <div className="mt-5 flex justify-center gap-1.5">
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full transition-colors",
                    i === step ? "bg-brand-yellow" : "bg-brand-border",
                  )}
                />
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <Button variant="ghost" size="sm" onClick={finish}>
                Пропустить
              </Button>
              <Button variant="primary" size="sm" onClick={next}>
                {last ? "Начать" : "Далее"}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
