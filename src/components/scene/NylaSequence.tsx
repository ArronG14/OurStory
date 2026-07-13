"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { Chapter } from "@/lib/types";
import { PhotoCollage } from "@/components/collage/PhotoCollage";

const FINAL_LINE = "Our little family was finally complete.";

export function NylaSequence({
  chapter,
  advanceSignal = 0,
  onReady,
  onComplete,
}: {
  chapter: Chapter;
  advanceSignal?: number;
  onReady?: () => void;
  onComplete: () => void;
}) {
  const [collageAdvanceSignal, setCollageAdvanceSignal] = useState(0);
  const [finalLineVisible, setFinalLineVisible] = useState(false);
  const [finalLineReady, setFinalLineReady] = useState(false);
  const lastAdvanceSignal = useRef(advanceSignal);

  const advance = useCallback(() => {
    if (!finalLineVisible) {
      setCollageAdvanceSignal((value) => value + 1);
      return;
    }

    if (finalLineReady) onComplete();
  }, [finalLineReady, finalLineVisible, onComplete]);

  useEffect(() => {
    if (advanceSignal === lastAdvanceSignal.current) return;
    lastAdvanceSignal.current = advanceSignal;
    const timer = window.setTimeout(advance, 0);
    return () => window.clearTimeout(timer);
  }, [advance, advanceSignal]);

  useEffect(() => {
    if (!finalLineVisible) return;
    const timer = window.setTimeout(() => {
      setFinalLineReady(true);
      onReady?.();
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [finalLineVisible, onReady]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: finalLineVisible ? 0.28 : 1 }}
        transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
      >
        <PhotoCollage
          media={chapter.nylaMedia}
          chapter={chapter}
          labelSlug="08-nyla"
          titleOverride="Nyla"
          dateRangeOverride="The Little Things"
          mood="nyla"
          advanceSignal={collageAdvanceSignal}
          onReady={onReady}
          onComplete={() => setFinalLineVisible(true)}
        />
      </motion.div>

      {finalLineVisible && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center px-[clamp(1rem,4vw,2rem)] text-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
        >
          <p
            className="max-w-[min(86vw,42rem)] font-editorial text-[clamp(1.45rem,4.5vh,3.2rem)] leading-tight"
            style={{ color: chapter.palette.foreground }}
          >
            {FINAL_LINE}
          </p>
        </motion.div>
      )}
    </div>
  );
}
