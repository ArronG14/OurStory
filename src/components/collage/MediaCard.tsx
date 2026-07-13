"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { EASE_NATURAL } from "@/lib/motion";
import type { ActDirection } from "@/lib/direction";
import type { MediaItem } from "@/lib/types";
import type { CollageSlot } from "./layout";

interface MediaCardProps {
  item: MediaItem;
  slot: CollageSlot;
  direction?: ActDirection;
  focused: boolean;
  dimmed: boolean;
  prepared: boolean;
  mood?: "standard" | "nyla";
  displaySrc?: string;
  failed?: boolean;
  onMediaReady?: () => void;
  onMediaFailed?: () => void;
  onOpen: () => void;
  onClose: () => void;
}

export function MediaCard({
  item,
  slot,
  direction,
  focused,
  dimmed,
  prepared,
  mood = "standard",
  displaySrc = item.src,
  failed = false,
  onMediaReady,
  onMediaFailed,
  onOpen,
  onClose,
}: MediaCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const tone = direction?.tone ?? "growing";
  const enterDuration =
    mood === "nyla"
      ? 1.55
      : tone === "confined"
        ? 3.4
        : tone === "wedding"
          ? 1.35
          : tone === "young"
            ? 1.65
            : 2.4;
  const focusedWidth = `min(92vw, calc(86dvh * ${item.width / item.height}), ${item.width}px)`;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {});
  }, [focused]);

  return (
    <motion.div
      layout
      className={`absolute rounded-[2px] border border-[#f4ede1]/35 bg-[#f4ede1] p-[3px] ${
        focused ? "cursor-zoom-out shadow-2xl" : prepared && !failed ? "cursor-zoom-in" : "cursor-default"
      } ${tone === "young" ? "shadow-lg" : "shadow-2xl"}`}
      style={
        focused
          ? { left: "50%", top: "50%", width: focusedWidth, zIndex: 50, willChange: "transform, left, top, width" }
          : { left: `${slot.left}%`, top: `${slot.top}%`, width: `${slot.widthPercent}%`, zIndex: slot.z, willChange: "transform, left, top, width" }
      }
      initial={{
        opacity: 0,
        x: slot.driftX,
        y: slot.driftY,
        rotate: mood === "nyla" ? slot.rotate * 2.18 : tone === "young" ? slot.rotate * 2.4 : slot.rotate * 2,
        scale: mood === "nyla" ? 0.9 : tone === "confined" ? 0.88 : tone === "wedding" ? 1.08 : 0.96,
        clipPath: tone === "wedding" ? "inset(0 0 18% 0)" : "inset(0 0 0 0)",
      }}
      animate={
        focused
          ? {
              opacity: 1,
              x: "-50%",
              y: "-50%",
              rotate: 0,
              scale: 1.012,
              clipPath: "inset(0 0 0 0)",
            }
          : {
              opacity: failed ? 0 : dimmed ? 0.35 : tone === "confined" ? 0.86 : 1,
              x: 0,
              y: 0,
              rotate: slot.rotate,
              scale: 1,
              filter: dimmed ? "blur(6px)" : "blur(0px)",
              clipPath: "inset(0 0 0 0)",
            }
      }
      transition={{
        duration: focused ? 0.92 : enterDuration,
        ease: EASE_NATURAL,
        delay: focused ? 0 : slot.delay,
        layout: {
          type: "spring",
          stiffness: 86,
          damping: 22,
          mass: 0.92,
        },
      }}
      onClick={(event) => {
        event.stopPropagation();
        if (failed) {
          return;
        }

        if (focused) {
          onClose();
        } else {
          onOpen();
        }
      }}
    >
      <div
        className="relative aspect-auto w-full overflow-hidden rounded-[1px]"
        style={{
          aspectRatio: `${item.width} / ${item.height}`,
          filter:
            mood === "nyla"
              ? "brightness(1.12) contrast(1.04) saturate(1.06)"
              : tone === "confined"
                ? "brightness(0.9) contrast(1.08)"
                : "brightness(1.08) contrast(1.04)",
        }}
      >
        {item.type === "photo" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={displaySrc}
            alt=""
            className="h-full w-full object-contain"
            width={item.width}
            height={item.height}
            draggable={false}
            decoding="async"
            loading="eager"
            fetchPriority={focused ? "high" : "auto"}
            style={{ maxWidth: "100%" }}
            onLoad={onMediaReady}
            onError={onMediaFailed}
          />
        ) : (
          <video
            ref={videoRef}
            src={item.src}
            className="h-full w-full object-contain"
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            onLoadedMetadata={onMediaReady}
            onLoadedData={onMediaReady}
            onCanPlay={onMediaReady}
            onError={onMediaFailed}
          />
        )}
      </div>
    </motion.div>
  );
}
