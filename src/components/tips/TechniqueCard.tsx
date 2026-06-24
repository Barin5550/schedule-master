"use client";

import { motion } from "framer-motion";
import { ArrowRight, type LucideIcon } from "lucide-react";
import Button from "@/components/ui/Button";

export interface Technique {
  id: string;
  name: string;
  description: string;
  detail: string;
  icon: LucideIcon;
}

export interface TechniqueCardProps {
  technique: Technique;
  onLearnMore: (technique: Technique) => void;
}

export default function TechniqueCard({
  technique,
  onLearnMore,
}: TechniqueCardProps) {
  const Icon = technique.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex w-64 shrink-0 snap-start flex-col rounded-xl border border-brand-border bg-brand-card p-5 transition-colors hover:border-brand-yellow"
    >
      <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-yellow/15 text-brand-yellow">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-base font-semibold text-brand-text">
        {technique.name}
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-brand-muted">
        {technique.description}
      </p>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onLearnMore(technique)}
        className="mt-4 self-start px-0 text-brand-yellow hover:bg-transparent hover:text-brand-yellow-hover"
      >
        Узнать больше
        <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
