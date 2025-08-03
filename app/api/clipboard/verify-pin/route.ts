import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";
import { handleError } from "@/lib/utils/handleError";
const prisma = new PrismaClient();

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { pin, clipboardId } = body;
    if (!pin || !clipboardId) {
      return NextResponse.json(
        { error: "Missing pin or clipboardId" },
        { status: 400 }
      );
    }
    const clipboard = await prisma.clipboard.findUnique({
      where: {
        id: Number(clipboardId),
      },
    });
    if (!clipboard) {
      return NextResponse.json(
        { error: "Clipboard not found" },
        { status: 404 }
      );
    }
    const isMatch = await bcrypt.compare(pin, clipboard.pin);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid pin" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Pin verified successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return handleError(error);
  }
};
