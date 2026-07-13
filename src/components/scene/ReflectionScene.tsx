"use client";

import { motion } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import { directionForChapter } from "@/lib/direction";
import type { Chapter } from "@/lib/types";

export function ReflectionScene({ chapter }: { chapter: Chapter }) {
  if (!chapter.reflection) return null;

  const lines = chapter.reflection.split("\n").filter((l) => l.trim() !== "");
  const direction = directionForChapter(chapter);
  const isConfined = direction.tone === "confined";
  const isProposal = direction.tone === "anticipation";
  const isWedding = direction.tone === "wedding";
  const isHome = direction.tone === "home";
  const hasManyLines = lines.length > 5;
  const textSize = isWedding
    ? hasManyLines
      ? "text-[clamp(1.45rem,4.1vh,3.35rem)]"
      : "text-[clamp(1.75rem,5vh,4.2rem)]"
    : isConfined
      ? "text-[clamp(1.25rem,3.5vh,2rem)]"
      : hasManyLines
        ? "text-[clamp(1.2rem,3.25vh,2.15rem)]"
        : "text-[clamp(1.45rem,4.2vh,2.65rem)]";

  return (
    <div
      className={`relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden px-[clamp(1rem,4vw,2rem)] py-[clamp(1rem,4vh,2.5rem)] ${
        isWedding ? "bg-[#f2c27a]" : ""
      }`}
      style={!isWedding ? { background: chapter.palette.background } : undefined}
    >
      {isProposal && (
        <motion.div
          className="absolute left-1/2 top-1/2 h-[1px] w-[44vw] -translate-x-1/2 bg-current"
          style={{ color: chapter.palette.accent }}
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 1, 1, 0], scaleX: [0, 1, 1, 0.15] }}
          transition={{ duration: 7.2, ease: EASE_NATURAL }}
        />
      )}

      {isConfined && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_30%,rgba(0,0,0,.76)_76%)]" />
      )}

      {isWedding && (
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,.48),rgba(255,255,255,0)_38%,rgba(61,26,10,.45))]" />
      )}

      {isHome && (
        <motion.div
          className="absolute bottom-[18vh] left-1/2 h-px w-[54vw] -translate-x-1/2 bg-current"
          style={{ color: `${chapter.palette.foregroundMuted}44` }}
          initial={{ opacity: 0, scaleX: 0.4 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 4.4, ease: EASE_NATURAL }}
        />
      )}

      <div
        className={`relative z-10 flex flex-col text-center ${
          isConfined
            ? "max-w-[min(86vw,38rem)] gap-[clamp(0.65rem,1.8vh,1.25rem)]"
            : isWedding
              ? "max-w-[min(88vw,56rem)] gap-[clamp(0.55rem,1.5vh,1rem)]"
              : "max-w-[min(86vw,44rem)] gap-[clamp(0.45rem,1.25vh,0.85rem)]"
        }`}
      >
        {lines.map((line, index) => (
          <motion.p
            key={index}
            className={`font-editorial leading-[1.18] ${textSize}`}
            style={{
              color: isWedding
                ? "#2a1208"
                : index === lines.length - 1 && isProposal
                  ? chapter.palette.accent
                  : chapter.palette.foreground,
            }}
            initial={{
              opacity: 0,
              y: isConfined || isHome ? 0 : 8,
              scale: isProposal && index === lines.length - 1 ? 0.92 : 1,
              filter: isConfined || isProposal ? "blur(5px)" : "blur(0px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            transition={{
              duration: isConfined ? 3.4 : isProposal && index === lines.length - 1 ? 3.8 : DURATION.cinematic,
              ease: EASE_NATURAL,
              delay: index * (isProposal ? 0.95 : isConfined ? 0.8 : 0.55),
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
