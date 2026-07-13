"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";
import { motion } from "framer-motion";
import type { Chapter, CreditsConfig } from "@/lib/types";

interface CreditsSceneProps {
  credits: CreditsConfig;
  chapters: Chapter[];
  onReady: () => void;
}

const CREDIT_DURATION_MS = 56000;

function CreditSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="flex min-h-[34vh] flex-col items-center justify-center gap-[clamp(0.7rem,2vh,1.25rem)] text-center">
      <h2 className="font-sans text-[clamp(0.6rem,1.45vh,0.7rem)] uppercase tracking-[0.28em] text-[#8a8478]">{title}</h2>
      <div className="flex max-w-[min(88vw,60rem)] flex-col items-center gap-[clamp(0.35rem,1.2vh,0.75rem)] font-editorial text-[clamp(1.55rem,5vh,4rem)] leading-tight text-[#f4ede1]">
        {children}
      </div>
    </section>
  );
}

export function CreditsScene({ credits, chapters, onReady }: CreditsSceneProps) {
  void credits;
  void chapters;

  useEffect(() => {
    const timeout = setTimeout(onReady, 2200);
    return () => clearTimeout(timeout);
  }, [onReady]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black px-8">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-black to-transparent" />

      <motion.div
        className="mx-auto flex min-h-[230vh] max-w-5xl flex-col items-center pb-[80vh] pt-[100vh]"
        initial={{ y: "0%" }}
        animate={{ y: "-68%" }}
        transition={{ duration: CREDIT_DURATION_MS / 1000, ease: "linear" }}
      >
        <CreditSection title="Created By">
          <p>Arron</p>
        </CreditSection>

        <CreditSection title="Directed By">
          <p>Arron</p>
        </CreditSection>

        <CreditSection title="Starring">
          <p>Arron</p>
          <p>Alise</p>
        </CreditSection>

        <CreditSection title="Special Guest">
          <p>Nyla</p>
        </CreditSection>

        <CreditSection title="Featuring">
          <p>11 Years Together</p>
          <p>Countless Memories</p>
          <p>One Ridiculous Snapchat Streak</p>
        </CreditSection>

        <CreditSection title="Locations">
          <p>Amanda Court</p>
          <p>King &amp; Castle</p>
          <p>Tenerife</p>
          <p>Portugal</p>
          <p>Dominican Republic</p>
          <p>Hong Kong</p>
          <p>Thailand</p>
          <p>Jamaica</p>
          <p>Our First Home</p>
        </CreditSection>

        <CreditSection title="Dedicated To">
          <p>My Best Friend</p>
        </CreditSection>

        <CreditSection title="Thank You">
          <p>For Choosing Me Every Day</p>
        </CreditSection>

        <div className="h-[42vh]" />
      </motion.div>
    </div>
  );
}
