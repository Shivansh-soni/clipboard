import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import jwt from "jsonwebtoken";

// Uncomment for NextAuth
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Helper to get user ID from JWT
async function getUserIdFromRequest(
  request: NextRequest
): Promise<number | null> {
  // Try JWT token first
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (token) {
    try {
      const secret = process.env.JWT_SECRET;
      if (!secret) throw new Error("JWT_SECRET not set");
      const decoded = jwt.verify(token, secret) as { userId: number };
      return decoded.userId;
    } catch (error) {
      console.error("JWT verification failed:", error);
    }
  }

  // Uncomment for NextAuth
  /*
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.id) {
      return parseInt(session.user.id);
    }
  } catch (error) {
    console.error("NextAuth session error:", error);
  }
  */

  return null;
}

// POST: Create new feedback
export async function POST(request: NextRequest) {
  try {
    // Get user ID from either JWT or NextAuth
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await request.json();
    const { review, rating } = body;

    // Input validation
    if (!review || typeof review !== "string" || review.trim().length < 10) {
      return new NextResponse("Review must be at least 10 characters long", {
        status: 400,
      });
    }

    if (
      typeof rating !== "number" ||
      rating < 1 ||
      rating > 5 ||
      !Number.isInteger(rating)
    ) {
      return new NextResponse("Rating must be an integer between 1 and 5", {
        status: 400,
      });
    }

    // Create feedback
    const feedback = await prisma.feedbacks.create({
      data: {
        review: review.trim(),
        rating,
        userId: userId,
      },
      select: {
        id: true,
        review: true,
        rating: true,
        createdAt: true,
      },
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// GET: Get all feedbacks (admin only)
export async function GET(request: NextRequest) {
  try {
    // Get user ID from either JWT or NextAuth
    const userId = await getUserIdFromRequest(request);
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (user?.role !== "ADMIN") {
      return new NextResponse("Forbidden: Admin access required", {
        status: 403,
      });
    }

    // Get all feedbacks with user details
    const feedbacks = await prisma.feedbacks.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(feedbacks);
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
