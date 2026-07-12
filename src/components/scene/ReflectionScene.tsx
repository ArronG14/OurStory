"use client";

import { motion } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { Chapter } from "@/lib/types";

export function ReflectionScene({ chapter }: { chapter: Chapter }) {
  if (!chapter.reflection) return null;

  return (
    <div className="flex h-full w-full items-center justify-center px-8">
      <motion.p
        className="max-w-2xl text-center font-editorial text-3xl md:text-4xl leading-relaxed"
        style={{ color: chapter.palette.foreground }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
      >
        {chapter.reflection}
      </motion.p>
    </div>
  );
}
