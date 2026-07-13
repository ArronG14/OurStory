export type ExhibitLabelPlacement =
  | "upper-left"
  | "upper-right"
  | "lower-left"
  | "lower-right"
  | "beside-hero-left"
  | "beside-hero-right"
  | "tucked-low";

export interface ExhibitLabelLine {
  text: string;
  icon?: string;
  crossedOut?: boolean;
  emphasis?: boolean;
}

export interface ExhibitLabelContent {
  heading: string;
  lines: ExhibitLabelLine[];
  placement: ExhibitLabelPlacement;
  rotate: number;
}

const LABELS: Record<string, ExhibitLabelContent> = {
  "01-the-beginning": {
    heading: "Moments We'll Never Forget",
    placement: "lower-right",
    rotate: -1.4,
    lines: [
      { icon: "❤️", text: "Our First Date - King & Castle" },
      { icon: "✈️", text: "Our First Holiday - Tenerife" },
      { icon: "🌴", text: "Our First Big Holiday - Dominican Republic" },
      { icon: "🌏", text: "Hong Kong & Thailand" },
      { icon: "🎂", text: "Your 21st Birthday" },
    ],
  },
  "02-growing-together": {
    heading: "Moments We'll Never Forget",
    placement: "upper-left",
    rotate: 0.8,
    lines: [
      { icon: "🇵🇹", text: "Our 3rd Anniversary - Portugal" },
      { icon: "🎓", text: "You Graduated" },
      { icon: "🍻", text: "Copious Amounts Of Alcohol" },
      { icon: "❤️", text: "Our 4th & 5th Anniversaries" },
    ],
  },
  "03-us-against-the-world": {
    heading: "Moments We'll Never Forget",
    placement: "upper-right",
    rotate: -0.7,
    lines: [
      { icon: "🦠", text: "The Covid Lockdowns" },
      { icon: "💪", text: "Countless Double Workouts" },
      { icon: "🥃", text: "Countless Double Shots" },
      { icon: "🏠", text: "Making The Most Of Every Day Together" },
    ],
  },
  "04-she-said-yes": {
    heading: "Moments We'll Never Forget",
    placement: "beside-hero-left",
    rotate: -1,
    lines: [
      { text: "My Birthday", crossedOut: true },
      { icon: "💍", text: "OUR ENGAGEMENT", emphasis: true },
    ],
  },
  "05-building-forever": {
    heading: "Moments We'll Never Forget",
    placement: "lower-left",
    rotate: 1.1,
    lines: [
      { icon: "🎂", text: "My 30th Birthday" },
      { icon: "✈️", text: "Planning Our Future" },
      { icon: "❤️", text: "Every Milestone Together" },
    ],
  },
  "06-the-wedding": {
    heading: "Moments We'll Never Forget",
    placement: "tucked-low",
    rotate: -0.5,
    lines: [
      { text: "England In The Euros Final", crossedOut: true },
      { icon: "💍", text: "OUR WEDDING", emphasis: true },
      { icon: "🇯🇲", text: "Jamaica" },
      { icon: "🥂", text: "The Best Week Of Our Lives" },
    ],
  },
  "07-home": {
    heading: "Moments We'll Never Forget",
    placement: "beside-hero-right",
    rotate: 0.9,
    lines: [
      { icon: "🏡", text: "Moving Into Our First Home" },
      { icon: "🛋️", text: "Building Our Life Together" },
      { icon: "❤️", text: "Married Life Begins" },
    ],
  },
  "08-nyla": {
    heading: "The Little Things",
    placement: "lower-left",
    rotate: -1.2,
    lines: [
      { icon: "🐾", text: "The First Day We Met You" },
      { icon: "🦴", text: "Destroying Everything You Could Find" },
      { icon: "❤️", text: "Becoming Our Little Family" },
      { icon: "🏡", text: "Turning Our House Into A Home" },
    ],
  },
};

export function getExhibitLabel(slug: string) {
  return LABELS[slug] ?? null;
}
