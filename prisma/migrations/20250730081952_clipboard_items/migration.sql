-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "public"."ClipboardItemType" AS ENUM ('TEXT', 'LINK', 'FILE', 'IMAGE');

-- AlterTable
ALTER TABLE "public"."Clipboard" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "role" "public"."UserRole" NOT NULL DEFAULT 'USER';

-- CreateTable
CREATE TABLE "public"."ClipboardItem" (
    "id" SERIAL NOT NULL,
    "type" "public"."ClipboardItemType" NOT NULL,
    "content" TEXT NOT NULL,
    "clipboardId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClipboardItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."ClipboardItem" ADD CONSTRAINT "ClipboardItem_clipboardId_fkey" FOREIGN KEY ("clipboardId") REFERENCES "public"."Clipboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;
