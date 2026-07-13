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

type ViewportProfile = "mobile" | "tablet" | "desktop";

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

function viewportProfile(viewport: LayoutViewport): ViewportProfile {
  if (viewport.width < 640) return "mobile";
  if (viewport.width < 1024 || viewport.height < 680) return "tablet";
  return "desktop";
}

function maxItemsFor(viewport: LayoutViewport) {
  const profile = viewportProfile(viewport);
  if (profile === "mobile") return viewport.height < 620 ? 1 : 2;
  if (profile === "tablet") return 3;
  return 4;
}

function printWidth(item: MediaItem, index: number, viewport: LayoutViewport, random: () => number) {
  const profile = viewportProfile(viewport);
  const shortSide = Math.min(viewport.width, viewport.height);
  const longSide = Math.max(viewport.width, viewport.height);
  const narrowScreenScale = profile === "mobile" ? 1.92 : profile === "tablet" ? 1.12 : 1;
  const base =
    clamp(Math.sqrt(viewport.width * viewport.height) * 0.145, shortSide * 0.17, longSide * 0.15) *
    narrowScreenScale;
  const orientation =
    item.orientation === "portrait" ? 0.76 :
    item.orientation === "landscape" ? 1.08 :
    0.9;
  const hero = index === 0 ? (profile === "mobile" ? 1.38 : 1.22) : 1;
  const variation = index === 0 ? 1 : 0.9 + random() * 0.2;
  const mobileWidthCap =
    item.orientation === "landscape"
      ? index === 0 ? 0.84 : 0.66
      : item.orientation === "portrait"
        ? index === 0 ? 0.68 : 0.52
        : index === 0 ? 0.74 : 0.58;
  const maxWidth =
    viewport.width *
    (profile === "mobile"
      ? mobileWidthCap
      : profile === "tablet"
        ? index === 0 ? 0.34 : 0.25
        : index === 0 ? 0.28 : 0.21);
  const maxHeight =
    viewport.height *
    (profile === "mobile"
      ? index === 0 ? 0.44 : 0.31
      : index === 0 ? 0.5 : 0.34);

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

  const profile = viewportProfile(viewport);
  if (profile === "mobile") {
    const width = Math.min(viewport.width * 0.84, 288);
    const height = Math.min(viewport.height * 0.28, 96 + label.lines.length * 20);
    return {
      left: (viewport.width - width) / 2,
      top: viewport.height - clamp(viewport.height * 0.08, 48, 72) - height,
      width,
      height,
    };
  }

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
  const profile = viewportProfile(viewport);
  const random = seededRandom(item.src.length + index * 131 + pageIndex * 997 + tone.length * 17);
  const marginX =
    profile === "mobile"
      ? clamp(viewport.width * 0.065, 22, 34)
      : clamp(viewport.width * 0.035, 14, 54);
  const marginTop =
    profile === "mobile"
      ? clamp(viewport.height * 0.13, 78, 112)
      : clamp(viewport.height * 0.105, 58, 112);
  const marginBottom =
    profile === "mobile"
      ? clamp(viewport.height * 0.16, 88, 136)
      : clamp(viewport.height * 0.095, 42, 86);
  const gap =
    profile === "mobile"
      ? clamp(Math.sqrt(viewport.width * viewport.height) * 0.03, 22, 36)
      : clamp(Math.sqrt(viewport.width * viewport.height) * 0.018, 12, 28);
  const availableWidth = viewport.width - marginX * 2;
  const availableHeight = viewport.height - marginTop - marginBottom;
  const attempts = profile === "mobile" ? 140 : index === 0 ? 80 : 220;

  for (const scale of profile === "mobile" ? [1, 0.92, 0.84, 0.76] : [1, 0.94, 0.88]) {
    const width = printWidth(item, index, viewport, random) * scale;
    const height = width * aspectFor(item);
    if (height > availableHeight || width > availableWidth) continue;

    let best: { rect: PrintRect; score: number } | null = null;
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      const spread = attempt / attempts;
      const preferEdge = profile !== "mobile" && placed.length > 3 && random() > 0.45;
      const xBias =
        profile === "mobile"
          ? 0.5 + (random() - 0.5) * (index === 0 ? 0.34 : 0.56)
          : preferEdge ? (random() > 0.5 ? random() * 0.22 : 0.78 + random() * 0.22) : random();
      const yBias =
        profile === "mobile"
          ? index === 0 ? 0.12 + random() * 0.32 : 0.56 + random() * 0.34
          : preferEdge ? (random() > 0.5 ? random() * 0.24 : 0.72 + random() * 0.28) : random();
      const left = marginX + xBias * (availableWidth - width);
      const top = marginTop + yBias * (availableHeight - height);
      const rect = { left, top, width, height };

      if (placed.some((other) => overlaps(rect, other, gap))) continue;

      const score = scoreCandidate(rect, placed, viewport, random) + spread * 12;
      if (!best || score > best.score) best = { rect, score };
    }

    if (best) {
      const rotationScale = tone === "young" ? 1 : tone === "wedding" || tone === "confined" ? 0.35 : 0.65;
      const rotateRange = profile === "mobile" ? 1.15 : 3.8;
      const driftRange = profile === "mobile" ? 12 : 26;
      return {
        rect: best.rect,
        slot: {
          left: (best.rect.left / viewport.width) * 100,
          top: (best.rect.top / viewport.height) * 100,
          widthPercent: (best.rect.width / viewport.width) * 100,
          rotate: index === 0 ? (profile === "mobile" ? 0 : pageIndex % 2 === 0 ? -0.5 : 0.5) : (random() - 0.5) * rotateRange * rotationScale,
          driftX: (random() - 0.5) * driftRange,
          driftY: profile === "mobile" ? 6 + random() * 8 : 10 + random() * 14,
          delay: index * (profile === "mobile" ? 0.04 : tone === "wedding" ? 0.045 : 0.065),
          z: index === 0 ? 14 : 2 + index,
        },
      };
    }
  }

  return null;
}

