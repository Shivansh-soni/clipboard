"use server";

import { connectRedis } from "../redis";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export interface Clipboard {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  createdBy: string; // User ID of the creator
  // Additional metadata can be added here
}

const CLIPBOARD_PREFIX = "clipboard:";
const CLIPBOARD_INDEX_KEY = "clipboards:index";

/**
 * Creates a new clipboard
 */
export async function createClipboard({
  name,
  description,
  createdBy,
}: {
  name: string;
  description?: string;
  createdBy: string;
}): Promise<Clipboard> {
  const redis = await connectRedis();
  const id = `${CLIPBOARD_PREFIX}${randomUUID()}`;
  const now = Date.now();

  const clipboard: Clipboard = {
    id,
    name,
    description,
    isActive: true,
    createdAt: now,
    updatedAt: now,
    createdBy,
  };

  // Store the clipboard
  await redis.hset(id, clipboard as any);

  // Add to index
  await redis.sadd(CLIPBOARD_INDEX_KEY, id);

  return clipboard;
}

/**
 * Updates an existing clipboard
 */
export async function updateClipboard(
  id: string,
  updates: Partial<Omit<Clipboard, "id" | "createdAt" | "createdBy">>
): Promise<Clipboard | null> {
  const redis = await connectRedis();

  // Check if clipboard exists
  const exists = await redis.exists(id);
  if (!exists) return null;

  // Get current clipboard data
  const current = await redis.hgetall(id);

  // Prepare updated data
  const updatedClipboard: Clipboard = {
    ...current,
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: Date.now(),
  } as Clipboard;

  // Update in Redis
  await redis.hset(id, updatedClipboard as any);

  return updatedClipboard;
}

/**
 * Deletes a clipboard and all its items
 */
export async function deleteClipboard(id: string): Promise<boolean> {
  const redis = await connectRedis();

  // Check if clipboard exists
  const exists = await redis.exists(id);
  if (!exists) return false;

  // TODO: Delete all items associated with this clipboard
  // This will be implemented once we have the items structure in place

  // Remove from index
  await redis.srem(CLIPBOARD_INDEX_KEY, id);

  // Delete the clipboard
  await redis.del(id);

  return true;
}

/**
 * Gets a single clipboard by ID
 */
export async function getClipboard(id: string): Promise<Clipboard | null> {
  const redis = await connectRedis();
  const exists = await redis.exists(id);

  if (!exists) return null;

  const data = await redis.hgetall(id);
  return data as unknown as Clipboard;
}

/**
 * Lists all clipboards
 */
export async function listClipboards(): Promise<Clipboard[]> {
  const redis = await connectRedis();

  // Get all clipboard IDs from the index
  const clipboardIds = await redis.smembers(CLIPBOARD_INDEX_KEY);

  if (clipboardIds.length === 0) return [];

  // Get all clipboards in parallel
  const clipboards = await Promise.all(
    clipboardIds.map(async (id: string) => {
      const data = await redis.hgetall(id);
      return data as unknown as Clipboard;
    })
  );

  // Sort by updatedAt (newest first)
  return clipboards.sort((a, b) => b.updatedAt - a.updatedAt);
}

// Helper function to get the current user ID
// This is a placeholder - replace with your actual auth implementation
function getCurrentUserId(): string {
  // TODO: Implement proper authentication
  return "system";
}
