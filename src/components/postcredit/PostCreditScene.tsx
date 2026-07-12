"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { PostCreditConfig } from "@/lib/types";

interface PostCreditSceneProps {
  config: PostCreditConfig;
}

type Beat = "black" | "return" | "tease" | "ticket";

export function PostCreditScene({ config }: PostCreditSceneProps) {
  const [beat, setBeat] = useState<Beat>("black");

  useEffect(() => {
    const timers = [
      setTimeout(() => setBeat("return"), 2200),
      setTimeout(() => setBeat("tease"), 6000),
      setTimeout(() => setBeat("ticket"), 10000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex h-full w-full items-center justify-center bg-black px-8">
      <AnimatePresence mode="wait">
        {beat === "return" && (
          <motion.p
            key="return"
            className="font-editorial text-3xl text-[#f4ede1]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
          >
            {config.returnLine}
          </motion.p>
        )}

        {beat === "tease" && (
          <motion.p
            key="tease"
            className="font-editorial text-2xl italic text-[#cba15c]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
          >
            {config.teaseLine}
          </motion.p>
        )}

        {beat === "ticket" && (
          <motion.div
            key="ticket"
            className="flex flex-col items-center gap-3 rounded-sm border border-[#cba15c]/40 px-12 py-10 text-center"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
          >
            <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#8a8478]">
              {config.ticket.artist}
            </span>
            <span className="font-editorial text-3xl text-[#f4ede1]">{config.ticket.tour}</span>
            <span className="font-sans text-sm text-[#cba15c]">
              {config.ticket.date} · {config.ticket.venue}
            </span>
            <span className="font-sans text-xs tracking-[0.2em] text-[#8a8478]">
              Section {config.ticket.section} · Row {config.ticket.row}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
