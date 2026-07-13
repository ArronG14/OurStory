"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { EASE_NATURAL, DURATION } from "@/lib/motion";
import { actLabel, directionForChapter } from "@/lib/direction";
import { TypedText } from "./TypedText";
import type { Chapter } from "@/lib/types";

interface OpeningSceneProps {
  chapter: Chapter;
}

export function OpeningScene({ chapter }: OpeningSceneProps) {
  const [dateDone, setDateDone] = useState(chapter.typedTextMode !== "full");
  const direction = directionForChapter(chapter);
  const isWedding = direction.tone === "wedding";
  const isConfined = direction.tone === "confined";
  const isYoung = direction.tone === "young";
  const isProposal = direction.tone === "anticipation";
  const titleSize = isWedding
    ? "text-[clamp(3rem,12vw,6rem)]"
    : isConfined
      ? "text-[clamp(2.6rem,8.5vw,4.9rem)]"
      : "text-[clamp(2.8rem,9.5vw,5.8rem)]";
  const bodySize = isWedding
    ? "text-[clamp(1.15rem,3.2vw,1.9rem)]"
    : isConfined
      ? "text-[clamp(1rem,2.7vw,1.45rem)]"
      : "text-[clamp(1.05rem,2.8vw,1.55rem)]";

  return (
    <div
      className={`relative flex h-full min-h-0 w-full flex-col overflow-hidden px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4vh,2.5rem)] text-center ${
        isWedding ? "items-start justify-end pb-[12vh] md:pl-[10vw]" : "items-center justify-center"
      } ${isConfined ? "justify-center" : ""}`}
      style={{
        background:
          direction.tone === "wedding"
            ? "linear-gradient(180deg, #f6d79a 0%, #d9824a 46%, #24100a 100%)"
            : direction.tone === "home"
              ? "radial-gradient(circle at 50% 70%, #30231a 0%, #171310 52%, #0d0b0a 100%)"
              : chapter.palette.background,
      }}
    >
      <OpeningAtmosphere chapter={chapter} />

      <motion.div
        className={`relative z-10 flex flex-col ${
          isWedding ? "items-start text-left" : "items-center text-center"
        } ${isConfined ? "max-w-[min(82vw,680px)] scale-90 border px-[clamp(1rem,4vw,3.5rem)] py-[clamp(1.5rem,5vh,3rem)]" : "gap-[clamp(0.8rem,2.4vh,1.75rem)]"}`}
        style={isConfined ? { borderColor: `${chapter.palette.foregroundMuted}24` } : undefined}
        initial={{ opacity: 0, scale: isProposal ? 0.98 : 1 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE_NATURAL }}
      >
      {chapter.typedTextMode === "full" && (
        <div
          className="font-sans text-sm uppercase"
          style={{
            color: isWedding ? "#3b1c0d" : chapter.palette.foregroundMuted,
            letterSpacing: isYoung ? "0.18em" : "0.3em",
          }}
        >
          <TypedText key={chapter.slug} text={chapter.dateRange} onComplete={() => setDateDone(true)} />
        </div>
      )}

      {chapter.typedTextMode === "abbreviated" && (
        <motion.div
          className="font-sans text-sm uppercase"
          style={{
            color: direction.tone === "hopeful" ? chapter.palette.accent : chapter.palette.foregroundMuted,
            letterSpacing: direction.tone === "home" ? "0.16em" : "0.3em",
          }}
          initial={{ opacity: 0, y: direction.tone === "home" ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: direction.tone === "home" ? DURATION.cinematic : DURATION.slow, ease: EASE_NATURAL }}
        >
          {chapter.dateRange}
        </motion.div>
      )}

      {chapter.location && dateDone && (
        <motion.div
          className="font-sans text-xs tracking-[0.2em] uppercase"
          style={{ color: isWedding ? "#4b220f" : chapter.palette.foregroundMuted }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.standard, ease: EASE_NATURAL }}
        >
          {chapter.location}
        </motion.div>
      )}

      <motion.h1
        className={`max-w-[min(90vw,72rem)] font-editorial leading-[0.95] ${titleSize}`}
        style={{
          color: isWedding ? "#fff8e8" : chapter.palette.foreground,
          letterSpacing: isYoung ? "-0.01em" : "0",
          transformOrigin: isProposal ? "50% 58%" : undefined,
        }}
        initial={{
          opacity: 0,
          y: isWedding ? 32 : isProposal ? 0 : 16,
          scale: isProposal ? 0.92 : 1,
          filter: isProposal ? "blur(4px)" : "blur(0px)",
        }}
        animate={{
          opacity: dateDone ? 1 : 0,
          y: dateDone ? 0 : isWedding ? 32 : 16,
          scale: dateDone ? 1 : isProposal ? 0.92 : 1,
          filter: dateDone ? "blur(0px)" : isProposal ? "blur(4px)" : "blur(0px)",
        }}
        transition={{ duration: isProposal ? 3.2 : DURATION.cinematic, ease: EASE_NATURAL, delay: dateDone ? 0.3 : 0 }}
      >
        {chapter.title}
      </motion.h1>

      {chapter.openingSentence && dateDone &&
        chapter.openingSentence.split("\n").filter((l) => l.trim() !== "").map((line, index) => (
          <motion.p
            key={index}
            className={`max-w-[min(86vw,38rem)] font-editorial italic leading-tight ${bodySize}`}
            style={{ color: isWedding ? "#ffe6b8" : chapter.palette.foregroundMuted }}
            initial={{ opacity: 0, y: direction.pace === "slow" ? 0 : 6, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: direction.pace === "slow" ? 3.4 : DURATION.cinematic,
              ease: EASE_NATURAL,
              delay: (isProposal ? 1.5 : 0.9) + index * (direction.pace === "slow" ? 0.9 : 0.5),
            }}
          >
            {line}
          </motion.p>
        ))
      }
      </motion.div>

      <motion.div
        className={`pointer-events-none absolute z-10 font-sans text-[10px] uppercase ${
          isWedding ? "right-8 top-8 text-[#4b220f]" : "bottom-10 right-8"
        }`}
        style={{
          color: isWedding ? "#4b220f" : `${chapter.palette.foregroundMuted}88`,
          letterSpacing: direction.tone === "young" ? "0.12em" : "0.24em",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: direction.tone === "home" ? 0.28 : 0.55 }}
        transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL, delay: 1.2 }}
      >
        {actLabel[direction.tone]}
      </motion.div>
    </div>
  );
}

