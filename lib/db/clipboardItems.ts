import { ItemPayload } from "@/components/app-page";
import { databases } from "@/lib/appwrite";
import { ID } from "appwrite";
import { storage } from "@/lib/appwrite";
const DATABASE_ID = "clipboard_db";
const CLIPBOARD_ITEMS_COLLECTION = "clipboard_items";

export const updateItem = async (id: string, payload: ItemPayload) => {
  const { file, ...rest } = payload;
  const updateData = {
    ...rest,
    file: file ? JSON.stringify(file) : undefined,
    previewUrl: file?.previewUrl, // Keep previewUrl at root for backward compatibility
  };

  const item = await databases.updateDocument(
    DATABASE_ID,
    CLIPBOARD_ITEMS_COLLECTION,
    id,
    updateData
  );

  // Parse the file data when returning
  if (item.file) {
    item.file = JSON.parse(item.file);
  }
  return item;
};

export const deleteItem = async (id: string, file_id: string) => {
  if (file_id) {
    await storage.deleteFile("clipboard_files", file_id);
  }
  await databases.deleteDocument(DATABASE_ID, CLIPBOARD_ITEMS_COLLECTION, id);
};

export const addItem = async (payload: ItemPayload) => {
  const { file, ...rest } = payload;
  const createData = {
    ...rest,
    file: file ? JSON.stringify(file) : undefined,
    previewUrl: file?.previewUrl, // Keep previewUrl at root for backward compatibility
  };

  const item = await databases.createDocument(
    DATABASE_ID,
    CLIPBOARD_ITEMS_COLLECTION,
    ID.unique(),
    createData
  );

  // Parse the file data when returning
  if (item.file) {
    item.file = JSON.parse(item.file);
  }
  return item;
};

export const getItems = async () => {
  const items = await databases.listDocuments(
    DATABASE_ID,
    CLIPBOARD_ITEMS_COLLECTION
  );

  // Parse the file data for each item
  return items.documents.map((doc) => ({
    ...doc,
    file: doc.file ? JSON.parse(doc.file) : undefined,
  }));
};
