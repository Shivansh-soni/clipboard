"use server";

import Redis from "ioredis";
import { revalidatePath } from "next/cache";
import { connectRedis } from "../redis";
import { ClipboardItem, ItemPayload } from "@/components/app-page";
import { deleteFile } from "@/lib/utils/file-upload";

// Function to connect to Redis
// export async function connectRedis() {
//     const redis = new Redis({
//         host: process.env.REDIS_HOST!,
//         port: Number(process.env.REDIS_PORT),
//     });
//     return redis;
// }

export async function addItem({
  content,
  type,
  fileName,
  fileSize,
  fileType,
  filePath,
}: ItemPayload) {
  const id = Date.now().toString();
  const redis = await connectRedis();
  const itemData: any = {
    id,
    content,
    type,
    ...(type === "file" && { fileName, fileSize, fileType, filePath }),
  };

  await redis.hset("clipboard", id, JSON.stringify(itemData));
  revalidatePath("/");

  return itemData;
}

export async function updateItem(
  id: string,
  text: string,
  type: "link" | "image" | "text" | "file",
  fileData?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    filePath?: string;
  }
) {
  const redis = await connectRedis();
  const todo = await redis.hget("clipboard", id);

  if (todo) {
    const existingData = JSON.parse(todo);
    const updatedData = {
      ...existingData,
      content: text,
      type,
      ...(type === "file" && fileData),
    };

    await redis.hset("clipboard", id, JSON.stringify(updatedData));
    revalidatePath("/");

    return updatedData as ClipboardItem;
  }
  return null;
}

export async function deleteItem(id: string): Promise<boolean> {
  const redis = await connectRedis();

  try {
    // First, get the item to check if it's a file
    const item = await redis.hget("clipboard", id);

    if (!item) {
      console.error("Item not found in Redis");
      return false;
    }

    const parsedItem = JSON.parse(item);
    let fileDeleted = true;

    // If it's a file or image, delete the associated file
    if (
      (parsedItem.type === "file" || parsedItem.type === "image") &&
      parsedItem.content
    ) {
      try {
        fileDeleted = await deleteFile(parsedItem.content);
        if (!fileDeleted) {
          console.warn(
            `File ${parsedItem.content} not found or could not be deleted`
          );
        }
      } catch (error) {
        console.error("Error deleting file:", error);
        fileDeleted = false;
      }
    }

    // Delete from Redis
    const deleted = await redis.hdel("clipboard", id);

    if (deleted) {
      // Revalidate the page cache
      revalidatePath("/");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error in deleteItem:", error);
    throw error;
  } finally {
    // ioredis handles connection pooling, no need to manually disconnect
    // unless you explicitly want to close the connection
  }
}

export async function getItems() {
  const redis = await connectRedis();
  const clipboard = await redis.hgetall("clipboard");
  return Object.values(clipboard).map((todo) => JSON.parse(todo as string));
}
