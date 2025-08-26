import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { join } from "path";
import { existsSync, readFileSync } from "fs";
import { decrypt } from "@/lib/utils/index";
import sharp from "sharp";
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
      select: {
        content: true,
        iv: true,
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
    const isPinValid = pin === item?.clipboard.pin;
    if (!isPinValid) {
      return new NextResponse("Invalid PIN", { status: 403 });
    }

    // 4. Parse the file metadata from the encrypted content
    let filePath: string;
    try {
      const fileData: {
        filePath: string;
      } = JSON.parse(decrypt(item.content, item.iv));
      filePath = fileData.filePath;

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
    // 6. Check if file exists
    if (!existsSync(fullPath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    // 7. Read the file
    const file = readFileSync(fullPath);
    const optimizedImage: any = await sharp(file)
      .resize(500) // resize width to 500px, auto height
      .webp({ quality: 80 }) // convert to webp with quality 80
      .toBuffer();

    const fileExt = filePath.split(".").pop()?.toLowerCase();

    // 8. Return the optimized WebP image with appropriate headers
    return new NextResponse(optimizedImage, {
      headers: {
        "Content-Type": "image/webp", // Always WebP since we're converting
        "Content-Length": optimizedImage.length.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error serving image:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
