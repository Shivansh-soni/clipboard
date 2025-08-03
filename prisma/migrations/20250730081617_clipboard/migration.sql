-- CreateTable
CREATE TABLE "public"."Clipboard" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "pin" TEXT NOT NULL,
    "requirePinOnVisit" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clipboard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Clipboard" ADD CONSTRAINT "Clipboard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
