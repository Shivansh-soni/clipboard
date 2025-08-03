import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { PrismaClient, UserRole } from "@/lib/generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  let token = request.headers.get("Authorization");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  token = token.replace("Bearer ", "");
  try {
    const decodedToken = jwt.verify(token, secret) as { userId: number };
    const user = await prisma.user.findUnique({
      where: { id: decodedToken.userId },
    });
    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to get user from token" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  let token = request.headers.get("Authorization");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  token = token.replace("Bearer ", "");
  const body = await request.json();
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

    let payload = {
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      password: user.password,
    };

    if (body.password) {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      payload.password = hashedPassword;
    }
    if (body.name) {
      payload.name = body.name;
    }
    if (body.role) {
      payload.role = body.role;
    }
    if (body.isActive !== null) {
      payload.isActive = body.isActive;
    }
    const updatedUser = await prisma.user.update({
      where: { id: decodedToken.userId },
      data: payload,
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
