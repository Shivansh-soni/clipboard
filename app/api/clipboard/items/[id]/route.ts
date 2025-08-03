import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import { handleError } from "@/lib/utils/handleError";
const prisma = new PrismaClient();

export const GET = async (request: NextRequest) => {
  const splitUrl = request.url.split("/");
  const finalID = splitUrl[splitUrl.length - 1];

  const item = await prisma.clipboardItem.findUnique({
    where: {
      id: Number(finalID),
    },
  });
  return NextResponse.json(item);
};

// export const POST = async (request: NextRequest) => {
//   const body = await request.json();
//   const splitUrl = request.url.split("/");
//   const finalID = splitUrl[splitUrl.length - 1];

//   const { type, content, clipboardId } = body;
//   const item = await prisma.clipboardItem.create({
//     data: {
//       type,
//       content,
//       clipboardId,
//     },
//   });
//   return NextResponse.json(item);
// };

export const PATCH = async (request: NextRequest) => {
  try {
    const body = await request.json();
    const splitUrl = request.url.split("/");
    const finalID = splitUrl[splitUrl.length - 1];
    const { type, content } = body;
    const item = await prisma.clipboardItem.update({
      where: {
        id: Number(finalID),
      },
      data: {
        type,
        content,
      },
    });
    return NextResponse.json(item);
  } catch (error: any) {
    console.error(error);
    return handleError(error);
  }
};

export const DELETE = async (request: NextRequest) => {
  const splitUrl = request.url.split("/");
  const finalID = splitUrl[splitUrl.length - 1];
  try {
    const item = await prisma.clipboardItem.delete({
      where: {
        id: Number(finalID),
      },
    });
    return NextResponse.json(item);
  } catch (error: any) {
    console.error(error);
    return handleError(error);
  }
};
