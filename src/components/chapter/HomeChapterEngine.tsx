"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { Chapter } from "@/lib/types";
import { OpeningScene } from "@/components/scene/OpeningScene";
import { PhotoCollage } from "@/components/collage/PhotoCollage";
import { ReflectionScene } from "@/components/scene/ReflectionScene";
import { StillnessScene } from "@/components/scene/StillnessScene";
import { NylaIntroScene } from "@/components/scene/NylaIntroScene";
import { NylaSequence } from "@/components/scene/NylaSequence";

// Beat map:
// 0 - Opening
// 1 - Stillness (settling in)
// 2 - Nyla intro
// 3 - Nyla sequence (managed internally — HomeChapterEngine ignores clicks here)
// 4 - Home media collage
// 5 - Reflection
const TOTAL_BEATS = 6;

interface HomeChapterEngineProps {
  chapter: Chapter;
  beat: number;
  advanceSignal: number;
  onBeatChange: (beat: number) => void;
  onComplete: () => void;
  onSceneReady: () => void;
}

function sceneReadyDelayForBeat(beat: number) {
  if (beat === 1) return 6600;
  if (beat === 2) return 7200;
  if (beat === 3) return 3600;
  if (beat === 4) return 2800;
  if (beat === 5) return 4800;
  return 5600;
}

export function HomeChapterEngine({
  chapter,
  beat,
  advanceSignal,
  onBeatChange,
  onComplete,
  onSceneReady,
}: HomeChapterEngineProps) {
  const [collageAdvanceSignal, setCollageAdvanceSignal] = useState(0);
  const [nylaAdvanceSignal, setNylaAdvanceSignal] = useState(0);
  const advanceBeat = useCallback(() => {
    if (beat === 3) {
      setNylaAdvanceSignal((value) => value + 1);
      return;
    }

    if (beat === 4 && chapter.media.length > 0) {
      setCollageAdvanceSignal((value) => value + 1);
      return;
    }

    const next = beat + 1;
    if (next >= TOTAL_BEATS) onComplete();
    else onBeatChange(next);
  }, [beat, chapter.media.length, onBeatChange, onComplete]);

  const completeNylaSequence = useCallback(() => {
    onBeatChange(4);
  }, [onBeatChange]);

  useEffect(() => {
    if (advanceSignal === 0) return;
    const timer = window.setTimeout(advanceBeat, 0);
    return () => window.clearTimeout(timer);
  }, [advanceBeat, advanceSignal]);

  useEffect(() => {
    if ((beat === 3 && chapter.nylaMedia.length > 0) || (beat === 4 && chapter.media.length > 0)) {
      return undefined;
    }
    const timer = window.setTimeout(onSceneReady, sceneReadyDelayForBeat(beat));
    return () => window.clearTimeout(timer);
  }, [beat, chapter.media.length, chapter.nylaMedia.length, onSceneReady]);

  const hasHomeMedia = chapter.media.length > 0;

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
            key="stillness"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
          >
            <StillnessScene palette={chapter.palette} />
          </motion.div>
        )}

        {beat === 2 && (
          <motion.div
            key="nyla-intro"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
          >
            <NylaIntroScene palette={chapter.palette} />
          </motion.div>
        )}

        {beat === 3 && (
          <motion.div
            key="nyla-sequence"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE_NATURAL }}
          >
            <NylaSequence
              chapter={chapter}
              advanceSignal={nylaAdvanceSignal}
              onReady={onSceneReady}
              onComplete={completeNylaSequence}
            />
          </motion.div>
        )}

        {beat === 4 && (
          <motion.div
            key="home-collage"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.slow, ease: EASE_NATURAL }}
          >
            {hasHomeMedia ? (
              <PhotoCollage
                media={chapter.media}
                chapter={chapter}
                advanceSignal={collageAdvanceSignal}
                onReady={onSceneReady}
                onComplete={advanceBeat}
              />
            ) : (
              <EmptyState chapter={chapter} label="The house keeps collecting light." />
            )}
          </motion.div>
        )}

        {beat === 5 && (
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

function EmptyState({ chapter, label }: { chapter: Chapter; label: string }) {
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden px-8">
      <motion.div
        className="absolute bottom-[22vh] left-[14vw] right-[14vw] h-px"
        style={{ background: `${chapter.palette.foregroundMuted}33` }}
        initial={{ scaleX: 0.2, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
      />
      <motion.p
        className="font-editorial text-2xl italic md:text-3xl"
        style={{ color: chapter.palette.foregroundMuted }}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL, delay: 0.6 }}
      >
        {label}
      </motion.p>
    </div>
  );
}
