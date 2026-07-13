import type { Chapter } from "./types";

export type ActTone =
  | "young"
  | "growing"
  | "confined"
  | "anticipation"
  | "hopeful"
  | "wedding"
  | "home"
  | "finale";

export interface ActDirection {
  tone: ActTone;
  frame: "loose" | "confident" | "small" | "held" | "wide" | "quiet";
  pace: "restless" | "steady" | "slow" | "suspended" | "bright" | "still";
}

export function directionForChapter(chapter: Pick<Chapter, "slug">): ActDirection {
  switch (chapter.slug) {
    case "01-the-beginning":
      return { tone: "young", frame: "loose", pace: "restless" };
    case "02-growing-together":
      return { tone: "growing", frame: "confident", pace: "steady" };
    case "03-us-against-the-world":
      return { tone: "confined", frame: "small", pace: "slow" };
    case "04-she-said-yes":
      return { tone: "anticipation", frame: "held", pace: "suspended" };
    case "05-building-forever":
      return { tone: "hopeful", frame: "wide", pace: "bright" };
    case "06-the-wedding":
      return { tone: "wedding", frame: "wide", pace: "bright" };
    case "07-home":
      return { tone: "home", frame: "quiet", pace: "still" };
    default:
      return { tone: "finale", frame: "held", pace: "suspended" };
  }
}

export const actLabel: Record<ActTone, string> = {
  young: "captured, not composed",
  growing: "the frame gets steadier",
  confined: "inside, together",
  anticipation: "before the answer",
  hopeful: "forward motion",
  wedding: "sun, vows, release",
  home: "quiet arrival",
  finale: "hold",
};
