import { join } from 'path';
import { unlink, unlinkSync } from 'fs';
import { promisify } from 'util';

const unlinkAsync = promisify(unlink);

/**
 * Safely deletes a file from the private uploads directory
 * @param filePath Relative path from the private directory (e.g., '/uploads/filename.jpg')
 * @returns Promise that resolves when the file is deleted or rejects on error
 */
export async function deleteUploadedFile(filePath: string): Promise<void> {
  try {
    if (!filePath) return;
    
    // Prevent directory traversal
    if (filePath.includes('..') || !filePath.startsWith('/uploads/')) {
      throw new Error('Invalid file path');
    }

    const fullPath = join(process.cwd(), 'private', filePath);
    await unlinkAsync(fullPath);
  } catch (error: any) {
    // Ignore "file not found" errors as the file might already be deleted
    if (error.code !== 'ENOENT') {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}

/**
 * Synchronous version of deleteUploadedFile
 * Use only when async is not an option
 */
export function deleteUploadedFileSync(filePath: string): void {
  try {
    if (!filePath) return;
    
    // Prevent directory traversal
    if (filePath.includes('..') || !filePath.startsWith('/uploads/')) {
      throw new Error('Invalid file path');
    }

    const fullPath = join(process.cwd(), 'private', filePath);
    unlinkSync(fullPath);
  } catch (error: any) {
    // Ignore "file not found" errors as the file might already be deleted
    if (error.code !== 'ENOENT') {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
}
