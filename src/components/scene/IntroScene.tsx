"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { ExperienceConfig } from "@/lib/types";

export function IntroScene({ config, onComplete }: { config: ExperienceConfig; onComplete?: () => void }) {
  useEffect(() => {
    const lastLineDelay = Math.max(0, config.lines.length - 1) * 1400;
    const timer = window.setTimeout(() => onComplete?.(), lastLineDelay + DURATION.cinematic * 1000 + 350);
    return () => window.clearTimeout(timer);
  }, [config.lines.length, onComplete]);

  return (
    <div className="relative flex h-full min-h-0 w-full flex-col items-center justify-center gap-[clamp(0.18rem,0.9vh,0.85rem)] overflow-hidden bg-black px-[clamp(1rem,4vw,2rem)] py-[clamp(1.5rem,5vh,3rem)] text-center">
      <motion.div
        className="absolute inset-x-[12vw] top-[14vh] h-px bg-[#f4ede1]/10"
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 4.2, ease: EASE_NATURAL, delay: 0.4 }}
      />
      {config.lines.map((line, index) => (
        <motion.p
          key={line}
          className={`font-editorial leading-[1.02] text-[#f4ede1] ${
            line.length > 80
              ? "max-w-[min(88vw,64rem)] text-[clamp(1.25rem,3.85vh,3.65rem)]"
              : "max-w-[min(88vw,54rem)] text-[clamp(1.45rem,4.45vh,4.45rem)]"
          }`}
          initial={{ opacity: 0, y: 12, filter: "blur(4px)" }}
          animate={{ opacity: index < 2 ? 1 : 0.72, y: 0, filter: "blur(0px)" }}
          transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL, delay: index * 1.4 }}
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}
