"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Card from "@/components/ui/Card";

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  initials: string;
  index: number;
}

export default function TestimonialCard({
  name,
  role,
  quote,
  initials,
  index,
}: TestimonialCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.12 }}
    >
      <Card className="flex h-full flex-col">
        <div className="mb-4 flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-brand-yellow text-brand-yellow"
            />
          ))}
        </div>
        <p className="flex-1 text-sm leading-relaxed text-brand-text">
          «{quote}»
        </p>
        <div className="mt-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-sm font-bold text-brand-black">
            {initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-brand-text">{name}</p>
            <p className="text-xs text-brand-muted">{role}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
