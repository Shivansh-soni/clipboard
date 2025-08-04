import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import bcrypt from "bcryptjs";
import { withAuth } from "@/lib/utils/withAuth";
const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  const splitUrl = request.url.split("/");
  const finalID = splitUrl[splitUrl.length - 1];

  const clipboard = await prisma.clipboard.findUnique({
    where: {
      id: Number(finalID),
    },
    include: {
      items: true,
    },
  });
  return NextResponse.json(clipboard);
};

export const DELETE = async (request: NextRequest) => {
  const splitUrl = request.url.split("/")[2];
  const clipboard = await prisma.clipboard.delete({
    where: {
      id: Number(splitUrl),
    },
  });
  return NextResponse.json(clipboard);
};

export const PATCH = withAuth(async (request: NextRequest) => {
  const body = await request.json();
  const splitUrl = request.url.split("/");
  const finalID = splitUrl[splitUrl.length - 1];
  const payload: any = {};
  if (body.name) {
    payload.name = body.name;
  }
  if (body.description) {
    payload.description = body.description;
  }
  if (body.pin) {
    payload.pin = bcrypt.hashSync(body.pin, 10);
  }
  if (body.isActive !== null) {
    payload.isActive = body.isActive;
  }
  const clipboard = await prisma.clipboard.update({
    where: {
      id: Number(finalID),
    },
    data: payload,
  });
  return NextResponse.json(clipboard);
});
