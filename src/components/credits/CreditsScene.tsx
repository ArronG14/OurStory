"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { CreditsConfig } from "@/lib/types";

interface CreditsSceneProps {
  credits: CreditsConfig;
  onComplete: () => void;
}

function CreditLine({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.div
      className="flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: DURATION.slow, ease: EASE_NATURAL, delay }}
    >
      <span className="font-sans text-xs tracking-[0.3em] uppercase text-[#8a8478]">{label}</span>
      <span className="font-editorial text-2xl text-[#f4ede1]">{value}</span>
    </motion.div>
  );
}

export function CreditsScene({ credits, onComplete }: CreditsSceneProps) {
  useEffect(() => {
    const timeout = setTimeout(onComplete, 16000);
    return () => clearTimeout(timeout);
  }, [onComplete]);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-10 bg-black py-12">
      <CreditLine label="Produced By" value={credits.producedBy.join(", ")} delay={0.2} />
      <CreditLine label="Starring" value={credits.starring.join(" & ")} delay={1.6} />
      {credits.specialGuest && <CreditLine label="Special Guest" value={credits.specialGuest} delay={3.0} />}
      <CreditLine label="Filmed On Location" value={credits.filmedOnLocation.join(" · ")} delay={4.4} />
      <CreditLine label="Continuity" value={credits.continuity} delay={5.8} />
      <CreditLine label="Running Time" value={credits.runningTime} delay={7.2} />
    </div>
  );
}
