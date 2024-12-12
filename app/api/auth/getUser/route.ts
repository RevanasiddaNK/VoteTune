import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    // Fetch session
    const session = await getServerSession();
    console.log("Session userEmail:", session?.user?.email);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "unauthenticated: session email not found" },
        { status: 403 }
      );
    }

    // Query user by email
    const user = await prismaClient.user.findFirst({
      where: {
        email: session.user.email, // Use the session email
      },
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { message: "unauthenticated: user not found" },
        { status: 403 }
      );
    }

    // Return user data if found
    return NextResponse.json(
      {
        user: user,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error at getting user data:", error.message, error.stack);

    // Handle Prisma-specific errors (optional)
    if (error.code) {
      console.error("Prisma Error Code:", error.code);
    }

    return NextResponse.json(
      {
        status: "error at getting user data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
