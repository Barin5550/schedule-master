"use client";

import {
  Award,
  CalendarCheck,
  Flame,
  Footprints,
  Sparkles,
  Target,
} from "lucide-react";
import AchievementBadge from "@/components/profile/AchievementBadge";

interface Achievement {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  unlocked: boolean;
}

const achievements: Achievement[] = [
  {
    id: "first-step",
    icon: <Footprints className="h-7 w-7" />,
    title: "Первый шаг",
    description: "Создана первая задача",
    unlocked: true,
  },
  {
    id: "week",
    icon: <CalendarCheck className="h-7 w-7" />,
    title: "Неделя дисциплины",
    description: "7 дней подряд",
    unlocked: true,
  },
  {
    id: "month",
    icon: <Flame className="h-7 w-7" />,
    title: "Месяц силы",
    description: "30 дней подряд",
    unlocked: false,
  },
  {
    id: "perfect",
    icon: <Target className="h-7 w-7" />,
    title: "Перфекционист",
    description: "100% задач за день",
    unlocked: true,
  },
  {
    id: "centurion",
    icon: <Award className="h-7 w-7" />,
    title: "Центурион",
    description: "100 выполненных задач",
    unlocked: true,
  },
  {
    id: "legend",
    icon: <Sparkles className="h-7 w-7" />,
    title: "Легенда",
    description: "100 дней подряд",
    unlocked: false,
  },
];

export default function AchievementsGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {achievements.map((a, i) => (
        <AchievementBadge
          key={a.id}
          icon={a.icon}
          title={a.title}
          description={a.description}
          unlocked={a.unlocked}
          delay={i * 0.05}
        />
      ))}
    </div>
  );
}
