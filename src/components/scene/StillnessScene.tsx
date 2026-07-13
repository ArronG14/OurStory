"use client";

import { motion } from "framer-motion";
import { EASE_NATURAL } from "@/lib/motion";
import type { ChapterPalette } from "@/lib/types";

const LINES = [
  "We moved into our first home.",
  "Started building our life together.",
];

export function StillnessScene({ palette }: { palette: ChapterPalette }) {
  return (
    <div className="relative flex h-full min-h-0 w-full flex-col items-center justify-center gap-[clamp(0.8rem,2.4vh,1.25rem)] overflow-hidden px-[clamp(1rem,4vw,2rem)] text-center">
      <motion.div
        className="absolute inset-[18%] border"
        style={{ borderColor: `${palette.foregroundMuted}16` }}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 4.2, ease: EASE_NATURAL }}
      />
      <motion.div
        className="absolute bottom-[20vh] left-[18vw] right-[18vw] h-px"
        style={{ background: `${palette.foregroundMuted}33` }}
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 4.8, ease: EASE_NATURAL, delay: 0.4 }}
      />
      <div className="relative z-10 flex max-w-[min(86vw,44rem)] flex-col gap-[clamp(0.8rem,2.4vh,1.25rem)]">
        {LINES.map((line, index) => (
          <motion.p
            key={index}
            className="font-editorial text-[clamp(1.45rem,4vh,2.65rem)] leading-tight"
            style={{ color: index === 0 ? palette.foreground : palette.foregroundMuted }}
            initial={{ opacity: 0, y: 0, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 3.8,
              ease: EASE_NATURAL,
              delay: 0.8 + index * 2.4,
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
