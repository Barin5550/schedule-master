"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart3,
  Calendar,
  ChevronDown,
  Lightbulb,
} from "lucide-react";
import Header, { Logo } from "@/components/layout/Header";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import HeroMock from "@/components/landing/HeroMock";
import StatItem from "@/components/landing/StatItem";
import FeatureCard from "@/components/landing/FeatureCard";
import StepItem from "@/components/landing/StepItem";
import TestimonialCard from "@/components/landing/TestimonialCard";

const headlineLine1 = ["Возьми", "под", "контроль"];
const headlineLine2 = ["своё", "время."];

const features = [
  {
    icon: Calendar,
    title: "Умное расписание",
    description:
      "Планируй день по блокам, повторяй привычки и держи всё под рукой — без хаоса и забытых дел.",
  },
  {
    icon: Lightbulb,
    title: "Советы экспертов",
    description:
      "Проверенные техники продуктивности и дисциплины, собранные в коротких и понятных подсказках.",
  },
  {
    icon: BarChart3,
    title: "Аналитика прогресса",
    description:
      "Наглядная статистика выполнения задач и привычек помогает видеть рост и не сбавлять темп.",
  },
];

const steps = [
  {
    title: "Регистрация",
    description: "Создай бесплатный аккаунт за минуту и начни прямо сейчас.",
  },
  {
    title: "Составь расписание",
    description: "Добавь задачи и привычки, распредели их по времени дня.",
  },
  {
    title: "Следуй плану",
    description: "Отмечай выполненное, отслеживай прогресс и расти каждый день.",
  },
];

const testimonials = [
  {
    name: "Анна Соколова",
    role: "Дизайнер-фрилансер",
    initials: "АС",
    quote:
      "Раньше я тонула в задачах. Теперь день расписан по блокам, и я успеваю в разы больше без выгорания.",
  },
  {
    name: "Дмитрий Орлов",
    role: "Основатель стартапа",
    initials: "ДО",
    quote:
      "ScheduleMaster стал моим вторым мозгом. Аналитика прогресса реально мотивирует не сдаваться.",
  },
  {
    name: "Мария Лебедева",
    role: "Студентка магистратуры",
    initials: "МЛ",
    quote:
      "Совмещаю учёбу и работу. Привычки и расписание помогли навести порядок и наконец высыпаться.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-black text-brand-text">
      <Header />

      {/* HERO */}
      <section className="relative flex min-h-[100vh] items-center overflow-hidden">
        <div className="bg-grid mask-radial pointer-events-none absolute inset-0" />

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:gap-8">
          <div>
            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block">
                {headlineLine1.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="mr-3 inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
              <span className="block italic text-brand-yellow">
                {headlineLine2.map((word, i) => (
                  <motion.span
                    key={word}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: (headlineLine1.length + i) * 0.1,
                    }}
                    className="mr-3 inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6 max-w-lg text-lg text-brand-muted"
            >
              Умное расписание для людей, которые серьёзно относятся к
              дисциплине.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.75 }}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <Link href="/auth/register">
                <Button variant="primary" size="lg" fullWidth>
                  Начать бесплатно
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" fullWidth>
                  Посмотреть демо
                </Button>
              </Link>
            </motion.div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroMock />
          </div>
        </div>

        <Link
          href="#features"
          aria-label="Прокрутить вниз"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand-muted transition-colors hover:text-brand-yellow"
        >
          <ChevronDown className="animate-bounce-slow h-7 w-7" />
        </Link>
      </section>

      {/* STATS */}
      <section className="border-y border-brand-border bg-brand-card/30">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-3">
          <StatItem value={10000} suffix="+" label="пользователей" formatThousands />
          <StatItem value={94} suffix="%" label="выполнение задач" />
          <StatItem value={2} suffix="x" label="продуктивность" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">
            Всё, что нужно для дисциплины
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-muted">
            Три инструмента, которые превращают намерения в стабильные результаты.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-brand-border bg-brand-card/30">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="text-3xl font-bold sm:text-4xl">Как это работает</h2>
            <p className="mx-auto mt-4 max-w-2xl text-brand-muted">
              Три простых шага от хаоса к управляемому дню.
            </p>
          </motion.div>

          <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
            <div className="absolute left-0 right-0 top-8 hidden h-px bg-brand-border lg:block" />
            {steps.map((step, i) => (
              <StepItem
                key={step.title}
                number={i + 1}
                title={step.title}
                description={step.description}
              />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14 text-center"
        >
          <h2 className="text-3xl font-bold sm:text-4xl">Нам доверяют</h2>
          <p className="mx-auto mt-4 max-w-2xl text-brand-muted">
            Истории людей, которые взяли своё время под контроль.
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={t.name}
              name={t.name}
              role={t.role}
              quote={t.quote}
              initials={t.initials}
              index={i}
            />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-brand-yellow bg-brand-card text-center shadow-yellow-glow sm:p-12">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Готов изменить свои привычки?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-brand-muted">
              Присоединяйся к тысячам людей, которые уже управляют своим временем
              осознанно.
            </p>
            <div className="mt-8 flex justify-center">
              <Link href="/auth/register">
                <Button variant="primary" size="lg">
                  Начать бесплатно
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-brand-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-10 sm:flex-row">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-sm font-semibold text-brand-text">
              ScheduleMaster
            </span>
          </Link>

          <p className="text-sm text-brand-muted">© 2026 ScheduleMaster</p>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-sm text-brand-muted transition-colors hover:text-brand-text"
            >
              Конфиденциальность
            </Link>
            <Link
              href="#"
              className="text-sm text-brand-muted transition-colors hover:text-brand-text"
            >
              Условия
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
