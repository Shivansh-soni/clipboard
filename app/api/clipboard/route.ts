import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { withAuth } from "@/lib/utils/withAuth";
const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  const clipboards = await prisma.clipboard.findMany();
  return NextResponse.json(clipboards);
};

export const POST = withAuth(async (request: NextRequest) => {
  const body = await request.json();
  const { name, description, pin, userId } = body;
  const clipboard = await prisma.clipboard.create({
    data: {
      name,
      description,
      pin,
      userId,
    },
  });
  return NextResponse.json(clipboard);
});

export const DELETE = withAuth(async (request: NextRequest) => {
  const body = await request.json();
  const { id } = body;
  try {
    const clipboard = await prisma.clipboard.delete({
      where: {
        id: Number(id),
      },
    });
    return NextResponse.json(clipboard);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
});
