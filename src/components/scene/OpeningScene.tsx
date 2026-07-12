"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EASE_NATURAL, DURATION } from "@/lib/motion";
import { TypedText } from "./TypedText";
import type { Chapter } from "@/lib/types";

interface OpeningSceneProps {
  chapter: Chapter;
}

export function OpeningScene({ chapter }: OpeningSceneProps) {
  const [dateDone, setDateDone] = useState(chapter.typedTextMode !== "full");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-8 text-center">
      {chapter.typedTextMode === "full" && (
        <div className="font-sans text-sm tracking-[0.3em] uppercase" style={{ color: chapter.palette.foregroundMuted }}>
          <TypedText key={chapter.slug} text={chapter.dateRange} onComplete={() => setDateDone(true)} />
        </div>
      )}

      {chapter.typedTextMode === "abbreviated" && (
        <motion.div
          className="font-sans text-sm tracking-[0.3em] uppercase"
          style={{ color: chapter.palette.foregroundMuted }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: DURATION.slow, ease: EASE_NATURAL }}
        >
          {chapter.dateRange}
        </motion.div>
      )}

      {chapter.location && dateDone && (
        <motion.div
          className="font-sans text-xs tracking-[0.2em] uppercase"
          style={{ color: chapter.palette.foregroundMuted }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.standard, ease: EASE_NATURAL }}
        >
          {chapter.location}
        </motion.div>
      )}

      <motion.h1
        className="font-editorial text-5xl md:text-7xl"
        style={{ color: chapter.palette.foreground }}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: dateDone ? 1 : 0, y: dateDone ? 0 : 16 }}
        transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL, delay: dateDone ? 0.3 : 0 }}
      >
        {chapter.title}
      </motion.h1>

      {chapter.openingSentence && (
        <motion.p
          className="max-w-xl font-editorial text-lg italic"
          style={{ color: chapter.palette.foregroundMuted }}
          initial={{ opacity: 0 }}
          animate={{ opacity: dateDone ? 1 : 0 }}
          transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL, delay: dateDone ? 0.9 : 0 }}
        >
          {chapter.openingSentence}
        </motion.p>
      )}
    </div>
  );
}
