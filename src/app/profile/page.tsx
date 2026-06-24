"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Folder, Percent, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStatCard from "@/components/profile/ProfileStatCard";
import SettingsAccordion from "@/components/profile/SettingsAccordion";
import AchievementsGrid from "@/components/profile/AchievementsGrid";

const FALLBACK_NAME = "Чемпион";
const FALLBACK_EMAIL = "demo@schedulemaster.app";

export default function ProfilePage() {
  const { user } = useAuth();

  const initialName =
    (user?.user_metadata?.first_name as string | undefined) ?? FALLBACK_NAME;
  const email = user?.email ?? FALLBACK_EMAIL;

  const [name, setName] = useState(initialName);

  return (
    <div className="space-y-10">
      <ProfileHeader
        name={name}
        email={email}
        joinedLabel="июнь 2026"
        streak={21}
        onNameChange={setName}
      />

      {/* Статистика */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-brand-text">
          Статистика
        </h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <ProfileStatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Задач выполнено"
            value={248}
            delay={0}
          />
          <ProfileStatCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Лучшая серия"
            value={34}
            suffix=" дня"
            delay={0.08}
          />
          <ProfileStatCard
            icon={<Folder className="h-5 w-5" />}
            label="Любимая категория"
            textValue="Работа"
            delay={0.16}
          />
          <ProfileStatCard
            icon={<Percent className="h-5 w-5" />}
            label="Средний % за месяц"
            value={87}
            suffix="%"
            delay={0.24}
          />
        </div>
      </section>

      {/* Настройки */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-brand-text">Настройки</h2>
        <SettingsAccordion initialName={name} />
      </section>

      {/* Достижения */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h2 className="mb-4 text-lg font-semibold text-brand-text">
          Достижения
        </h2>
        <AchievementsGrid />
      </motion.section>
    </div>
  );
}
