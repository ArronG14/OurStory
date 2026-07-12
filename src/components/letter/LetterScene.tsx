"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";

interface LetterSceneProps {
  text: string;
  onComplete: () => void;
}

export function LetterScene({ text, onComplete }: LetterSceneProps) {
  useEffect(() => {
    const readingDuration = Math.max(9000, text.length * 55);
    const timeout = setTimeout(onComplete, readingDuration);
    return () => clearTimeout(timeout);
  }, [text, onComplete]);

  return (
    <div className="flex h-full w-full items-center justify-center bg-black px-10">
      <motion.div
        className="max-w-2xl whitespace-pre-line text-center font-hand text-3xl md:text-4xl leading-relaxed text-[#f4ede1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
      >
        {text}
      </motion.div>
    </div>
  );
}
