"use client";

import { useEffect, useState } from "react";

interface TypedTextProps {
  text: string;
  className?: string;
  speed?: number;
  onComplete?: () => void;
}

export function TypedText({ text, className, speed = 45, onComplete }: TypedTextProps) {
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    if (!text) return;

    const interval = setInterval(() => {
      setVisibleChars((count) => Math.min(count + 1, text.length));
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  useEffect(() => {
    if (!text) {
      onComplete?.();
      return;
    }
    if (visibleChars >= text.length) {
      onComplete?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleChars, text]);

  return (
    <span className={className}>
      {text.slice(0, visibleChars)}
      <span className="opacity-40">|</span>
    </span>
  );
}
