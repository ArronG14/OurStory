import fs from "fs";
import path from "path";
import { imageSize } from "image-size";
import type {
  Chapter,
  ChapterConfig,
  MediaItem,
  Orientation,
  ExperienceConfig,
  CreditsConfig,
  PostCreditConfig,
} from "./types";

const CONTENT_ROOT = path.join(process.cwd(), "public", "content");
const CHAPTERS_ROOT = path.join(CONTENT_ROOT, "chapters");
const CONFIG_ROOT = path.join(CONTENT_ROOT, "config");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm", ".mov"]);

function orientationFor(width: number, height: number): Orientation {
  if (Math.abs(width - height) < 4) return "square";
  return width > height ? "landscape" : "portrait";
}

function readPhotos(chapterSlug: string): MediaItem[] {
  const dir = path.join(CHAPTERS_ROOT, chapterSlug, "photos");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => {
      const filePath = path.join(dir, file);
      const buffer = fs.readFileSync(filePath);
      const dimensions = imageSize(buffer);
      const width = dimensions.width ?? 1600;
      const height = dimensions.height ?? 1000;

      return {
        type: "photo" as const,
        src: `/content/chapters/${chapterSlug}/photos/${file}`,
        width,
        height,
        orientation: orientationFor(width, height),
        featured: file.startsWith("featured-"),
      };
    });
}

function readVideos(chapterSlug: string): MediaItem[] {
  const dir = path.join(CHAPTERS_ROOT, chapterSlug, "videos");
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir)
    .filter((file) => VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => {
      const isPortrait = file.includes("-portrait");
      const width = isPortrait ? 1080 : 1920;
      const height = isPortrait ? 1920 : 1080;

      return {
        type: "video" as const,
        src: `/content/chapters/${chapterSlug}/videos/${file}`,
        width,
        height,
        orientation: orientationFor(width, height),
        featured: file.startsWith("featured-"),
      };
    });
}

export function getChapterSlugs(): string[] {
  if (!fs.existsSync(CHAPTERS_ROOT)) return [];
  return fs
    .readdirSync(CHAPTERS_ROOT)
    .filter((entry) => fs.statSync(path.join(CHAPTERS_ROOT, entry)).isDirectory())
    .sort();
}

export function getChapter(slug: string): Chapter | null {
  const configPath = path.join(CHAPTERS_ROOT, slug, "chapter.json");
  if (!fs.existsSync(configPath)) return null;

  const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as ChapterConfig;
  const songFile = path.join(CHAPTERS_ROOT, slug, "song.mp3");

  return {
    ...config,
    song: {
      ...config.song,
      src: fs.existsSync(songFile) ? `/content/chapters/${slug}/song.mp3` : null,
    },
    media: [...readPhotos(slug), ...readVideos(slug)],
  };
}

export function getAllChapters(): Chapter[] {
  return getChapterSlugs()
    .map((slug) => getChapter(slug))
    .filter((chapter): chapter is Chapter => chapter !== null)
    .sort((a, b) => a.order - b.order);
}

export function getExperienceConfig(): ExperienceConfig {
  const file = path.join(CONFIG_ROOT, "experience.json");
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function getCreditsConfig(): CreditsConfig {
  const file = path.join(CONFIG_ROOT, "credits.json");
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function getPostCreditConfig(): PostCreditConfig {
  const file = path.join(CONFIG_ROOT, "post-credit.json");
  return JSON.parse(fs.readFileSync(file, "utf-8"));
}

export function getLetterText(): string {
  const file = path.join(CONTENT_ROOT, "letter.txt");
  if (!fs.existsSync(file)) return "";
  return fs.readFileSync(file, "utf-8");
}
