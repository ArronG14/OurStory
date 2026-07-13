"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { PostCreditConfig } from "@/lib/types";

interface PostCreditSceneProps {
  config: PostCreditConfig;
  onComplete: () => void;
}

type Beat = "black" | "return" | "tease" | "date" | "tickets" | "button";

const BEAT_TIMES: Array<[Beat, number]> = [
  ["return", 1200],
  ["black", 7200],
  ["tease", 9000],
  ["black", 15200],
  ["date", 17400],
  ["black", 22400],
  ["tickets", 24600],
  ["button", 33800],
];

function FadeCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={`absolute inset-0 flex items-center justify-center px-[clamp(1rem,4vw,2rem)] text-center ${className}`}
      initial={{ opacity: 0, filter: "blur(5px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, filter: "blur(5px)" }}
      transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
    >
      {children}
    </motion.div>
  );
}

function Ticket({ config, holder, delay }: { config: PostCreditConfig; holder: string; delay: number }) {
  return (
    <motion.div
      className="relative flex aspect-[1.9/1] w-[min(88vw,520px)] min-w-0 flex-col justify-between overflow-hidden border border-[#d8b56f]/50 bg-[#17120d] px-[clamp(1rem,4vw,2rem)] py-[clamp(0.9rem,3vw,1.75rem)] text-left shadow-2xl lg:w-[min(42vw,520px)]"
      initial={{ opacity: 0, y: 24, rotateX: 8, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)" }}
      transition={{ duration: 2.2, ease: EASE_NATURAL, delay }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(216,181,111,.18),transparent_38%),linear-gradient(135deg,rgba(255,255,255,.08),transparent_38%,rgba(216,181,111,.08))]" />
      <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,rgba(255,255,255,.28)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#d8b56f]/60" />
      <div className="relative flex items-start justify-between gap-6">
        <div>
          <p className="font-sans text-[clamp(0.48rem,1.4vw,0.625rem)] uppercase tracking-[0.24em] text-[#9f8a63]">
            Collector Ticket
          </p>
          <h2 className="mt-2 font-editorial text-[clamp(2rem,9vw,3rem)] leading-none text-[#f7ecd7]">
            {config.ticket.artist}
          </h2>
        </div>
        <div className="text-right font-sans text-[clamp(0.48rem,1.35vw,0.625rem)] uppercase tracking-[0.18em] text-[#d8b56f]">
          Section {config.ticket.section}
          <br />
          ROW 1
        </div>
      </div>

      <div className="relative grid grid-cols-[1fr_auto] items-end gap-6">
        <div>
          <p className="font-editorial text-[clamp(1rem,4vw,1.5rem)] leading-tight text-[#d8b56f]">{config.ticket.tour}</p>
          <p className="mt-2 font-sans text-[clamp(0.55rem,1.7vw,0.75rem)] uppercase tracking-[0.16em] text-[#b7a17b]">
            Friday 14th August 2026
          </p>
          <p className="mt-1 font-sans text-[clamp(0.55rem,1.7vw,0.75rem)] uppercase tracking-[0.16em] text-[#b7a17b]">
            {config.ticket.venue}
          </p>
          <p className="mt-3 font-sans text-[clamp(0.5rem,1.45vw,0.625rem)] uppercase tracking-[0.18em] text-[#9f8a63]">
            Ticket Holder:
            <span className="ml-2 text-[#f7ecd7]">{holder}</span>
          </p>
        </div>
        <div className="h-16 w-px bg-[#d8b56f]/35" />
      </div>
    </motion.div>
  );
}

export function PostCreditScene({ config, onComplete }: PostCreditSceneProps) {
  const [beat, setBeat] = useState<Beat>("black");

  useEffect(() => {
    const timers = BEAT_TIMES.map(([nextBeat, delay]) => setTimeout(() => setBeat(nextBeat), delay));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black px-8">
      <AnimatePresence mode="wait">
        {beat === "return" && (
          <FadeCard key="return">
            <p className="max-w-[min(88vw,62rem)] font-editorial text-[clamp(1.7rem,6vh,4rem)] leading-tight text-[#f4ede1]">
              Arron &amp; Alise will return in Chapter 12.
            </p>
          </FadeCard>
        )}

        {beat === "tease" && (
          <FadeCard key="tease">
            <p className="max-w-[min(88vw,58rem)] font-editorial text-[clamp(1.55rem,5.4vh,3.8rem)] italic leading-tight text-[#cba15c]">
              Why not revisit one of the very first things that brought us together?
            </p>
          </FadeCard>
        )}

        {beat === "date" && (
          <FadeCard key="date">
            <p className="font-sans text-[clamp(0.7rem,2.2vh,1.05rem)] uppercase tracking-[0.28em] text-[#f4ede1]">
              Friday 14th August 2026
            </p>
          </FadeCard>
        )}

        {(beat === "tickets" || beat === "button") && (
          <motion.div
            key="tickets"
            className="absolute inset-0 flex flex-col items-center justify-center gap-[clamp(1rem,3vh,2.5rem)] px-[clamp(1rem,4vw,2rem)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL }}
          >
            <div className="flex max-h-[82dvh] flex-col items-center justify-center gap-[clamp(0.75rem,2vh,1.5rem)] lg:flex-row">
              <Ticket config={config} holder="Alise" delay={0.2} />
              <Ticket config={config} holder="Arron" delay={0.55} />
            </div>

            {beat === "button" && (
              <motion.button
                type="button"
                className="film-navigation__control px-0 py-0 text-[#f4ede1]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, ease: EASE_NATURAL }}
                onClick={(event) => {
                  event.stopPropagation();
                  onComplete();
                }}
              >
                Revisit Our Story
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
