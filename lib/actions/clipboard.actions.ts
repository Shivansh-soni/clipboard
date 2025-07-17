"use server";
import { ID, Query, type Models, Storage } from "appwrite";
import { databases, storage } from "@/lib/appwrite";
import { hashPin, verifyPin } from "@/lib/security";
import { listClipboards } from "../db";
import { BaseClipboard } from "@/types/clipboard";

const STORAGE_BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

const DATABASE_ID = "clipboard_db";
const COLLECTION_ID = "clipboards";

export interface Clipboard extends BaseClipboard, Models.Document {
  tags: string[];
  isPublic: boolean;
  pin: string;
  lastAccessed: string;
}

interface CreateClipboardData {
  name: string;
  description?: string;
  userId: string;
  tags?: string[];
  isPublic: boolean;
  pin: string;
  requirePinOnVisit: boolean;
}

interface UpdateClipboardData
  extends Partial<Omit<CreateClipboardData, "pin">> {
  pin?: string;
}

type DocumentResponse = Promise<Clipboard>;

async function handleResponse<T>(
  promise: Promise<Models.Document>
): Promise<T> {
  const doc = await promise;
  return doc as unknown as T;
}

export async function createClipboard(
  data: CreateClipboardData
): Promise<Clipboard> {
  const hashedPin = await hashPin(data.pin);
  return handleResponse<Clipboard>(
    databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
      name: data.name,
      description: data.description || "",
      // expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
      // userId: data.userId,
      // tags: data.tags || [],
      // isPublic: data.isPublic,
      pin: hashedPin,
      requirePinOnVisit: data.requirePinOnVisit,
      isActive: true,
      // lastAccessed: new Date().toISOString(),
    })
  );
}

export async function getClipboardByName(name: string): Promise<BaseClipboard> {
  const res = await databases.listDocuments(DATABASE_ID, "clipboards", [
    Query.equal("name", name),
  ]);
  if (!res.documents.length) {
    throw new Error("Clipboard not found");
  }
  const doc = res.documents[0];
  return {
    $id: doc.$id,
    name: doc.name,
    description: doc.description || '',
    userId: doc.userId,
    isActive: doc.isActive,
    requirePinOnVisit: doc.requirePinOnVisit,
    createdAt: doc.$createdAt,
    updatedAt: doc.$updatedAt,
  } as BaseClipboard;
}

export async function getClipboardsByUser(
  userId: string
): Promise<Clipboard[]> {
  const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
    Query.equal("userId", userId),
    Query.equal("isActive", true),
    Query.orderDesc("$createdAt"),
  ]);
  return response.documents as unknown as Clipboard[];
}

export async function updateClipboard(
  id: string,
  data: UpdateClipboardData
): Promise<Clipboard> {
  const updateData: any = { ...data };

  if (data.pin) {
    updateData.pin = await hashPin(data.pin);
  }

  return handleResponse<Clipboard>(
    databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
      ...updateData,
      lastAccessed: new Date().toISOString(),
    })
  );
}

export async function deleteClipboard(id: string): Promise<void> {
  // Soft delete by updating isActive to false
  await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
    isActive: false,
    //  lastAccessed: new Date().toISOString(),
  });
}

export async function restoreClipboard(id: string): Promise<void> {
  await databases.updateDocument(DATABASE_ID, COLLECTION_ID, id, {
    isActive: true,
    //  lastAccessed: new Date().toISOString(),
  });
}

export async function verifyClipboardPin(
  clipboardId: string,
  pin: string
): Promise<boolean> {
  try {
    const clipboard = await databases.getDocument(DATABASE_ID, COLLECTION_ID, clipboardId) as unknown as Clipboard;
    if (!clipboard) return false;
    return verifyPin(pin, clipboard.pin);
  } catch (error) {
    console.error("Error verifying pin:", error);
    return false;
  }
}

export const getClipboards = async () => {
  const clipboards = await listClipboards();
  return clipboards;
};

import { ClipboardItem } from "@/types/clipboard";

interface AppwriteDocument extends Record<string, any> {
  $id: string;
  $collectionId: string;
  $databaseId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
}

