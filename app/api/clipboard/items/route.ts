import { NextResponse, NextRequest } from "next/server";
import { PrismaClient, ClipboardItemType } from "@/lib/generated/prisma";
import { encrypt } from "@/lib/utils/index";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

// Helper function to get file type
const getFileType = (mimeType: string): ClipboardItemType => {
  if (mimeType.startsWith("image/")) {
    return ClipboardItemType.IMAGE;
  }
  return ClipboardItemType.FILE;
};

export const GET = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams;
  const clipboardId = params.get("clipboardId");
  const items = await prisma.clipboardItem.findMany({
    where: {
      clipboardId: Number(clipboardId),
    },
  });
  return NextResponse.json(items);
};

export const POST = async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const type = formData.get("type") as ClipboardItemType | null;
    const clipboardId = formData.get("clipboardId");
    const file = formData.get("file") as File | null;

    if (!clipboardId) {
      return NextResponse.json(
        { error: "Missing required field: clipboardId" },
        { status: 400 }
      );
    }

    let content = "";
    let iv = "";
    let itemType = type;
    let fileName = "";
    let fileType = "";
    let fileSize: number | null = null;

    if (file) {
      // Handle file upload
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      fileName = `${uuidv4()}.${fileExt}`;
      const filePath = join(process.cwd(), "private", "uploads", fileName);
      fileType = file.type;
      fileSize = file.size;

      // Ensure uploads directory exists
      const uploadsDir = join(process.cwd(), "private", "uploads");
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
      }

      // Write file to uploads directory
      await writeFile(filePath, buffer);

      // Store relative path in database
      content = `/uploads/${fileName}`;
      itemType = getFileType(file.type);
    } else {
      // Handle text content
      const textContent = formData.get("content") as string;
      if (!textContent) {
        return NextResponse.json(
          { error: "No content or file provided" },
          { status: 400 }
        );
      }

      if (!itemType) {
        itemType = textContent.match(/^https?:\/\//)
          ? ClipboardItemType.LINK
          : ClipboardItemType.TEXT;
      }

      const encrypted = encrypt(textContent);
      content = encrypted.encryptedContent;
      iv = encrypted.iv;
    }

    // Prepare content - for files, store as JSON string with metadata
    const itemContent = file
      ? encrypt(
          JSON.stringify({
            filePath: content,
            originalName: file.name,
            mimeType: fileType,
            size: fileSize,
          })
        )
      : encrypt(content);

    const item = await prisma.clipboardItem.create({
      data: {
        type: itemType as ClipboardItemType,
        content: itemContent.encryptedContent,
        iv: itemContent.iv,
        clipboardId: parseInt(clipboardId as string, 10),
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error in POST /api/clipboard/items:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
};

export const DELETE = async (request: NextRequest) => {
  const body = await request.json();
  const { itemId, clipboardId } = body;
  if (!itemId || !clipboardId) {
    return NextResponse.json(
      { error: "Missing itemId or clipboardId" },
      { status: 400 }
    );
  }
  try {
    const item = await prisma.clipboardItem.delete({
      where: {
        id: Number(itemId),
        clipboardId: Number(clipboardId),
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
    // return handleError(error);
  }
};
