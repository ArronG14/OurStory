import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
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
const CONFIG_ROOT = path.join(CONTENT_ROOT, "config");
const ASSETS_ROOT = path.join(process.cwd(), "public", "assets");
const HEIC_PREVIEW_ROOT = path.join(ASSETS_ROOT, ".heic-previews");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".heic"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov"]);

function orientationFor(width: number, height: number): Orientation {
  if (Math.abs(width - height) < 4) return "square";
  return width > height ? "landscape" : "portrait";
}

function readPhotosFromDir(absDir: string, urlBase: string, chapterSlug: string, dirName: string): MediaItem[] {
  if (!fs.existsSync(absDir)) return [];

  return fs
    .readdirSync(absDir)
    .filter((file) => IMAGE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => {
      const filePath = path.join(absDir, file);
      const display = displayImageFor(filePath, file, chapterSlug, dirName);
      const dimensions = readImageDimensions(filePath);
      const width = dimensions.width ?? 1600;
      const height = dimensions.height ?? 1000;

      return {
        type: "photo" as const,
        src: display ?? `${urlBase}/${file}`,
        width,
        height,
        orientation: orientationFor(width, height),
        featured: file.startsWith("featured-"),
      };
    });
}

function displayImageFor(filePath: string, file: string, chapterSlug: string, dirName: string) {
  if (path.extname(file).toLowerCase() !== ".heic") return null;

  const previewDir = path.join(HEIC_PREVIEW_ROOT, chapterSlug, dirName);
  const previewName = `${path.basename(file, path.extname(file))}.jpg`;
  const previewPath = path.join(previewDir, previewName);

  if (!fs.existsSync(previewPath)) {
    fs.mkdirSync(previewDir, { recursive: true });
    execFileSync("sips", ["-s", "format", "jpeg", filePath, "--out", previewPath], { stdio: "ignore" });
  }

  return `/assets/.heic-previews/${chapterSlug}/${dirName}/${previewName}`;
}

function readImageDimensions(filePath: string) {
  try {
    const buffer = fs.readFileSync(filePath);
    return imageSize(buffer);
  } catch {
    return { width: 1600, height: 1000 };
  }
}

function readVideosFromDir(absDir: string, urlBase: string): MediaItem[] {
  if (!fs.existsSync(absDir)) return [];

  return fs
    .readdirSync(absDir)
    .filter((file) => VIDEO_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort()
    .map((file) => {
      const isPortrait = file.includes("-portrait");
      const width = isPortrait ? 1080 : 1920;
      const height = isPortrait ? 1920 : 1080;

      return {
        type: "video" as const,
        src: `${urlBase}/${file}`,
        width,
        height,
        orientation: orientationFor(width, height),
        featured: file.startsWith("featured-"),
      };
    });
}

function readPhotos(chapterSlug: string): MediaItem[] {
  return readMediaFromDirs(chapterSlug, "photo");
}

function readVideos(chapterSlug: string): MediaItem[] {
  return readMediaFromDirs(chapterSlug, "video");
}

function readNylaMedia(): MediaItem[] {
  return [
    ...readPhotos("08-nyla"),
    ...readVideos("08-nyla"),
  ];
}

function readMediaFromDirs(chapterSlug: string, type: "photo" | "video"): MediaItem[] {
  const dirs =
    type === "photo"
      ? [
          ["photos", "photos"],
          ["images", "images"],
        ]
      : [
          ["videos", "videos"],
          ["photos", "photos"],
          ["images", "images"],
        ];

  return dirs.flatMap(([dirName, urlName]) => {
    const absDir = path.join(ASSETS_ROOT, chapterSlug, dirName);
    const urlBase = `/assets/${chapterSlug}/${urlName}`;
    return type === "photo" ? readPhotosFromDir(absDir, urlBase, chapterSlug, dirName) : readVideosFromDir(absDir, urlBase);
  });
}

export function getChapterSlugs(): string[] {
  if (!fs.existsSync(ASSETS_ROOT)) return [];
  return fs
    .readdirSync(ASSETS_ROOT)
    .filter((entry) => !entry.startsWith(".") && entry !== "08-nyla")
    .filter((entry) => {
      const dir = path.join(ASSETS_ROOT, entry);
      return fs.statSync(dir).isDirectory() && fs.existsSync(path.join(dir, "chapter.json"));
    })
    .sort();
}

export function getChapter(slug: string): Chapter | null {
  const configPath = path.join(ASSETS_ROOT, slug, "chapter.json");
  if (!fs.existsSync(configPath)) return null;

  const config = JSON.parse(fs.readFileSync(configPath, "utf-8")) as ChapterConfig;
  const songFile = path.join(ASSETS_ROOT, slug, "song.mp3");

  return {
    ...config,
    song: {
      ...config.song,
      src: fs.existsSync(songFile) ? `/assets/${slug}/song.mp3` : null,
    },
    media: [...readPhotos(slug), ...readVideos(slug)],
    nylaMedia: slug === "07-home" ? readNylaMedia() : [],
    laterMedia: [],
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
