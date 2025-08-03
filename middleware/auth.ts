import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@/lib/generated/prisma";
const prisma = new PrismaClient();
export const authCheck = async (req: any, next: Function, reject: Function) => {
  let token = req.headers.get("Authorization");

  if (!token) {
    console.log("inside");
    reject(new Error("Unauthorized"));
    return;
  }

  token = token.replace("Bearer ", "");

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }

  try {
    const decodedToken = jwt.verify(token, secret) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    req.user = user;
    return next();
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get user from token" },
      { status: 500 }
    );
  }
};
