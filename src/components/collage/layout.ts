import type { MediaItem } from "@/lib/types";

export interface CollageSlot {
  left: number;
  top: number;
  widthPercent: number;
  rotate: number;
  driftX: number;
  driftY: number;
  delay: number;
  z: number;
}

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export function layoutCollage(media: MediaItem[]): CollageSlot[] {
  const columns = Math.max(3, Math.ceil(Math.sqrt(media.length * 1.6)));
  const cellWidth = 100 / columns;

  return media.map((item, index) => {
    const random = seededRandom(index * 97 + item.src.length);
    const col = index % columns;
    const row = Math.floor(index / columns);

    const baseWidth = item.orientation === "portrait" ? cellWidth * 0.85 : cellWidth * 1.25;
    const jitterX = (random() - 0.5) * cellWidth * 0.5;
    const jitterY = (random() - 0.5) * 10;

    return {
      left: Math.min(88, Math.max(2, col * cellWidth + jitterX)),
      top: Math.min(80, Math.max(4, row * 26 + jitterY)),
      widthPercent: item.featured ? baseWidth * 1.3 : baseWidth,
      rotate: (random() - 0.5) * 6,
      driftX: (random() - 0.5) * 60,
      driftY: 30 + random() * 40,
      delay: index * 0.18,
      z: item.featured ? 20 : Math.round(random() * 10),
    };
  });
}
