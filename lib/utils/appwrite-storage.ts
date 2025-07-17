import { ID, Storage } from "appwrite";
import { storage } from "../appwrite";

// Bucket ID for storing clipboard files
const BUCKET_ID =
  process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID || "clipboard_files";

// Maximum file size (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Allowed file types and their MIME types
const ALLOWED_TYPES = {
  // Images
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",

  // Documents
  ".pdf": "application/pdf",
  ".txt": "text/plain",
  ".md": "text/markdown",
  ".csv": "text/csv",

  // Office
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".xls": "application/vnd.ms-excel",
  ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ".ppt": "application/vnd.ms-powerpoint",
  ".pptx":
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",

  // Archives
  ".zip": "application/zip",
  ".rar": "application/x-rar-compressed",
  ".7z": "application/x-7z-compressed",
  ".tar": "application/x-tar",
  ".gz": "application/gzip",
} as const;

type AllowedExtension = keyof typeof ALLOWED_TYPES;

interface FileLike {
  name: string;
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

/**
 * Uploads a file to Appwrite Storage
 * @param file The file to upload
 * @param bucketId Optional custom bucket ID
 * @returns Promise with file metadata
 */
export const uploadFile = async (
  file: FileLike,
  bucketId: string = BUCKET_ID
) => {
  try {
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(
        `File size exceeds maximum allowed size of ${
          MAX_FILE_SIZE / (1024 * 1024)
        }MB`
      );
    }

    // Validate file type
    const extension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase() as AllowedExtension;
    if (!ALLOWED_TYPES[extension]) {
      throw new Error(
        `File type not allowed. Allowed types: ${Object.keys(
          ALLOWED_TYPES
        ).join(", ")}`
      );
    }

    // Generate a unique filename
    const filename = `${ID.unique()}${extension}`;
    const fileBuffer = await file.arrayBuffer();
    const blob = new Blob([fileBuffer], { type: file.type });

    // Upload to Appwrite Storage
    const result = await storage.createFile(
      bucketId,
      ID.unique(),
      new File([blob], filename, { type: file.type })
    );

    return {
      id: result.$id,
      name: file.name,
      size: file.size,
      type: file.type,
      url: `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${result.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
      previewUrl: `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${result.$id}/preview?width=500&height=500&project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
    };
  } catch (error) {
    console.error("Error uploading file to Appwrite Storage:", error);
    throw error;
  }
};

/**
 * Deletes a file from Appwrite Storage
 * @param fileId The ID of the file to delete
 * @param bucketId Optional custom bucket ID
 * @returns Promise that resolves when the file is deleted
 */
export const deleteFile = async (
  fileId: string,
  bucketId: string = BUCKET_ID
) => {
  try {
    await storage.deleteFile(bucketId, fileId);
    return true;
  } catch (error) {
    console.error("Error deleting file from Appwrite Storage:", error);
    throw error;
  }
};

/**
 * Gets a file's metadata from Appwrite Storage
 * @param fileId The ID of the file to get
 * @param bucketId Optional custom bucket ID
 * @returns Promise with file metadata
 */
export const getFile = async (fileId: string, bucketId: string = BUCKET_ID) => {
  try {
    return await storage.getFile(bucketId, fileId);
  } catch (error) {
    console.error("Error getting file from Appwrite Storage:", error);
    throw error;
  }
};

/**
 * Gets a file's download URL
 * @param fileId The ID of the file
 * @param bucketId Optional custom bucket ID
 * @returns File download URL
 */
export const getFileDownloadUrl = (
  fileId: string,
  bucketId: string = BUCKET_ID
) => {
  return storage.getFileDownload(bucketId, fileId);
};

/**
 * Gets a file's preview URL
 * @param fileId The ID of the file
 * @param width Preview width in pixels
 * @param height Preview height in pixels
 * @param bucketId Optional custom bucket ID
 * @returns File preview URL
 */
export const getFilePreviewUrl = (
  fileId: string,
  // width: number = 500,
  // height: number = 500,
  bucketId: string = BUCKET_ID
) => {
  return storage.getFilePreview(bucketId, fileId);
};

/**
 * Lists all files in a bucket
 * @param queries Optional queries for filtering and pagination
 * @param bucketId Optional custom bucket ID
 * @returns List of files
 */
export const listFiles = async (
  queries: string[] = [],
  bucketId: string = BUCKET_ID
) => {
  try {
    return await storage.listFiles(bucketId, queries);
  } catch (error) {
    console.error("Error listing files from Appwrite Storage:", error);
    throw error;
  }
};
