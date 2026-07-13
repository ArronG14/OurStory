"use client";

import { motion } from "framer-motion";
import { DURATION, EASE_NATURAL } from "@/lib/motion";
import type { ChapterPalette } from "@/lib/types";

const PAW_POSITIONS = [
  { left: "22%", top: "76%", rotate: -18 },
  { left: "34%", top: "68%", rotate: 9 },
  { left: "49%", top: "62%", rotate: -6 },
  { left: "63%", top: "55%", rotate: 12 },
  { left: "72%", top: "44%", rotate: -11 },
];

function PawPrint({ color }: { color: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 48 48" fill={color} aria-hidden>
      {/* Main pad */}
      <ellipse cx="24" cy="31" rx="11" ry="10" />
      {/* Toe pads */}
      <ellipse cx="10" cy="19" rx="5.5" ry="6" />
      <ellipse cx="20" cy="14" rx="5.5" ry="6" />
      <ellipse cx="30" cy="14" rx="5.5" ry="6" />
      <ellipse cx="38" cy="19" rx="5.5" ry="6" />
    </svg>
  );
}

export function NylaIntroScene({ palette }: { palette: ChapterPalette }) {
  const pawDelay = 0.55;
  const textDelay = pawDelay * PAW_POSITIONS.length + 1.2;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <motion.div
        className="absolute inset-[18%] border"
        style={{ borderColor: `${palette.foregroundMuted}14` }}
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 4.2, ease: EASE_NATURAL }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-[28vh] w-[28vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ border: `1px solid ${palette.foregroundMuted}12` }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.42, 0.18], scale: [0.8, 1.08, 1.18] }}
        transition={{ duration: 5.8, ease: EASE_NATURAL }}
      />
      <motion.div
        className="absolute bottom-[22vh] left-[16vw] right-[16vw] h-px"
        style={{ background: `${palette.foregroundMuted}2e` }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 4.8, ease: EASE_NATURAL, delay: 0.3 }}
      />
      {PAW_POSITIONS.map((pos, index) => (
        <motion.div
          key={index}
          className="absolute"
          style={{ left: pos.left, top: pos.top }}
          initial={{ opacity: 0, scale: 0.42, rotate: pos.rotate - 18, filter: "blur(4px)" }}
          animate={{ opacity: 0.48, scale: 1, rotate: pos.rotate, filter: "blur(0px)" }}
          transition={{
            duration: 0.72,
            ease: EASE_NATURAL,
            delay: index * pawDelay + 1.0,
          }}
        >
          <PawPrint color={palette.foregroundMuted} />
        </motion.div>
      ))}

      <div className="absolute inset-0 flex items-center justify-center px-8">
        <motion.p
          className="max-w-[min(86vw,42rem)] text-center font-editorial text-[clamp(1.55rem,4.8vh,3.25rem)] leading-tight"
          style={{ color: palette.foreground }}
          initial={{ opacity: 0, y: 0, scale: 0.98, filter: "blur(5px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          transition={{ duration: DURATION.cinematic, ease: EASE_NATURAL, delay: textDelay }}
        >
          There was just one thing missing...
        </motion.p>
      </div>
    </div>
  );
}
