export const EASE_NATURAL = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  quick: 0.6,
  standard: 1.1,
  slow: 1.8,
  cinematic: 2.6,
} as const;

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.standard, ease: EASE_NATURAL, delay },
  }),
};

export const fade = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: DURATION.slow, ease: EASE_NATURAL, delay },
  }),
  exit: { opacity: 0, transition: { duration: DURATION.standard, ease: EASE_NATURAL } },
};

export const driftIn = {
  hidden: (custom: { x: number; y: number; rotate: number }) => ({
    opacity: 0,
    x: custom.x,
    y: custom.y,
    rotate: custom.rotate * 2,
    scale: 0.96,
  }),
  visible: (custom: { rotate: number; delay: number }) => ({
    opacity: 1,
    x: 0,
    y: 0,
    rotate: custom.rotate,
    scale: 1,
    transition: { duration: DURATION.cinematic, ease: EASE_NATURAL, delay: custom.delay },
  }),
};

export const focusBlur = {
  rest: { filter: "blur(0px)", scale: 1, opacity: 1 },
  blurred: { filter: "blur(6px)", scale: 0.98, opacity: 0.5 },
  focused: { filter: "blur(0px)", scale: 1.02, opacity: 1 },
};

export const chapterTransition = {
  hold: { opacity: 1 },
  black: {
    opacity: 0,
    transition: { duration: DURATION.cinematic, ease: EASE_NATURAL },
  },
};
