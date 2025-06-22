import { writeFile, mkdir, readFile, unlink } from "fs/promises";
import { join, extname } from "path";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

// Directory where files will be stored
const UPLOAD_DIR = join(process.cwd(), "uploads");

// Supported file types and their MIME types
const ALLOWED_TYPES = {
  // Images
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",

  // Documents
  ".pdf": "application/pdf",
  ".txt": "text/plain",

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
} as const;

type AllowedExtension = keyof typeof ALLOWED_TYPES;

interface FileLike {
  name: string;
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
}

/**
 * Saves a file to the uploads directory
 * @param file The file to save
 * @returns The URL path where the file can be accessed
 */
export async function saveFile(file: FileLike): Promise<string> {
  try {
    // Create uploads directory if it doesn't exist
    await mkdir(UPLOAD_DIR, { recursive: true });

    // Get file extension and validate it
    const fileExt = extname(file.name).toLowerCase() as AllowedExtension;
    if (!ALLOWED_TYPES[fileExt]) {
      throw new Error(`File type ${fileExt} is not allowed`);
    }

    // Read file data
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const fileName = `${randomUUID()}${fileExt}`;
    const filePath = join(UPLOAD_DIR, fileName);

    // Save file
    await writeFile(filePath, buffer);

    // Return the URL path where the file can be accessed
    return `/api/files/${fileName}`;
  } catch (error) {
    console.error("Error saving file:", error);
    throw new Error("Failed to save file");
  }
}

/**
 * Handles file requests and serves the file
 */
export async function handleFileRequest(
  req: NextRequest,
  { params }: { params: { filename: string } }
): Promise<NextResponse> {
  try {
    const { filename } = params;
    const filePath = join(UPLOAD_DIR, filename);

    // Get file extension and validate it
    const fileExt = extname(filename).toLowerCase() as AllowedExtension;
    if (!ALLOWED_TYPES[fileExt]) {
      return new NextResponse("File type not allowed", { status: 400 });
    }

    // Read the file
    const file = await readFile(filePath);
    const contentType = ALLOWED_TYPES[fileExt];

    // Return the file with appropriate headers
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("File not found", { status: 404 });
  }
}

/**
 * Validates if a file type is allowed
 */
export function isFileTypeAllowed(filename: string): boolean {
  if (!filename) return false;
  const ext = extname(filename).toLowerCase() as AllowedExtension;
  return ext in ALLOWED_TYPES;
}

/**
 * Gets a human-readable list of allowed file extensions
 */
export function getAllowedFileTypes(): string[] {
  return Object.keys(ALLOWED_TYPES);
}

/**
 * Gets the MIME type for a file based on its extension
 */
export function getContentType(filename: string): string {
  if (!filename) return "application/octet-stream";
  const ext = extname(filename).toLowerCase() as AllowedExtension;
  return ALLOWED_TYPES[ext] || "application/octet-stream";
}

/**
 * Deletes a file from the uploads directory
 * @param filename The filename to delete
 * @returns Whether the file was deleted successfully
 */
export async function deleteFile(filename: string): Promise<boolean> {
  try {
    const filePath = join(UPLOAD_DIR, filename);
    await unlink(filePath);
    return true;
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}
