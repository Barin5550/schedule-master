"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Flame, ListTodo, TrendingUp } from "lucide-react";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAuth } from "@/hooks/useAuth";
import { useCountUp } from "@/hooks/useCountUp";
import {
  formatRuDate,
  getGreeting,
  getMockTodayTasks,
  mockWeekProgress,
} from "@/lib/mock";
import type { Task } from "@/types";
import StatCard from "@/components/dashboard/StatCard";
import Sparkline from "@/components/dashboard/Sparkline";
import TodayTimeline from "@/components/dashboard/TodayTimeline";
import TipOfDayCard from "@/components/dashboard/TipOfDayCard";
import WeekProgressCard from "@/components/dashboard/WeekProgressCard";
import HabitsCard from "@/components/dashboard/HabitsCard";
import AddTaskModal from "@/components/dashboard/AddTaskModal";

const STREAK = 21;

export default function DashboardPage() {
  const { user } = useAuth();
  const name =
    (user?.user_metadata?.first_name as string | undefined) ?? "Чемпион";

  const [tasks, setTasks] = useState<Task[]>(() => getMockTodayTasks());
  const [modalOpen, setModalOpen] = useState(false);

  const total = tasks.length;
  const completed = tasks.filter((t) => t.isCompleted).length;
  const completionPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const weekAvg = Math.round(
    mockWeekProgress.reduce((a, b) => a + b, 0) / mockWeekProgress.length,
  );

  // Анимированные счётчики.
  const totalCount = Math.round(useCountUp(total));
  const completedCount = Math.round(useCountUp(completed));
  const streakCount = Math.round(useCountUp(STREAK));
  const weekAvgCount = Math.round(useCountUp(weekAvg));

  const greeting = useMemo(() => getGreeting(), []);
  const dateLabel = useMemo(() => formatRuDate(), []);

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );
  }

  function addTask(task: Task) {
    setTasks((prev) => [task, ...prev]);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Приветствие */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-text sm:text-3xl">
            {greeting}, {name}
          </h1>
          <p className="mt-1 capitalize text-brand-muted">{dateLabel}</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Добавить задачу
        </Button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          index={0}
          label="Задач на сегодня"
          value={totalCount}
          icon={<ListTodo className="h-5 w-5" />}
          footer={
            <div className="flex flex-col gap-1.5">
              <ProgressBar value={completionPct} />
              <span className="text-xs text-brand-muted">
                {completed} из {total} выполнено
              </span>
            </div>
          }
        />
        <StatCard
          index={1}
          label="Выполнено"
          value={
            <span className="flex items-center gap-2">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              {completedCount}
            </span>
          }
          icon={<CheckCircle2 className="h-5 w-5" />}
          footer={<span className="text-xs text-brand-muted">из {total}</span>}
        />
        <StatCard
          index={2}
          label="Серия дней"
          value={streakCount}
          icon={<Flame className="h-5 w-5" />}
          footer={
            <span className="text-xs text-brand-muted">дней подряд</span>
          }
        />
        <StatCard
          index={3}
          label="Продуктивность недели"
          value={`${weekAvgCount}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          footer={<Sparkline data={mockWeekProgress} className="w-full" />}
        />
      </div>

      {/* Две колонки */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <TodayTimeline tasks={tasks} onToggle={toggleTask} />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <TipOfDayCard />
          <WeekProgressCard />
          <HabitsCard />
        </div>
      </div>

      <AddTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={addTask}
      />
    </div>
  );
}
