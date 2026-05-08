/**
 * Persistent key-value store.
 * - Production (Vercel): Upstash Redis via UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
 * - Local dev (no env vars): falls back to the JSON files in /data
 */

import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Product } from "@/lib/types";

const CUSTOM_PATH = path.join(process.cwd(), "data", "custom-products.json");
const DELETED_PATH = path.join(process.cwd(), "data", "deleted-products.json");

const isRedisConfigured =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

/* ── Redis helpers (lazy-loaded so local dev never imports the module) ── */

async function redisGet<T>(key: string): Promise<T | null> {
  const { Redis } = await import("@upstash/redis");
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  return redis.get<T>(key);
}

async function redisSet(key: string, value: unknown): Promise<void> {
  const { Redis } = await import("@upstash/redis");
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  await redis.set(key, value);
}

/* ── Public API ─────────────────────────────────────────────────────── */

function safeProductArray(raw: unknown): Product[] {
  if (!raw) return [];
  // If it came back as a string (e.g. from manual curl seeding), parse it
  if (typeof raw === "string") {
    try { return JSON.parse(raw) as Product[]; } catch { return []; }
  }
  // Guard against character-array corruption (array of strings/non-objects)
  if (Array.isArray(raw)) {
    const objs = raw.filter((item) => item && typeof item === "object" && !Array.isArray(item) && "id" in item);
    if (objs.length > 0) return objs as Product[];
    return [];
  }
  return [];
}

function safeStringArray(raw: unknown): string[] {
  if (!raw) return [];
  if (typeof raw === "string") {
    try { return JSON.parse(raw) as string[]; } catch { return []; }
  }
  if (Array.isArray(raw)) return raw.filter((s) => typeof s === "string");
  return [];
}

export async function getCustomProducts(): Promise<Product[]> {
  if (isRedisConfigured) {
    return safeProductArray(await redisGet<unknown>("custom-products"));
  }
  try {
    return JSON.parse(await readFile(CUSTOM_PATH, "utf-8")) as Product[];
  } catch {
    return [];
  }
}

export async function setCustomProducts(products: Product[]): Promise<void> {
  if (isRedisConfigured) {
    await redisSet("custom-products", products);
    return;
  }
  await writeFile(CUSTOM_PATH, JSON.stringify(products, null, 2), "utf-8");
}

export async function getDeletedIds(): Promise<string[]> {
  if (isRedisConfigured) {
    return safeStringArray(await redisGet<unknown>("deleted-ids"));
  }
  try {
    return JSON.parse(await readFile(DELETED_PATH, "utf-8")) as string[];
  } catch {
    return [];
  }
}

export async function setDeletedIds(ids: string[]): Promise<void> {
  if (isRedisConfigured) {
    await redisSet("deleted-ids", ids);
    return;
  }
  await writeFile(DELETED_PATH, JSON.stringify(ids, null, 2), "utf-8");
}
