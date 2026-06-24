"use client";

import { motion } from "framer-motion";

interface StepItemProps {
  number: number;
  title: string;
  description: string;
}

export default function StepItem({ number, title, description }: StepItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: (number - 1) * 0.15 }}
      className="relative flex flex-col items-center text-center"
    >
      <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-brand-yellow text-2xl font-bold text-brand-black shadow-yellow-glow">
        {number}
      </div>
      <h3 className="mt-5 text-lg font-bold text-brand-text">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-brand-muted">
        {description}
      </p>
    </motion.div>
  );
}
