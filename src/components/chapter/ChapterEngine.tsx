"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { Chapter } from "@/lib/types";
import { OpeningScene } from "@/components/scene/OpeningScene";
import { PhotoCollage } from "@/components/collage/PhotoCollage";
import { ReflectionScene } from "@/components/scene/ReflectionScene";
import { HomeChapterEngine } from "@/components/chapter/HomeChapterEngine";

// ─── Engine interface ──────────────────────────────────────────────────

interface ChapterEngineProps {
  chapter: Chapter;
  onComplete: () => void;
  beat: number;
  advanceSignal: number;
  onBeatChange: (beat: number) => void;
  onSceneReady: () => void;
}

export function ChapterEngine(props: ChapterEngineProps) {
  const { chapter } = props;
  if (chapter.slug === "07-home") {
    return <HomeChapterEngine {...props} />;
  }
  return <StandardChapterEngine {...props} />;
}

// ─── Standard 3-beat engine ──────────────────────────────────────────────────

function sceneReadyDelayForBeat(chapter: Chapter, beat: number) {
  if (beat === 0) {
    const lineCount = chapter.openingSentence?.split("\n").filter((line) => line.trim() !== "").length ?? 0;
    const dateDelay = chapter.typedTextMode === "full" ? Math.max(1600, chapter.dateRange.length * 42) : 0;
    return dateDelay + 3600 + lineCount * 650;
  }

  if (beat === 1) return 2800;

  const lineCount = chapter.reflection?.split("\n").filter((line) => line.trim() !== "").length ?? 0;
  return 3000 + Math.max(0, lineCount - 1) * 950;
}

function StandardChapterEngine({
  chapter,
  beat,
  advanceSignal,
  onBeatChange,
  onComplete,
  onSceneReady,
}: ChapterEngineProps) {
  const [collageAdvanceSignal, setCollageAdvanceSignal] = useState(0);

  const advanceBeat = useCallback(() => {
    if (beat === 1 && chapter.media.length > 0) {
      setCollageAdvanceSignal((value) => value + 1);
      return;
    }

    if (beat < 2) onBeatChange(beat + 1);
    else onComplete();
  }, [beat, chapter.media.length, onBeatChange, onComplete]);

  useEffect(() => {
    if (advanceSignal === 0) return;
    const timer = window.setTimeout(advanceBeat, 0);
    return () => window.clearTimeout(timer);
  }, [advanceBeat, advanceSignal]);

  useEffect(() => {
    if (beat === 1 && chapter.media.length > 0) return undefined;
    const timer = window.setTimeout(onSceneReady, sceneReadyDelayForBeat(chapter, beat));
    return () => window.clearTimeout(timer);
  }, [beat, chapter, onSceneReady]);

  const collageKey = useMemo(() => `${chapter.slug}-${beat}`, [beat, chapter.slug]);

  return (
    <div className="relative h-full w-full" style={{ background: chapter.palette.background }}>
      <AnimatePresence mode="wait">
        {beat === 0 && (
          <motion.div key="opening" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DURATION.slow, ease: EASE_NATURAL }}>
            <OpeningScene chapter={chapter} />
          </motion.div>
        )}
        {beat === 1 && (
          <motion.div key="collage" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DURATION.slow, ease: EASE_NATURAL }}>
            {chapter.media.length > 0 ? (
              <PhotoCollage
                key={collageKey}
                media={chapter.media}
                chapter={chapter}
                advanceSignal={collageAdvanceSignal}
                onReady={onSceneReady}
                onComplete={() => onBeatChange(2)}
              />
            ) : (
              <EmptyBeat chapter={chapter} />
            )}
          </motion.div>
        )}
        {beat === 2 && (
          <motion.div key="reflection" className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: DURATION.slow, ease: EASE_NATURAL }}>
            <ReflectionScene chapter={chapter} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Shared utility ──────────────────────────────────────────────────────────

function EmptyBeat({ chapter }: { chapter: Chapter }) {
  const tone = {
    "02-growing-together": "The frame is waiting to fill up.",
    "03-us-against-the-world": "The room holds its breath.",
    "04-she-said-yes": "Hold here. Not yet.",
    "05-building-forever": "The road opens just beyond the frame.",
    "06-the-wedding": "Light gathers before the film begins.",
  }[chapter.slug] ?? "The memory is still finding its image.";

  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden px-8">
      <motion.div
        className="absolute inset-[12%] border"
        style={{ borderColor: `${chapter.palette.foregroundMuted}22` }}
        initial={{ opacity: 0, scale: chapter.slug === "03-us-against-the-world" ? 0.78 : 1.04 }}
        animate={{ opacity: 1, scale: chapter.slug === "03-us-against-the-world" ? 0.74 : 1 }}
        transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
      />
      <motion.p
        className="max-w-xl text-center font-editorial text-2xl italic md:text-3xl"
        style={{ color: chapter.palette.foregroundMuted }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL, delay: 0.45 }}
      >
        {tone}
      </motion.p>
    </div>
  );
}
