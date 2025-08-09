import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { compare } from "bcrypt";
import { decrypt } from "@/lib/utils/index";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Get PIN from query parameters
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get("pin");

    if (!pin) {
      return new NextResponse("PIN is required", { status: 400 });
    }

    // 2. Get the clipboard item with its associated clipboard
    const item = await prisma.clipboardItem.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        clipboard: {
          select: {
            pin: true,
          },
        },
      },
    });

    if (!item) {
      return new NextResponse("Image not found", { status: 404 });
    }

    // 3. Verify PIN using bcrypt
    const isPinValid = await compare(pin, item?.clipboard.pin);
    if (!isPinValid) {
      return new NextResponse("Invalid PIN", { status: 403 });
    }

    // 4. Parse the file metadata from the encrypted content
    let filePath: string;
    try {
      console.log("item", decrypt(item.content, item.iv));
      const fileData: {
        filePath: string;
        originalName: string;
        mimeType: string;
        size: number;
      } = JSON.parse(decrypt(item.content, item.iv));
      filePath = fileData.filePath;
      console.log("filePath", filePath);
      // Security: Prevent directory traversal
      if (filePath.includes("..") || !filePath.startsWith("/uploads/")) {
        throw new Error("Invalid file path");
      }
    } catch (error) {
      console.error("Error parsing file data:", error);
      return new NextResponse("Invalid file data", { status: 400 });
    }

    // 5. Build the full file path
    const fullPath = join(process.cwd(), "private", filePath);
    console.log("fullPath", fullPath);
    // 6. Check if file exists
    if (!existsSync(fullPath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    // 7. Read the file
    const file = readFileSync(fullPath);
    const fileExt = filePath.split(".").pop()?.toLowerCase();

    // 8. Determine content type based on file extension
    const mimeTypes: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      gif: "image/gif",
      webp: "image/webp",
    };

    const contentType = mimeTypes[fileExt || ""] || "application/octet-stream";

    // 9. Return the file with appropriate headers
    return new NextResponse(file, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
