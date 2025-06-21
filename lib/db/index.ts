import { ID, Query, type Models } from "appwrite";
import { databases } from "@/lib/appwrite";

export interface Clipboard extends Models.Document {
  name: string;
  description?: string;
  userId: string;
  isPublic: boolean;
  tags?: string[];
}

export type ClipboardItemType = "text" | "image" | "file" | "link";

export interface ClipboardItem extends Models.Document {
  clipboardId: string;
  type: ClipboardItemType;
  content: string;
  order: number;
  metadata?: Record<string, any>;
}

const DATABASE_ID = "clipboard_db";
const CLIPBOARDS_COLLECTION = "clipboards";
const CLIPBOARD_ITEMS_COLLECTION = "clipboard_items";

// Clipboard Operations
export const createClipboard = async (
  data: Omit<Clipboard, keyof Models.Document>
): Promise<Clipboard> => {
  return (await databases.createDocument(
    DATABASE_ID,
    CLIPBOARDS_COLLECTION,
    ID.unique(),
    data
  )) as unknown as Clipboard;
};

export const getClipboard = async (id: string): Promise<Clipboard> => {
  return (await databases.getDocument(
    DATABASE_ID,
    CLIPBOARDS_COLLECTION,
    id
  )) as unknown as Clipboard;
};

export const updateClipboard = async (
  id: string,
  data: Partial<Omit<Clipboard, keyof Models.Document>>
): Promise<Clipboard> => {
  return (await databases.updateDocument(
    DATABASE_ID,
    CLIPBOARDS_COLLECTION,
    id,
    data
  )) as unknown as Clipboard;
};

export const deleteClipboard = async (id: string): Promise<void> => {
  await databases.deleteDocument(DATABASE_ID, CLIPBOARDS_COLLECTION, id);
};

export const listClipboards = async ({
  userId,
  isPublic,
  search,
  limit = 10,
  offset = 0,
  orderBy = "$createdAt",
  orderType = "DESC",
}: {
  userId?: string;
  isPublic?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderType?: "ASC" | "DESC";
} = {}): Promise<{ documents: Clipboard[]; total: number }> => {
  const queries = [];

  if (userId) {
    queries.push(Query.equal("userId", userId));
  }

  if (isPublic !== undefined) {
    queries.push(Query.equal("isPublic", isPublic));
  }

  if (search) {
    queries.push(Query.search("name", search));
  }

  if (orderType === "DESC") {
    queries.push(Query.orderDesc(orderBy));
  } else {
    queries.push(Query.orderAsc(orderBy));
  }

  queries.push(Query.limit(limit));
  queries.push(Query.offset(offset));

  const response = await databases.listDocuments(
    DATABASE_ID,
    CLIPBOARDS_COLLECTION,
    queries
  );

  return {
    documents: response.documents as unknown as Clipboard[],
    total: response.total,
  };
};

// Clipboard Item Operations
export const createClipboardItem = async (
  data: Omit<ClipboardItem, keyof Models.Document>
): Promise<ClipboardItem> => {
  return (await databases.createDocument(
    DATABASE_ID,
    CLIPBOARD_ITEMS_COLLECTION,
    ID.unique(),
    data
  )) as unknown as ClipboardItem;
};

export const getClipboardItem = async (id: string): Promise<ClipboardItem> => {
  return (await databases.getDocument(
    DATABASE_ID,
    CLIPBOARD_ITEMS_COLLECTION,
    id
  )) as unknown as ClipboardItem;
};

export const updateClipboardItem = async (
  id: string,
  data: Partial<Omit<ClipboardItem, keyof Models.Document>>
): Promise<ClipboardItem> => {
  return (await databases.updateDocument(
    DATABASE_ID,
    CLIPBOARD_ITEMS_COLLECTION,
    id,
    data
  )) as unknown as ClipboardItem;
};

export const deleteClipboardItem = async (id: string): Promise<void> => {
  await databases.deleteDocument(DATABASE_ID, CLIPBOARD_ITEMS_COLLECTION, id);
};

export const listClipboardItems = async ({
  clipboardId,
  search,
  limit = 100,
  offset = 0,
  orderBy = "order",
  orderType = "ASC",
}: {
  clipboardId: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderType?: "ASC" | "DESC";
}): Promise<{ documents: ClipboardItem[]; total: number }> => {
  const queries = [Query.equal("clipboardId", clipboardId)];

  if (search) {
    queries.push(Query.search("content", search));
  }

  if (orderType === "DESC") {
    queries.push(Query.orderDesc(orderBy));
  } else {
    queries.push(Query.orderAsc(orderBy));
  }

  queries.push(Query.limit(limit));
  queries.push(Query.offset(offset));

  const response = await databases.listDocuments(
    DATABASE_ID,
    CLIPBOARD_ITEMS_COLLECTION,
    queries
  );

  return {
    documents: response.documents as unknown as ClipboardItem[],
    total: response.total,
  };
};

export const reorderClipboardItems = async (
  clipboardId: string,
  itemIds: string[]
): Promise<void> => {
  const batch: Promise<ClipboardItem>[] = [];

  itemIds.forEach((itemId, index) => {
    batch.push(updateClipboardItem(itemId, { order: index }));
  });

  await Promise.all(batch);
};

// Batch Operations
export const deleteClipboardWithItems = async (
  clipboardId: string
): Promise<void> => {
  // First, delete all items in the clipboard
  const { documents: items } = await listClipboardItems({
    clipboardId,
    limit: 1000,
  });
  const deletePromises = items.map((item) => deleteClipboardItem(item.$id));

  await Promise.all(deletePromises);

  // Then delete the clipboard itself
  await deleteClipboard(clipboardId);
};

// Utility Functions
export const getClipboardWithItems = async (
  clipboardId: string
): Promise<{
  clipboard: Clipboard;
  items: ClipboardItem[];
}> => {
  const [clipboard, { documents: items }] = await Promise.all([
    getClipboard(clipboardId),
    listClipboardItems({ clipboardId }),
  ]);

  return { clipboard, items };
};
