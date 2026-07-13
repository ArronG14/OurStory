export type InterfaceDensity = "full" | "reduced" | "none";
export type InteractionDensity = "high" | "low" | "none";
export type TypedTextMode = "full" | "abbreviated" | "none";
export type TransitionType = "crossfade" | "hold-to-black" | "match-cut";
export type Orientation = "portrait" | "landscape" | "square";

export interface ChapterPalette {
  background: string;
  backgroundSecondary: string;
  foreground: string;
  foregroundMuted: string;
  accent: string;
}

export interface MediaItem {
  type: "photo" | "video";
  src: string;
  mobileSrc?: string;
  width: number;
  height: number;
  orientation: Orientation;
  caption?: string;
  featured?: boolean;
}

export interface ChapterSong {
  title: string;
  artist: string;
  src: string | null;
}

export interface ChapterConfig {
  slug: string;
  order: number;
  title: string;
  dateRange: string;
  location?: string;
  openingSentence: string;
  typedTextMode: TypedTextMode;
  reflection: string;
  palette: ChapterPalette;
  interfaceDensity: InterfaceDensity;
  interactionDensity: InteractionDensity;
  transitionType: TransitionType;
  song: ChapterSong;
}

export interface Chapter extends ChapterConfig {
  media: MediaItem[];
  nylaMedia: MediaItem[];
  laterMedia: MediaItem[];
}

export interface ExperienceConfig {
  title: string;
  eyebrow: string;
  lines: string[];
}

export interface CreditsConfig {
  producedBy: string[];
  starring: string[];
  specialGuest?: string;
  filmedOnLocation: string[];
  continuity: string;
  runningTime: string;
}

export interface PostCreditConfig {
  returnLine: string;
  song: ChapterSong;
  teaseLine: string;
  ticket: {
    artist: string;
    tour: string;
    date: string;
    venue: string;
    section: string;
    row: string;
  };
}
