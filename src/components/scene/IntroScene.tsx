"use client";

import { motion } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { ExperienceConfig } from "@/lib/types";

export function IntroScene({ config }: { config: ExperienceConfig }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-black px-8 text-center">
      {config.lines.map((line, index) => (
        <motion.p
          key={line}
          className="font-editorial text-4xl md:text-5xl text-[#f4ede1]"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL, delay: index * 1.4 }}
        >
          {line}
        </motion.p>
      ))}
    </div>
  );
}
