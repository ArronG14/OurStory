"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_NATURAL } from "@/lib/motion";

interface LandingTitleCardProps {
  onComplete: () => void;
}

export function LandingTitleCard({ onComplete }: LandingTitleCardProps) {
  const [departing, setDeparting] = useState(false);
  const completeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (completeTimer.current) clearTimeout(completeTimer.current);
    };
  }, []);

  const begin = () => {
    if (departing) return;
    setDeparting(true);
    completeTimer.current = setTimeout(onComplete, reduceMotion ? 650 : 4550);
  };

  return (
    <section
      className="landing-title-card relative flex h-full w-full items-center justify-center overflow-hidden bg-black px-6 text-center"
      aria-label="Opening title card"
    >
      <motion.div
        className="relative z-10 flex min-h-[min(42rem,78vh)] w-full max-w-4xl flex-col items-center justify-center"
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{
          opacity: departing ? 0 : 1,
          filter: departing ? "blur(10px)" : "blur(0px)",
        }}
        transition={{
          duration: reduceMotion ? 0.25 : departing ? 2.25 : 2.8,
          ease: EASE_NATURAL,
          delay: departing && !reduceMotion ? 0.7 : 0.15,
        }}
      >
        <div className="flex flex-col items-center">
          <h1 className="font-editorial text-[clamp(3.35rem,9vw,6rem)] font-medium leading-[0.94] tracking-[-0.025em] text-[#f8f1e6]">
            Arron &amp; Alise
          </h1>
          <p className="mt-[clamp(1rem,2.4vh,1.65rem)] font-editorial text-[clamp(1.15rem,2.1vw,1.75rem)] italic leading-none text-[#d7c7ad]">
            Our Story
          </p>
        </div>

        <div className="mt-[clamp(5.25rem,10vh,7.75rem)] flex flex-col items-center gap-[clamp(0.9rem,1.8vh,1.25rem)] font-editorial text-[clamp(1.25rem,2.5vw,2rem)] leading-tight text-[#eee4d3]">
          <p>11 Years Together</p>
          <p>2 Years Married</p>
        </div>

        <motion.button
          type="button"
          className="landing-begin-button mt-[clamp(5.25rem,10vh,7.5rem)]"
          onClick={begin}
          disabled={departing}
          aria-label="Begin the film"
          animate={{ opacity: departing ? 0 : 1 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.9, ease: EASE_NATURAL }}
        >
          Begin
        </motion.button>
      </motion.div>
    </section>
  );
}
