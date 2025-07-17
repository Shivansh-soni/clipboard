// export type Clipboard = {
//   $id: string;
//   $createdAt: string;
//   $updatedAt: string;
//   $permissions: string[];
//   name: string;
//   description?: string;
//   userId: string;
//   isPublic: boolean;
//   tags?: string[];
// };

export type Clipboard = {
  $id: string;
  name: string;
  pin: string; // hashed
  createdBy: string; // admin $id
  createdAt: string;
  expiresAt?: string;
  requirePinOnVisit: boolean;
  lastAccessed: string;
  isActive: boolean; // soft-delete flag
};

export type ClipboardItemType = "text" | "image" | "file" | "link";

export type ClipboardItem = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $permissions: string[];
  clipboardId: string;
  type: ClipboardItemType;
  content: string;
  order: number;
  metadata?: Record<string, any>;
};

export type CreateClipboardInput = Omit<
  Clipboard,
  "$id" | "$createdAt" | "$updatedAt" | "$permissions"
>;
export type UpdateClipboardInput = Partial<CreateClipboardInput>;

export type CreateClipboardItemInput = Omit<
  ClipboardItem,
  "$id" | "$createdAt" | "$updatedAt" | "$permissions"
>;
export type UpdateClipboardItemInput = Partial<CreateClipboardItemInput>;

// Query types
export type ListClipboardsQuery = {
  userId?: string;
  isPublic?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: "name" | "$createdAt" | "$updatedAt";
  orderType?: "ASC" | "DESC";
};

export type ListClipboardItemsQuery = {
  clipboardId: string;
  search?: string;
  limit?: number;
  offset?: number;
  orderBy?: "order" | "$createdAt" | "$updatedAt";
  orderType?: "ASC" | "DESC";
};
