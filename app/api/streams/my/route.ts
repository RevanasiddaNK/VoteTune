import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Get session with user id included
  const session = await getServerSession();

  if (!session?.user?.email || !session?.user?.id) {
    return NextResponse.json(
      {
        message: "unauthenticated",
      },
      {
        status: 403,
      }
    );
  }

  try {
    const creatorId = req.nextUrl.searchParams.get("creatorId");

    // Fetch streams based on userId (session user id)
    const streams = await prismaClient.stream.findMany({
      where: {
        userId: session.user.id, // Now using session.user.id
      },
      include: {
        _count: {
          select: {
            upvotes: true,
          },
        },
        upvotes: {
          where: {
            userId: session.user.id,
          },
        },
      },
    });

    return NextResponse.json({
      streams: streams.map(({ _count, ...rest }) => ({
        ...rest,
        upvotesCount: _count.upvotes,
        haveUpvoted: rest.upvotes.length ? true : false,
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error retrieving streams" },
      {
        status: 500,
      }
    );
  }
}
