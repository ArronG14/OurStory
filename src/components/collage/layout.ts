import type { MediaItem } from "@/lib/types";
import type { ActDirection } from "@/lib/direction";
import type { ExhibitLabelContent } from "@/lib/exhibitLabels";

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

export interface CollagePage {
  items: MediaItem[];
  slots: CollageSlot[];
  heroIndex: number;
}

export interface LayoutViewport {
  width: number;
  height: number;
}

interface PrintRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function heroIndexFor(items: MediaItem[], pageIndex: number) {
  const featuredIndex = items.findIndex((item) => item.featured);
  if (featuredIndex >= 0) return featuredIndex;

  const photoIndexes = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => item.type === "photo")
    .map(({ index }) => index);

  if (photoIndexes.length === 0) return 0;
  return photoIndexes[pageIndex % photoIndexes.length];
}

function rotateHeroToFront(items: MediaItem[], pageIndex: number) {
  if (items.length === 0) return { items, heroIndex: 0 };

  const heroIndex = heroIndexFor(items, pageIndex);
  return {
    items: [items[heroIndex], ...items.slice(0, heroIndex), ...items.slice(heroIndex + 1)],
    heroIndex: 0,
  };
}

function aspectFor(item: MediaItem) {
  return item.height / item.width;
}

function printWidth(item: MediaItem, index: number, viewport: LayoutViewport, random: () => number) {
  const shortSide = Math.min(viewport.width, viewport.height);
  const longSide = Math.max(viewport.width, viewport.height);
  const narrowScreenScale = viewport.width < 520 ? 1.75 : viewport.width < 820 ? 1.08 : 1;
  const base =
    clamp(Math.sqrt(viewport.width * viewport.height) * 0.145, shortSide * 0.17, longSide * 0.15) *
    narrowScreenScale;
  const orientation =
    item.orientation === "portrait" ? 0.76 :
    item.orientation === "landscape" ? 1.08 :
    0.9;
  const hero = index === 0 ? 1.22 : 1;
  const variation = index === 0 ? 1 : 0.9 + random() * 0.2;
  const maxWidth =
    viewport.width *
    (viewport.width < 520
      ? index === 0 ? 0.4 : 0.32
      : index === 0 ? 0.28 : 0.21);
  const maxHeight = viewport.height * (index === 0 ? 0.5 : 0.34);

  return Math.min(base * orientation * hero * variation, maxWidth, maxHeight / aspectFor(item));
}

function overlaps(a: PrintRect, b: PrintRect, gap: number) {
  return !(
    a.left + a.width + gap <= b.left ||
    b.left + b.width + gap <= a.left ||
    a.top + a.height + gap <= b.top ||
    b.top + b.height + gap <= a.top
  );
}

function center(rect: PrintRect) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function exhibitLabelRect(label: ExhibitLabelContent | null | undefined, viewport: LayoutViewport): PrintRect | null {
  if (!label) return null;

  const width = Math.min(viewport.width * 0.76, 320) + 36;
  const height = Math.min(viewport.height * 0.48, 102 + label.lines.length * 28) + 26;
  const edgeX = clamp(viewport.width * 0.06, 16, 80);
  const upperY = clamp(viewport.height * 0.13, 80, 118);
  const besideY = clamp(viewport.height * 0.27, 128, 224);
  const lowerBottom = clamp(viewport.height * 0.11, 76, 112);

  switch (label.placement) {
    case "upper-left":
      return { left: edgeX, top: upperY, width, height };
    case "upper-right":
      return { left: viewport.width - edgeX - width, top: upperY, width, height };
    case "lower-left":
      return { left: edgeX, top: viewport.height - lowerBottom - height, width, height };
    case "lower-right":
      return { left: viewport.width - edgeX - width, top: viewport.height - lowerBottom - height, width, height };
    case "beside-hero-left":
      return { left: clamp(viewport.width * 0.07, 16, 96), top: besideY, width, height };
    case "beside-hero-right":
      return { left: viewport.width - clamp(viewport.width * 0.07, 16, 96) - width, top: besideY, width, height };
    case "tucked-low":
      return { left: (viewport.width - width) / 2, top: viewport.height - lowerBottom - height, width, height };
    default:
      return null;
  }
}

function scoreCandidate(rect: PrintRect, placed: PrintRect[], viewport: LayoutViewport, random: () => number) {
  if (placed.length === 0) {
    const c = center(rect);
    const targetX = viewport.width * (0.42 + (random() - 0.5) * 0.18);
    const targetY = viewport.height * (0.38 + (random() - 0.5) * 0.14);
    return -Math.hypot(c.x - targetX, c.y - targetY);
  }

  const c = center(rect);
  const distances = placed.map((other) => {
    const o = center(other);
    return Math.hypot(c.x - o.x, c.y - o.y);
  });
  const nearest = Math.min(...distances);
  const edgeUse = Math.min(c.x, viewport.width - c.x) + Math.min(c.y, viewport.height - c.y) * 0.8;
  const leftCount = placed.filter((other) => center(other).x < viewport.width / 2).length;
  const topCount = placed.filter((other) => center(other).y < viewport.height / 2).length;
  const balance =
    (c.x < viewport.width / 2 && leftCount <= placed.length / 2 ? 120 : 0) +
    (c.y < viewport.height / 2 && topCount <= placed.length / 2 ? 90 : 0);

  return nearest * 1.4 + edgeUse * 0.25 + balance + random() * 35;
}