function OpeningAtmosphere({ chapter }: { chapter: Chapter }) {
  const direction = directionForChapter(chapter);

  if (direction.tone === "young") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className="absolute rounded-[14px] border border-white/10 bg-white/[0.025]"
            style={{
              width: index % 2 === 0 ? "min(38vw, 310px)" : "min(28vw, 230px)",
              height: index % 2 === 0 ? "min(58vh, 390px)" : "min(36vh, 250px)",
              left: `${8 + index * 21}%`,
              top: `${12 + (index % 2) * 38}%`,
              transform: `rotate(${[-8, 5, -3, 7][index]}deg)`,
            }}
            initial={{ opacity: 0, y: 36, rotate: [-13, 10, -8, 14][index] }}
            animate={{ opacity: 1, y: 0, rotate: [-8, 5, -3, 7][index] }}
            transition={{ duration: 2.4, ease: EASE_NATURAL, delay: 0.35 + index * 0.16 }}
          />
        ))}
        <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:100%_7px]" />
      </div>
    );
  }

  if (direction.tone === "confined") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-1/2 h-[54vh] w-[54vw] -translate-x-1/2 -translate-y-1/2 border"
          style={{ borderColor: `${chapter.palette.foregroundMuted}18` }}
          initial={{ opacity: 0, scale: 1.12 }}
          animate={{ opacity: 1, scale: 0.92 }}
          transition={{ duration: 4.2, ease: EASE_NATURAL }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_34%,rgba(0,0,0,.72)_78%)]" />
      </div>
    );
  }

  if (direction.tone === "anticipation") {
    return (
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-1/2 h-px w-[0vw] -translate-x-1/2 bg-current"
          style={{ color: chapter.palette.accent }}
          animate={{ width: ["0vw", "24vw", "16vw"] }}
          transition={{ duration: 4.8, ease: EASE_NATURAL }}
        />
      </div>
    );
  }

  if (direction.tone === "hopeful") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute h-px origin-left bg-current"
            style={{
              color: `${chapter.palette.accent}${index === 0 ? "cc" : "55"}`,
              left: `${12 + index * 8}%`,
              right: `${8 + index * 14}%`,
              top: `${36 + index * 16}%`,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 2.2 + index * 0.5, ease: EASE_NATURAL, delay: 0.4 + index * 0.2 }}
          />
        ))}
      </div>
    );
  }

  if (direction.tone === "wedding") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -right-[10vw] -top-[18vh] h-[72vh] w-[72vh] rounded-full bg-[#ffe6a8]/45 blur-3xl"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 3.4, ease: EASE_NATURAL }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(48,21,10,.32),transparent_58%)]" />
      </div>
    );
  }

  return null;
}
