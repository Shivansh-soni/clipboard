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

import { deleteUploadedFile } from "@/lib/utils/fileUtils";
import { decrypt } from "@/lib/utils/index";

export const DELETE = async (request: NextRequest) => {
  const splitUrl = request.url.split("/");
  const finalID = splitUrl[splitUrl.length - 1];
  
  try {
    // 1. First get the item to check if it's a file/image
    const item = await prisma.clipboardItem.findUnique({
      where: { id: Number(finalID) },
    });

    if (!item) {
      return new NextResponse("Item not found", { status: 404 });
    }

    // 2. If it's a file or image, delete the associated file
    if (item.type === 'FILE' || item.type === 'IMAGE') {
      try {
        const fileData = JSON.parse(decrypt(item.content, item.iv));
        if (fileData?.filePath) {
          await deleteUploadedFile(fileData.filePath);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        // Continue with deletion even if file deletion fails
      }
    }

    // 3. Delete the database record
    await prisma.clipboardItem.delete({
      where: { id: Number(finalID) },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(error);
    return handleError(error);
  }
};
