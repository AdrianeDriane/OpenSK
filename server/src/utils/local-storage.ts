import fs from "fs/promises";
import path from "path";
import { ENV } from "../config/env";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
const UPLOADS_ROUTE = "/uploads";

function normalizeKey(key: string) {
  return key.replace(/\\/g, "/").replace(/^\/+/, "");
}

function resolveUploadPath(keyOrUrl: string) {
  const key = extractLocalStorageKey(keyOrUrl);
  if (!key) return null;

  const filePath = path.resolve(UPLOADS_DIR, key);
  const relativePath = path.relative(UPLOADS_DIR, filePath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error("Invalid upload path");
  }

  return filePath;
}

export function getUploadsDir() {
  return UPLOADS_DIR;
}

export function getUploadRoute() {
  return UPLOADS_ROUTE;
}

export async function ensureUploadsDir() {
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
}

export function getPublicUploadUrl(key: string) {
  const port = ENV.PORT || "4000";
  return `http://localhost:${port}${UPLOADS_ROUTE}/${encodeURI(normalizeKey(key))}`;
}

export function extractLocalStorageKey(keyOrUrl: string | null | undefined) {
  if (!keyOrUrl) return null;

  const normalized = normalizeKey(keyOrUrl);
  const routePrefix = `${UPLOADS_ROUTE}/`;
  const routeIndex = normalized.indexOf(routePrefix.replace(/^\//, ""));

  if (routeIndex >= 0) {
    return decodeURI(normalized.slice(routeIndex + routePrefix.length - 1));
  }

  if (normalized.startsWith("http://") || normalized.startsWith("https://")) {
    return null;
  }

  return normalized;
}

export async function uploadFileToLocalStorage(
  key: string,
  file: Express.Multer.File
) {
  const normalizedKey = normalizeKey(key);
  const filePath = resolveUploadPath(normalizedKey);

  if (!filePath) {
    throw new Error("Invalid upload key");
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, file.buffer);

  return getPublicUploadUrl(normalizedKey);
}

export async function deleteFromLocalStorage(keyOrUrl: string) {
  const filePath = resolveUploadPath(keyOrUrl);

  if (!filePath) return;

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
      throw error;
    }
  }
}
