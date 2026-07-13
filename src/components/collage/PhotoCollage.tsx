"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { directionForChapter } from "@/lib/direction";
import { getExhibitLabel } from "@/lib/exhibitLabels";
import type { Chapter, MediaItem } from "@/lib/types";
import { EASE_NATURAL } from "@/lib/motion";
import { ExhibitLabel } from "@/components/editorial/ExhibitLabel";
import { layoutCollagePages } from "./layout";
import { MediaCard } from "./MediaCard";

interface PhotoCollageProps {
  media: MediaItem[];
  chapter?: Chapter;
  labelSlug?: string;
  titleOverride?: string;
  dateRangeOverride?: string;
  mood?: "standard" | "nyla";
  advanceSignal?: number;
  onReady?: () => void;
  onComplete?: () => void;
}

export function PhotoCollage({
  media,
  chapter,
  labelSlug,
  titleOverride,
  dateRangeOverride,
  mood = "standard",
  advanceSignal = 0,
  onReady,
  onComplete,
}: PhotoCollageProps) {
  const direction = chapter ? directionForChapter(chapter) : undefined;
  const exhibitLabel = getExhibitLabel(labelSlug ?? chapter?.slug ?? "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const [hasMeasuredViewport, setHasMeasuredViewport] = useState(false);
  const pages = useMemo(() => layoutCollagePages(media, direction, viewport, exhibitLabel), [media, direction, viewport, exhibitLabel]);
  const [pageIndex, setPageIndex] = useState(0);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [preparedSrcs, setPreparedSrcs] = useState<Set<string>>(() => new Set());
  const preloadPromises = useRef(new Map<string, Promise<void>>());
  const safePageIndex = Math.min(pageIndex, Math.max(0, pages.length - 1));
  const activePage = pages[safePageIndex] ?? pages[0];
  const nextPage = pages[safePageIndex + 1];

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () => {
      const rect = element.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width > 0 && height > 0) setHasMeasuredViewport(true);
      setViewport((current) => {
        if (Math.abs(current.width - width) < 2 && Math.abs(current.height - height) < 2) return current;
        return { width, height };
      });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const advancePage = useCallback(() => {
    if (focusedIndex !== null) return;
    if (safePageIndex < pages.length - 1) {
      setPageIndex(safePageIndex + 1);
      return;
    }
    onComplete?.();
  }, [focusedIndex, onComplete, pages.length, safePageIndex]);

  const markPrepared = useCallback((src: string) => {
    setPreparedSrcs((current) => {
      if (current.has(src)) return current;
      const next = new Set(current);
      next.add(src);
      return next;
    });
  }, []);

  const preloadMedia = useCallback((item: MediaItem) => {
    const existing = preloadPromises.current.get(item.src);
    if (existing) return existing;

    const promise = new Promise<void>((resolve) => {
      if (item.type === "photo") {
        const image = new Image();
        image.decoding = "sync";
        image.onload = () => {
          const decode = image.decode?.();
          if (decode) decode.catch(() => undefined).finally(resolve);
          else resolve();
        };
        image.onerror = () => resolve();
        image.src = item.src;
        return;
      }

      const video = document.createElement("video");
      video.preload = "auto";
      video.muted = true;
      video.playsInline = true;

      const finish = () => {
        video.removeEventListener("loadeddata", finish);
        video.removeEventListener("canplay", finish);
        video.removeEventListener("error", finish);
        resolve();
      };

      video.addEventListener("loadeddata", finish, { once: true });
      video.addEventListener("canplay", finish, { once: true });
      video.addEventListener("error", finish, { once: true });
      video.src = item.src;
      video.load();
    }).then(() => markPrepared(item.src));

    preloadPromises.current.set(item.src, promise);
    return promise;
  }, [markPrepared]);

  const openPreparedMedia = useCallback((item: MediaItem, index: number) => {
    preloadMedia(item).finally(() => setFocusedIndex(index));
  }, [preloadMedia]);

  useEffect(() => {
    if (advanceSignal === 0) return;
    const timer = window.setTimeout(advancePage, 0);
    return () => window.clearTimeout(timer);
  }, [advancePage, advanceSignal]);

  useEffect(() => {
    const mediaToPrepare = [
      ...(activePage?.items ?? []),
      ...(nextPage?.items ?? []),
    ];

    mediaToPrepare.forEach((item) => {
      preloadMedia(item);
    });
  }, [activePage, nextPage, preloadMedia]);

  useEffect(() => {
    let cancelled = false;
    let timer: number | null = null;
    const latestSlotDelay = activePage?.slots.reduce((latest, slot) => Math.max(latest, slot.delay), 0) ?? 0;

    if (!hasMeasuredViewport) return undefined;

    Promise.all((activePage?.items ?? []).map(preloadMedia)).finally(() => {
      if (cancelled) return;
      timer = window.setTimeout(() => onReady?.(), (latestSlotDelay + 2.15) * 1000);
    });

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [activePage, hasMeasuredViewport, onReady, preloadMedia]);

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      style={{
        background:
          direction?.tone === "wedding"
            ? "linear-gradient(180deg, #f5ce8b 0%, #af6538 52%, #190c08 100%)"
            : direction?.tone === "confined"
              ? "radial-gradient(circle at 50% 50%, #111318 0%, #08090b 68%)"
              : undefined,
      }}
    >
      {direction?.tone === "young" && <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.35)_1px,transparent_1px)] [background-size:100%_6px]" />}
      {direction?.tone === "confined" && <div className="absolute inset-[14%] border border-white/10" />}
      {direction?.tone === "wedding" && <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.34),transparent_42%,rgba(46,18,8,.2))]" />}
      {mood === "nyla" && (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(232,174,95,.18),transparent_34%),radial-gradient(circle_at_18%_82%,rgba(255,226,170,.11),transparent_30%)]" />
      )}
      {chapter && (
        <motion.header
          className="pointer-events-none absolute top-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-center"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: EASE_NATURAL, delay: 0.35 }}
        >
          <p className="font-editorial text-xl leading-none text-[#f4ede1] md:text-2xl">
            {titleOverride ?? chapter.title}
          </p>
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#f4ede1]/55">
            {dateRangeOverride ?? chapter.dateRange}
          </p>
        </motion.header>
      )}

      {hasMeasuredViewport && exhibitLabel && focusedIndex === null && <ExhibitLabel label={exhibitLabel} />}

      <AnimatePresence mode="wait">
        <motion.div
          key={safePageIndex}
          className={`absolute inset-0 z-20 ${hasMeasuredViewport ? "visible" : "invisible"}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.15, ease: EASE_NATURAL }}
        >
          {activePage?.items.map((item, index) => (
            <MediaCard
              key={`${safePageIndex}-${item.src}`}
              item={item}
              slot={activePage.slots[index]}
              direction={direction}
              focused={focusedIndex === index}
              dimmed={focusedIndex !== null && focusedIndex !== index}
              prepared={preparedSrcs.has(item.src)}
              mood={mood}
              onOpen={() => openPreparedMedia(item, index)}
              onClose={() => setFocusedIndex(null)}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {pages.length > 1 && (
        <div className="pointer-events-none absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
          {pages.map((page, index) => (
            <span
              key={page.items[0]?.src ?? index}
              className={`h-px w-8 transition-opacity duration-700 ${
                index === safePageIndex ? "bg-[#f4ede1]/70" : "bg-[#f4ede1]/20"
              }`}
            />
          ))}
        </div>
      )}

      {focusedIndex !== null && (
        <motion.div
          className="absolute inset-0 z-40 bg-black/55 backdrop-blur-[6px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          onClick={(event) => {
            event.stopPropagation();
            setFocusedIndex(null);
          }}
        />
      )}
    </div>
  );
}
