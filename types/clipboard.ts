export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface BaseClipboard {
  $id: string;
  name: string;
  description?: string;
  userId: string;
  isActive: boolean;
  requirePinOnVisit: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClipboardItem {
  id: string;
  type: "link" | "image" | "text" | "file";
  content: string;
  file?: string | FileMetadata;
  clipboardId?: string;
  createdAt?: string;
}

export type ItemPayload = Omit<ClipboardItem, "id">;