export const getClipboardItems = async (
  clipboardId: string
): Promise<ClipboardItem[]> => {
  if (!clipboardId) {
    throw new Error("Clipboard ID is required");
  }
  try {
    const response = await databases.listDocuments<AppwriteDocument>(
      DATABASE_ID,
      "clipboard_items",
      [Query.equal("clipboardId", clipboardId), Query.orderDesc("$createdAt")]
    );
    if (!response.documents.length) {
      // throw new Error("No items found");
      return [];
    }
    return response.documents.map((doc) => ({
      id: doc.$id,
      type: doc.type,
      content: doc.content,
      file: doc.file,
      clipboardId: doc.clipboardId,
      createdAt: doc.$createdAt,
    }));
  } catch (error) {
    console.error("Error fetching clipboard items:", error);
    throw new Error("Failed to fetch clipboard items");
  }
};

export const addClipboardItem = async (data: {
  type: string;
  content: string;
  clipboardId: string;
  file?: any;
}): Promise<ClipboardItem> => {
  try {
    const response = (await databases.createDocument(
      DATABASE_ID,
      "clipboard_items",
      ID.unique(),
      {
        type: data.type,
        content: data.content,
        clipboardId: data.clipboardId,
        file: data.file || null,
      }
    )) as AppwriteDocument;

    return {
      id: response.$id,
      type: response.type,
      content: response.content,
      file: response.file,
      clipboardId: response.clipboardId,
      createdAt: response.$createdAt,
    };
  } catch (error) {
    console.error("Error adding clipboard item:", error);
    throw new Error("Failed to add item to clipboard");
  }
};

interface UploadedFile {
  $id: string;
  name: string;
  size: number;
  type: string;
  previewUrl: string;
  bucketId: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  signature: string;
  mimeType: string;
  sizeOriginal: number;
  chunksTotal: number;
  chunksUploaded: number;
}

export const uploadFile = async (fileData: {
  name: string;
  type: string;
  buffer: number[];
}): Promise<UploadedFile> => {
  try {
    if (!STORAGE_BUCKET_ID) {
      throw new Error("Storage bucket ID is not configured");
    }

    // Create a new File instance from the buffer
    const file = new File([new Uint8Array(fileData.buffer)], fileData.name, {
      type: fileData.type,
    });

    const response = (await storage.createFile(
      STORAGE_BUCKET_ID,
      ID.unique(),
      file
    )) as unknown as UploadedFile;

    // Get file preview URL
    const fileUrl = storage.getFilePreview(STORAGE_BUCKET_ID, response.$id);

    // Return the response with the preview URL
    return {
      ...response,
      previewUrl: fileUrl.toString(),
      size: response.sizeOriginal,
      type: response.mimeType,
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};

export const updateClipboardItem = async (
  id: string,
  data: { content: string; type: string }
): Promise<ClipboardItem> => {
  try {
    const response = (await databases.updateDocument(
      DATABASE_ID,
      "clipboard_items",
      id,
      {
        content: data.content,
        type: data.type,
      }
    )) as AppwriteDocument;

    return {
      id: response.$id,
      type: response.type,
      content: response.content,
      file: response.file,
      clipboardId: response.clipboardId,
      createdAt: response.$createdAt,
    };
  } catch (error) {
    console.error("Error updating clipboard item:", error);
    throw new Error("Failed to update clipboard item");
  }
};

export const deleteClipboardItem = async (id: string): Promise<void> => {
  try {
    // First, check if the item has a file
    const item = (await databases.getDocument(
      DATABASE_ID,
      "clipboard_items",
      id
    )) as AppwriteDocument;

    await databases.deleteDocument(DATABASE_ID, "clipboard_items", id);

    // If the item has a file, delete it from storage
    if (item.file?.$id && STORAGE_BUCKET_ID) {
      try {
        await storage.deleteFile(STORAGE_BUCKET_ID, item.file.$id);
      } catch (storageError) {
        console.error("Error deleting file from storage:", storageError);
        // Continue even if file deletion fails
      }
    }
  } catch (error) {
    console.error("Error deleting clipboard item:", error);
    throw new Error("Failed to delete clipboard item");
  }
};
