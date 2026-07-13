"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import { EASE_NATURAL } from "@/lib/motion";

interface LetterSceneProps {
  text: string;
  onComplete?: () => void;
}

export function LetterScene({ text, onComplete }: LetterSceneProps) {
  useEffect(() => {
    const timer = window.setTimeout(() => onComplete?.(), 4100);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="relative flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-black px-[clamp(1rem,4vw,2rem)] py-[clamp(1.25rem,5vh,3rem)]">
      <motion.div
        className="absolute inset-x-[10vw] top-[12vh] h-px bg-[#f4ede1]/10"
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 4.2, ease: EASE_NATURAL }}
      />
      <motion.div
        className="absolute inset-x-[10vw] bottom-[12vh] h-px bg-[#f4ede1]/10"
        initial={{ opacity: 0, scaleX: 0.2 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 4.2, ease: EASE_NATURAL, delay: 0.2 }}
      />
      <motion.div
        className="h-full max-h-[82dvh] max-w-[min(88vw,64rem)] overflow-y-auto whitespace-pre-line px-2 text-center font-hand text-[clamp(1.15rem,3.3vh,2.45rem)] leading-[1.5] text-[#f4ede1] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        initial={{ opacity: 0, y: 12, filter: "blur(5px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 3.2, ease: EASE_NATURAL, delay: 0.45 }}
      >
        {text}
      </motion.div>
    </div>
  );
}
