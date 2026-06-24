"use client";

import { motion } from "framer-motion";
import Card from "@/components/ui/Card";

interface MockBlock {
  title: string;
  time: string;
  bar: string;
}

const blocks: MockBlock[] = [
  { title: "Утренняя зарядка", time: "07:00 – 07:30", bar: "bg-brand-yellow" },
  { title: "Глубокая работа", time: "09:00 – 11:00", bar: "bg-blue-500" },
  { title: "Прогулка и обед", time: "13:00 – 14:00", bar: "bg-green-500" },
  { title: "Чтение книги", time: "18:00 – 18:45", bar: "bg-purple-500" },
  { title: "Планы на завтра", time: "21:00 – 21:15", bar: "bg-brand-yellow" },
];

export default function HeroMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Card className="shadow-yellow-glow">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-brand-muted">Сегодня</p>
              <p className="text-lg font-bold text-brand-text">Расписание дня</p>
            </div>
            <span className="rounded-lg bg-brand-yellow/10 px-3 py-1 text-xs font-semibold text-brand-yellow">
              5 задач
            </span>
          </div>

          <div className="space-y-3">
            {blocks.map((block, i) => (
              <motion.div
                key={block.title}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                className="flex items-center gap-3 rounded-lg border border-brand-border bg-brand-black/40 p-3"
              >
                <span className={`h-10 w-1.5 rounded-full ${block.bar}`} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-brand-text">
                    {block.title}
                  </p>
                  <p className="text-xs text-brand-muted">{block.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