function placeOne(
  item: MediaItem,
  index: number,
  pageIndex: number,
  viewport: LayoutViewport,
  placed: PrintRect[],
  direction?: ActDirection,
) {
  const tone = direction?.tone ?? "growing";
  const random = seededRandom(item.src.length + index * 131 + pageIndex * 997 + tone.length * 17);
  const marginX = clamp(viewport.width * 0.035, 14, 54);
  const marginTop = clamp(viewport.height * 0.105, 58, 112);
  const marginBottom = clamp(viewport.height * 0.095, 42, 86);
  const gap = clamp(Math.sqrt(viewport.width * viewport.height) * 0.018, 12, 28);
  const availableWidth = viewport.width - marginX * 2;
  const availableHeight = viewport.height - marginTop - marginBottom;
  const attempts = index === 0 ? 80 : 220;

  for (const scale of [1, 0.94, 0.88]) {
    const width = printWidth(item, index, viewport, random) * scale;
    const height = width * aspectFor(item);
    if (height > availableHeight || width > availableWidth) continue;

    let best: { rect: PrintRect; score: number } | null = null;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const spread = attempt / attempts;
      const preferEdge = placed.length > 3 && random() > 0.45;
      const xBias = preferEdge ? (random() > 0.5 ? random() * 0.22 : 0.78 + random() * 0.22) : random();
      const yBias = preferEdge ? (random() > 0.5 ? random() * 0.24 : 0.72 + random() * 0.28) : random();
      const left = marginX + xBias * (availableWidth - width);
      const top = marginTop + yBias * (availableHeight - height);
      const rect = { left, top, width, height };

      if (placed.some((other) => overlaps(rect, other, gap))) continue;

      const score = scoreCandidate(rect, placed, viewport, random) + spread * 12;
      if (!best || score > best.score) best = { rect, score };
    }

    if (best) {
      const rotationScale = tone === "young" ? 1 : tone === "wedding" || tone === "confined" ? 0.35 : 0.65;
      return {
        rect: best.rect,
        slot: {
          left: (best.rect.left / viewport.width) * 100,
          top: (best.rect.top / viewport.height) * 100,
          widthPercent: (best.rect.width / viewport.width) * 100,
          rotate: index === 0 ? (pageIndex % 2 === 0 ? -0.5 : 0.5) : (random() - 0.5) * 3.8 * rotationScale,
          driftX: (random() - 0.5) * 26,
          driftY: 10 + random() * 14,
          delay: index * (tone === "wedding" ? 0.045 : 0.065),
          z: index === 0 ? 14 : 2 + index,
        },
      };
    }
  }

  return null;
}

function buildPage(
  items: MediaItem[],
  pageIndex: number,
  viewport: LayoutViewport,
  direction?: ActDirection,
  reservedRect?: PrintRect | null,
) {
  const placed: PrintRect[] = reservedRect ? [reservedRect] : [];
  const pageItems: MediaItem[] = [];
  const slots: CollageSlot[] = [];

  for (const item of items) {
    const placement = placeOne(item, pageItems.length, pageIndex, viewport, placed, direction);
    if (!placement) {
      if (pageItems.length >= 4) break;
      continue;
    }

    placed.push(placement.rect);
    pageItems.push(item);
    slots.push(placement.slot);
  }

  return { items: pageItems, slots, heroIndex: 0, consumed: pageItems.length };
}

export function layoutCollagePages(
  media: MediaItem[],
  direction?: ActDirection,
  viewport: LayoutViewport = { width: 1280, height: 720 },
  exhibitLabel?: ExhibitLabelContent | null,
): CollagePage[] {
  const pages: CollagePage[] = [];
  let remaining = media;
  let pageIndex = 0;
  const reservedRect = exhibitLabelRect(exhibitLabel, viewport);

  while (remaining.length > 0) {
    const pageSeed = rotateHeroToFront(remaining, pageIndex);
    const page = buildPage(pageSeed.items, pageIndex, viewport, direction, reservedRect);
    const consumedSources = new Set(page.items.map((item) => item.src));
    const consumed = remaining.filter((item) => consumedSources.has(item.src)).length;

    if (page.items.length > 0) pages.push(page);
    remaining = remaining.filter((item) => !consumedSources.has(item.src));

    if (consumed === 0) {
      remaining = remaining.slice(1);
    }
    pageIndex += 1;
  }

  return pages;
}
