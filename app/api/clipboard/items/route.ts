import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { encrypt } from "@/lib/utils/index";
const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  const items = await prisma.clipboardItem.findMany();
  return NextResponse.json(items);
};

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { type, content, clipboardId } = body;
    if (!type || !content || !clipboardId) {
      return NextResponse.json(
        { error: "Missing type, content, or clipboardId" },
        { status: 400 }
      );
    }
    const { encryptedContent, iv } = encrypt(content);
    const item = await prisma.clipboardItem.create({
      data: {
        type,
        content: encryptedContent,
        clipboardId,
        iv,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    console.error("error", error);
    return NextResponse.json({ error: error }, { status: 500 });
    // return handleError(error);
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
