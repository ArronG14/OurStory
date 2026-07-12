"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { Chapter } from "@/lib/types";
import { OpeningScene } from "@/components/scene/OpeningScene";
import { PhotoCollage } from "@/components/collage/PhotoCollage";
import { ReflectionScene } from "@/components/scene/ReflectionScene";

export const CHAPTER_BEAT_COUNT = 3;

interface ChapterEngineProps {
  chapter: Chapter;
  beat: number;
}

export function ChapterEngine({ chapter, beat }: ChapterEngineProps) {
  return (
    <div
      className="relative h-full w-full"
      style={{ background: chapter.palette.background }}
    >
      <AnimatePresence mode="wait">
        {beat === 0 && (
          <motion.div
            key="opening"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE_NATURAL }}
          >
            <OpeningScene chapter={chapter} />
          </motion.div>
        )}

        {beat === 1 && (
          <motion.div
            key="collage"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE_NATURAL }}
          >
            {chapter.media.length > 0 ? (
              <PhotoCollage media={chapter.media} />
            ) : (
              <div
                className="flex h-full items-center justify-center font-editorial text-2xl italic"
                style={{ color: chapter.palette.foregroundMuted }}
              >
                Memories from this chapter are still being gathered.
              </div>
            )}
          </motion.div>
        )}

        {beat === 2 && (
          <motion.div
            key="reflection"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE_NATURAL }}
          >
            <ReflectionScene chapter={chapter} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