function fallbackPlaceOne(
  item: MediaItem,
  index: number,
  pageIndex: number,
  viewport: LayoutViewport,
  direction?: ActDirection,
) {
  const profile = viewportProfile(viewport);
  const random = seededRandom(item.src.length + index * 131 + pageIndex * 997);
  const marginX =
    profile === "mobile"
      ? clamp(viewport.width * 0.065, 22, 34)
      : clamp(viewport.width * 0.035, 14, 54);
  const marginTop =
    profile === "mobile"
      ? clamp(viewport.height * 0.13, 78, 112)
      : clamp(viewport.height * 0.105, 58, 112);
  const marginBottom =
    profile === "mobile"
      ? clamp(viewport.height * 0.16, 88, 136)
      : clamp(viewport.height * 0.095, 42, 86);
  const availableWidth = Math.max(1, viewport.width - marginX * 2);
  const availableHeight = Math.max(1, viewport.height - marginTop - marginBottom);
  const width = Math.min(printWidth(item, index, viewport, random), availableWidth, availableHeight / aspectFor(item));
  const height = width * aspectFor(item);
  const topBias = profile === "mobile" ? 0.18 : 0.38;
  const left = marginX + (availableWidth - width) / 2;
  const top = marginTop + Math.max(0, (availableHeight - height) * topBias);
  const tone = direction?.tone ?? "growing";
  const rotationScale = tone === "young" ? 1 : tone === "wedding" || tone === "confined" ? 0.35 : 0.65;

  return {
    rect: { left, top, width, height },
    slot: {
      left: (left / viewport.width) * 100,
      top: (top / viewport.height) * 100,
      widthPercent: (width / viewport.width) * 100,
      rotate: index === 0 ? 0 : (random() - 0.5) * 1.15 * rotationScale,
      driftX: 0,
      driftY: profile === "mobile" ? 8 : 12,
      delay: index * (profile === "mobile" ? 0.04 : 0.065),
      z: index === 0 ? 14 : 2 + index,
    },
  };
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
  const maxItems = maxItemsFor(viewport);

  for (const item of items) {
    if (pageItems.length >= maxItems) break;

    const placement = placeOne(item, pageItems.length, pageIndex, viewport, placed, direction);
    const fallbackPlacement = !placement && pageItems.length === 0
      ? fallbackPlaceOne(item, pageItems.length, pageIndex, viewport, direction)
      : null;
    const finalPlacement = placement ?? fallbackPlacement;

    if (!finalPlacement) {
      if (pageItems.length >= maxItems) break;
      continue;
    }

    placed.push(finalPlacement.rect);
    pageItems.push(item);
    slots.push(finalPlacement.slot);
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
