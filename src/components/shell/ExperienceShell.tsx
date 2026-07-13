"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { Chapter, CreditsConfig, ExperienceConfig, PostCreditConfig } from "@/lib/types";
import { LandingTitleCard } from "@/components/landing/LandingTitleCard";
import { IntroScene } from "@/components/scene/IntroScene";
import { ChapterEngine } from "@/components/chapter/ChapterEngine";
import { Timeline } from "@/components/timeline/Timeline";
import { LetterScene } from "@/components/letter/LetterScene";
import { CreditsScene } from "@/components/credits/CreditsScene";
import { PostCreditScene } from "@/components/postcredit/PostCreditScene";

type Phase = "landing" | "intro" | "chapters" | "letter" | "credits" | "postcredit" | "revisit";
type NavDirection = "previous" | "continue";

const SOUNDTRACK_SRC = "/assets/soundtrack/earned-it.mp3";
const SOUNDTRACK_VOLUME = 0.26;
const NAV_EXIT_DELAY_MS = 180;

function lastBeatForChapter(chapter: Chapter | undefined) {
  return chapter?.slug === "07-home" ? 5 : 2;
}

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
  const [phase, setPhase] = useState<Phase>("landing");
  const [chapterIndex, setChapterIndex] = useState(0);
  const [chapterBeat, setChapterBeat] = useState(0);
  const [revisitIndex, setRevisitIndex] = useState(0);
  const [revisitBeat, setRevisitBeat] = useState(1);
  const [sceneReady, setSceneReady] = useState(false);
  const [navExiting, setNavExiting] = useState(false);
  const [chapterAdvanceSignal, setChapterAdvanceSignal] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeTimerRef = useRef<number | null>(null);
  const navTimerRef = useRef<number | null>(null);
  const lastAdvanceAt = useRef(0);

  useEffect(() => {
    return () => {
      if (fadeTimerRef.current) window.clearInterval(fadeTimerRef.current);
      if (navTimerRef.current) window.clearTimeout(navTimerRef.current);
      audioRef.current?.pause();
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSceneReady(false);
      setNavExiting(false);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [phase, chapterIndex, chapterBeat, revisitIndex, revisitBeat]);

  const fadeInSoundtrack = useCallback(() => {
    if (audioRef.current) return;

    const audio = new Audio(SOUNDTRACK_SRC);
    audio.loop = false;
    audio.preload = "auto";
    audio.volume = 0;
    audioRef.current = audio;

    audio.play().catch(() => {
      if (fadeTimerRef.current) {
        window.clearInterval(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
      audioRef.current = null;
    });

    const fadeStartedAt = Date.now();
    const fadeDuration = 2800;
    fadeTimerRef.current = window.setInterval(() => {
      const progress = Math.min((Date.now() - fadeStartedAt) / fadeDuration, 1);
      audio.volume = progress * SOUNDTRACK_VOLUME;

      if (progress >= 1 && fadeTimerRef.current) {
        window.clearInterval(fadeTimerRef.current);
        fadeTimerRef.current = null;
      }
    }, 80);
  }, []);

  const beginExperience = useCallback(() => {
    fadeInSoundtrack();
    setPhase("intro");
  }, [fadeInSoundtrack]);

  const onChapterComplete = useCallback(() => {
    if (chapterIndex < chapters.length - 1) {
      setChapterIndex((value) => value + 1);
      setChapterBeat(0);
    } else {
      setPhase("letter");
    }
  }, [chapterIndex, chapters.length]);

  const advanceNow = useCallback(() => {
    const now = Date.now();
    if (now - lastAdvanceAt.current < 900) return;
    lastAdvanceAt.current = now;

    if (phase === "landing") return;

    if (phase === "intro") {
      setPhase("chapters");
      setChapterIndex(0);
      setChapterBeat(0);
      return;
    }

    if (phase === "chapters") {
      setChapterAdvanceSignal((value) => value + 1);
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

    if (phase === "postcredit") return;
  }, [phase]);

  const previousNow = useCallback(() => {
    const now = Date.now();
    if (now - lastAdvanceAt.current < 900) return;
    lastAdvanceAt.current = now;

    if (phase === "intro") {
      setPhase("landing");
      return;
    }

    if (phase === "chapters") {
      if (chapterBeat > 0) {
        setChapterBeat((value) => value - 1);
        return;
      }

      if (chapterIndex > 0) {
        const previousChapter = chapters[chapterIndex - 1];
        setChapterIndex((value) => value - 1);
        setChapterBeat(lastBeatForChapter(previousChapter));
        return;
      }

      setPhase("intro");
      return;
    }

    if (phase === "letter") {
      const finalChapter = chapters[chapters.length - 1];
      setPhase("chapters");
      setChapterIndex(Math.max(0, chapters.length - 1));
      setChapterBeat(lastBeatForChapter(finalChapter));
      return;
    }

    if (phase === "credits") {
      setPhase("letter");
    }
  }, [chapterBeat, chapterIndex, chapters, phase]);

  const navigate = useCallback((direction: NavDirection) => {
    if (!sceneReady || navExiting) return;
    setNavExiting(true);
    setSceneReady(false);
    if (navTimerRef.current) window.clearTimeout(navTimerRef.current);
    navTimerRef.current = window.setTimeout(() => {
      if (direction === "previous") previousNow();
      else advanceNow();
    }, NAV_EXIT_DELAY_MS);
  }, [advanceNow, navExiting, previousNow, sceneReady]);

  const activeChapter = chapters[chapterIndex];
  const revisitChapter = chapters[revisitIndex];
  const showNavigation = sceneReady && !navExiting && phase !== "landing" && phase !== "postcredit" && phase !== "revisit";
  const showPrevious = showNavigation;
  const continueLabel = phase === "credits" ? "Skip Credits \u2192" : "Continue \u2192";

  return (
    <div
      className="relative h-dvh w-dvw overflow-hidden bg-black"
      onKeyDown={(event) => {
        if (!showNavigation) return;
        if (event.key === "ArrowLeft") navigate("previous");
        if (event.key === " " || event.key === "Enter" || event.key === "ArrowRight") navigate("continue");
      }}
      role="presentation"
      tabIndex={0}
    >
      <AnimatePresence mode="wait">
        {phase === "landing" && (
          <motion.div key="landing" className="absolute inset-0" exit={{ opacity: 1 }}>
            <LandingTitleCard onComplete={beginExperience} />
          </motion.div>
        )}

        {phase === "intro" && (
          <motion.div
            key="intro"
            className="absolute inset-0"
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
          >
            <IntroScene config={experience} onComplete={() => setSceneReady(true)} />
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
            <ChapterEngine
              chapter={activeChapter}
              beat={chapterBeat}
              advanceSignal={chapterAdvanceSignal}
              onBeatChange={setChapterBeat}
              onComplete={onChapterComplete}
              onSceneReady={() => setSceneReady(true)}
            />
          </motion.div>
        )}

        {phase === "letter" && (
          <motion.div key="letter" className="absolute inset-0" exit={{ opacity: 0 }}>
            <LetterScene text={letterText} onComplete={() => setSceneReady(true)} />
          </motion.div>
        )}

        {phase === "credits" && (
          <motion.div key="credits" className="absolute inset-0" exit={{ opacity: 0 }}>
            <CreditsScene credits={credits} chapters={chapters} onReady={() => setSceneReady(true)} />
          </motion.div>
        )}

        {phase === "postcredit" && (
          <motion.div key="postcredit" className="absolute inset-0" exit={{ opacity: 0 }}>
            <PostCreditScene config={postCredit} onComplete={() => setPhase("revisit")} />
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
            <ChapterEngine
              chapter={revisitChapter}
              beat={revisitBeat}
              advanceSignal={0}
              onBeatChange={setRevisitBeat}
              onComplete={() => {}}
              onSceneReady={() => {}}
            />
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
            onSelect={(index) => {
              setRevisitIndex(index);
              setRevisitBeat(1);
            }}
          />
        </>
      )}

      <AnimatePresence>
        {showNavigation && (
          <motion.nav
            key={`${phase}-${chapterIndex}-${chapterBeat}-navigation`}
            className="film-navigation pointer-events-none absolute inset-x-0 bottom-[clamp(1rem,3.5vh,2rem)] z-50 flex items-end justify-between px-[clamp(1rem,3.6vw,2.4rem)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: navExiting ? 0 : 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE_NATURAL }}
            aria-label="Scene navigation"
          >
            {showPrevious ? (
              <button
                type="button"
                className="film-navigation__control pointer-events-auto"
                onClick={(event) => {
                  event.stopPropagation();
                  navigate("previous");
                }}
              >
                &larr; Previous
              </button>
            ) : (
              <span />
            )}
            <button
              type="button"
              className="film-navigation__control pointer-events-auto"
              onClick={(event) => {
                event.stopPropagation();
                navigate("continue");
              }}
            >
              {continueLabel}
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
