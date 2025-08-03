import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@/lib/generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, password } = schema.parse(body);
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }
    const token = jwt.sign({ userId: user.id }, secret);
    return NextResponse.json({ user, token });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to login user" },
      { status: 500 }
    );
  }
}
