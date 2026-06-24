"use client";

import { motion } from "framer-motion";

/**
 * template.tsx пересоздаётся при каждой навигации (в отличие от layout),
 * поэтому подходит для плавных переходов между страницами.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
