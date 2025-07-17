export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
}

export interface ClipboardItem {
  id: string;
  type: "link" | "image" | "text" | "file";
  content: string;
  file?: string; // Allow both string and FileMetadata
  clipboardId?: string;
  createdAt?: string;
}

export type ItemPayload = Omit<ClipboardItem, "id">;
