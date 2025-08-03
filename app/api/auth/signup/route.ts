import { NextResponse, NextRequest } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@/lib/generated/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const prisma = new PrismaClient();

const schema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  password: z.string().min(6),
});

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, name, password } = schema.parse(body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!);
    return NextResponse.json({ user, token });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
