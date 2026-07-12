"use client";

import { motion } from "framer-motion";
import { EASE_NATURAL } from "@/lib/motion";
import type { Chapter } from "@/lib/types";

interface TimelineProps {
  chapters: Chapter[];
  activeIndex: number;
  interactive: boolean;
  onSelect?: (index: number) => void;
}

export function Timeline({ chapters, activeIndex, interactive, onSelect }: TimelineProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-40 flex justify-center">
      <div className="flex items-center gap-3 px-6">
        {chapters.map((chapter, index) => {
          const lit = index <= activeIndex;
          return (
            <button
              key={chapter.slug}
              type="button"
              disabled={!interactive}
              onClick={(event) => {
                event.stopPropagation();
                onSelect?.(index);
              }}
              className={interactive ? "pointer-events-auto" : "pointer-events-none"}
              aria-label={chapter.title}
            >
              <motion.span
                className="block h-[3px] rounded-full"
                style={{ width: index === activeIndex ? 28 : 14, background: chapter.palette.accent }}
                animate={{ opacity: lit ? 0.9 : 0.18 }}
                transition={{ duration: 1.4, ease: EASE_NATURAL }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
