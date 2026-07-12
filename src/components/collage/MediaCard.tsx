"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { EASE_NATURAL } from "@/lib/motion";
import type { MediaItem } from "@/lib/types";
import type { CollageSlot } from "./layout";

interface MediaCardProps {
  item: MediaItem;
  slot: CollageSlot;
  focused: boolean;
  dimmed: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function MediaCard({ item, slot, focused, dimmed, onOpen, onClose }: MediaCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (focused) {
      video.muted = false;
      video.volume = 0;
      video.play().catch(() => {});
      let volume = 0;
      const rampInterval = setInterval(() => {
        volume = Math.min(1, volume + 0.08);
        video.volume = volume;
        if (volume >= 1) clearInterval(rampInterval);
      }, 60);
      return () => clearInterval(rampInterval);
    }

    video.muted = true;
    video.play().catch(() => {});
  }, [focused]);

  return (
    <motion.div
      className="absolute cursor-pointer overflow-hidden rounded-sm shadow-2xl"
      style={
        focused
          ? { left: "50%", top: "50%", width: "min(70vw, 900px)", zIndex: 50 }
          : { left: `${slot.left}%`, top: `${slot.top}%`, width: `${slot.widthPercent}%`, zIndex: slot.z }
      }
      initial={{ opacity: 0, x: slot.driftX, y: slot.driftY, rotate: slot.rotate * 2, scale: 0.96 }}
      animate={
        focused
          ? { opacity: 1, x: "-50%", y: "-50%", rotate: 0, scale: 1, filter: "blur(0px)" }
          : {
              opacity: dimmed ? 0.35 : 1,
              x: 0,
              y: 0,
              rotate: slot.rotate,
              scale: 1,
              filter: dimmed ? "blur(6px)" : "blur(0px)",
            }
      }
      transition={{ duration: focused ? 0.9 : 2.4, ease: EASE_NATURAL, delay: focused ? 0 : slot.delay }}
      onClick={(event) => {
        event.stopPropagation();
        if (focused) {
          onClose();
        } else {
          onOpen();
        }
      }}
    >
      <div className="relative aspect-auto w-full" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
        {item.type === "photo" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.src} alt="" className="h-full w-full object-cover" draggable={false} />
        ) : (
          <video
            ref={videoRef}
            src={item.src}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            controls={focused}
          />
        )}
      </div>
    </motion.div>
  );
}
