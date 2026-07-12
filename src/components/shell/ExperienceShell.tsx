"use client";

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { Chapter, CreditsConfig, ExperienceConfig, PostCreditConfig } from "@/lib/types";
import { IntroScene } from "@/components/scene/IntroScene";
import { ChapterEngine, CHAPTER_BEAT_COUNT } from "@/components/chapter/ChapterEngine";
import { Timeline } from "@/components/timeline/Timeline";
import { LetterScene } from "@/components/letter/LetterScene";
import { CreditsScene } from "@/components/credits/CreditsScene";
import { PostCreditScene } from "@/components/postcredit/PostCreditScene";

type Phase = "intro" | "chapters" | "letter" | "credits" | "postcredit" | "revisit";

interface ExperienceShellProps {
  experience: ExperienceConfig;
  chapters: Chapter[];
  letterText: string;
  credits: CreditsConfig;
  postCredit: PostCreditConfig;
}

export function ExperienceShell({
  experience,
  chapters,
  letterText,
  credits,
  postCredit,
}: ExperienceShellProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [beat, setBeat] = useState(0);
  const [revisitIndex, setRevisitIndex] = useState(0);
  const lastAdvanceAt = useRef(0);

  const advance = useCallback(() => {
    const now = Date.now();
    if (now - lastAdvanceAt.current < 900) return;
    lastAdvanceAt.current = now;

    if (phase === "intro") {
      setPhase("chapters");
      return;
    }

    if (phase === "chapters") {
      if (beat < CHAPTER_BEAT_COUNT - 1) {
        setBeat((value) => value + 1);
        return;
      }
      if (chapterIndex < chapters.length - 1) {
        setChapterIndex((value) => value + 1);
        setBeat(0);
        return;
      }
      setPhase("letter");
      return;
    }

    if (phase === "letter") {
      setPhase("credits");
      return;
    }

    if (phase === "credits") {
      setPhase("postcredit");
      return;
    }

    if (phase === "postcredit") {
      setPhase("revisit");
    }
  }, [phase, beat, chapterIndex, chapters.length]);

  const activeChapter = chapters[chapterIndex];
  const revisitChapter = chapters[revisitIndex];

  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-black"
      onClick={phase === "revisit" ? undefined : advance}
      onKeyDown={(event) => {
        if (event.key === " " || event.key === "Enter") advance();
      }}
      role="presentation"
      tabIndex={0}
    >
      <AnimatePresence mode="wait">
        {phase === "intro" && (
          <motion.div
            key="intro"
            className="absolute inset-0"
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
          >
            <IntroScene config={experience} />
          </motion.div>
        )}

        {phase === "chapters" && activeChapter && (
          <motion.div
            key={activeChapter.slug}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
          >
            <ChapterEngine chapter={activeChapter} beat={beat} />
          </motion.div>
        )}

        {phase === "letter" && (
          <motion.div key="letter" className="absolute inset-0" exit={{ opacity: 0 }}>
            <LetterScene text={letterText} onComplete={advance} />
          </motion.div>
        )}

        {phase === "credits" && (
          <motion.div key="credits" className="absolute inset-0" exit={{ opacity: 0 }}>
            <CreditsScene credits={credits} onComplete={advance} />
          </motion.div>
        )}

        {phase === "postcredit" && (
          <motion.div key="postcredit" className="absolute inset-0" exit={{ opacity: 0 }}>
            <PostCreditScene config={postCredit} />
          </motion.div>
        )}

        {phase === "revisit" && revisitChapter && (
          <motion.div
            key={`revisit-${revisitChapter.slug}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
          >
            <ChapterEngine chapter={revisitChapter} beat={1} />
          </motion.div>
        )}
      </AnimatePresence>

      {phase === "chapters" && (
        <Timeline chapters={chapters} activeIndex={chapterIndex} interactive={false} />
      )}

      {phase === "revisit" && (
        <>
          <div className="absolute top-8 left-1/2 -translate-x-1/2 font-sans text-xs tracking-[0.3em] uppercase text-[#8a8478]">
            Revisit Memories
          </div>
          <Timeline
            chapters={chapters}
            activeIndex={revisitIndex}
            interactive
            onSelect={setRevisitIndex}
          />
        </>
      )}
    </div>
  );
}
