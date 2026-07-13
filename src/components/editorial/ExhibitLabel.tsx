"use client";

import { motion } from "framer-motion";
import { EASE_NATURAL } from "@/lib/motion";
import type { ExhibitLabelContent, ExhibitLabelPlacement } from "@/lib/exhibitLabels";

const PLACEMENT_CLASS: Record<ExhibitLabelPlacement, string> = {
  "upper-left": "left-[clamp(1rem,5vw,4.5rem)] top-[clamp(5rem,13vh,7rem)]",
  "upper-right": "right-[clamp(1rem,5vw,4.5rem)] top-[clamp(5.5rem,14vh,7.5rem)]",
  "lower-left": "left-[clamp(1rem,6vw,5rem)] bottom-[clamp(4.75rem,11vh,7rem)]",
  "lower-right": "right-[clamp(1rem,6vw,5rem)] bottom-[clamp(4.75rem,11vh,7rem)]",
  "beside-hero-left": "left-[clamp(1rem,7vw,6rem)] top-[clamp(8rem,27vh,13rem)]",
  "beside-hero-right": "right-[clamp(1rem,7vw,6rem)] top-[clamp(8rem,28vh,14rem)]",
  "tucked-low": "left-1/2 bottom-[clamp(4.5rem,9vh,6rem)] -translate-x-1/2",
};

interface ExhibitLabelProps {
  label: ExhibitLabelContent;
  delay?: number;
  className?: string;
}

export function ExhibitLabel({ label, delay = 2.35, className = "" }: ExhibitLabelProps) {
  return (
    <motion.aside
      aria-label={label.heading}
      className={`exhibit-label pointer-events-none absolute z-30 w-[min(76vw,20rem)] ${PLACEMENT_CLASS[label.placement]} ${className}`}
      style={{ rotate: `${label.rotate}deg` }}
      initial={{ opacity: 0, y: 10, scale: 0.985, filter: "blur(5px)" }}
      animate={{ opacity: 0.88, y: 0, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: 5, filter: "blur(4px)" }}
      transition={{ duration: 2.4, ease: EASE_NATURAL, delay }}
    >
      <p className="font-hand text-[clamp(1.25rem,3vw,1.75rem)] leading-[0.95] text-[#5d3f30]">
        {label.heading}
      </p>
      <ul className="mt-3 space-y-1.5 font-editorial text-[clamp(0.84rem,1.45vw,1rem)] leading-snug text-[#372920]">
        {label.lines.map((line, index) => (
          <li
            key={`${line.text}-${index}`}
            className={`flex items-baseline gap-2 ${line.emphasis ? "font-semibold tracking-[0.04em]" : ""}`}
          >
            {line.icon && <span className="shrink-0 text-[0.95em] leading-none">{line.icon}</span>}
            <span className={line.crossedOut ? "hand-crossout relative inline-block font-hand text-[1.2em] text-[#5d3f30]" : ""}>
              {line.text}
            </span>
          </li>
        ))}
      </ul>
    </motion.aside>
  );
}
