import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { join } from "path";
import { existsSync, readFileSync, statSync } from "fs";
import { compare } from "bcrypt";
import { decrypt } from "@/lib/utils/index";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1) Read PIN from query
    const { searchParams } = new URL(request.url);
    const pin = searchParams.get("pin");
    if (!pin) return new NextResponse("PIN is required", { status: 400 });

    // 2) Fetch item + clipboard (for hashed pin)
    const item = await prisma.clipboardItem.findUnique({
      where: { id: parseInt(params.id) },
      include: {
        clipboard: { select: { pin: true } },
      },
    });

    if (!item) return new NextResponse("File not found", { status: 404 });

    // 3) Verify PIN against hashed pin
    //  const isPinValid = await compare(pin, item.clipboard.pin);
    const isPinValid = pin === item.clipboard.pin;
    if (!isPinValid) return new NextResponse("Invalid PIN", { status: 403 });

    // 4) Decrypt and parse stored file metadata
    let filePath: string;
    let originalName: string;
    let mimeType: string | undefined;

    try {
      const fileData: {
        filePath: string;
        originalName?: string;
        mimeType?: string;
        size?: number;
      } = JSON.parse(decrypt(item.content, item.iv));

      filePath = fileData.filePath;
      originalName = fileData.originalName || "download";
      mimeType = fileData.mimeType || undefined;

      // Security guard
      if (filePath.includes("..") || !filePath.startsWith("/uploads/")) {
        throw new Error("Invalid file path");
      }
    } catch (e) {
      console.error("Error parsing file data:", e);
      return new NextResponse("Invalid file data", { status: 400 });
    }

    // 5) Resolve full path and ensure file exists
    const fullPath = join(process.cwd(), "private", filePath);
    if (!existsSync(fullPath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    // 6) Read the file (no compression/conversion)
    const fileBuffer = readFileSync(fullPath);
    const stats = statSync(fullPath);

    // 7) Build safe Content-Disposition (supports UTF-8 names)
    const asciiName = originalName.replace(/[^\x20-\x7E]/g, "_");
    const utf8Name = encodeURIComponent(originalName);
    const contentDisposition = `attachment; filename="${asciiName}"; filename*=UTF-8''${utf8Name}`;

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeType || "application/octet-stream",
        "Content-Disposition": contentDisposition,
        "Content-Length": String(stats.size),
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error serving download:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
