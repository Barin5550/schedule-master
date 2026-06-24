"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import Card from "@/components/ui/Card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
}

export default function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <Card hover className="h-full">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow/10">
          <Icon className="h-6 w-6 text-brand-yellow" />
        </div>
        <h3 className="mb-2 text-lg font-bold text-brand-text">{title}</h3>
        <p className="text-sm leading-relaxed text-brand-muted">{description}</p>
      </Card>
    </motion.div>
  );
}
