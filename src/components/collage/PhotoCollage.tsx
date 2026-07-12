"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { MediaItem } from "@/lib/types";
import { layoutCollage } from "./layout";
import { MediaCard } from "./MediaCard";

interface PhotoCollageProps {
  media: MediaItem[];
}

export function PhotoCollage({ media }: PhotoCollageProps) {
  const slots = useMemo(() => layoutCollage(media), [media]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  return (
    <div className="relative h-full w-full">
      {media.map((item, index) => (
        <MediaCard
          key={item.src}
          item={item}
          slot={slots[index]}
          focused={focusedIndex === index}
          dimmed={focusedIndex !== null && focusedIndex !== index}
          onOpen={() => setFocusedIndex(index)}
          onClose={() => setFocusedIndex(null)}
        />
      ))}
      {focusedIndex !== null && (
        <motion.div
          className="absolute inset-0 z-40 bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9 }}
          onClick={(event) => {
            event.stopPropagation();
            setFocusedIndex(null);
          }}
        />
      )}
    </div>
  );
}
