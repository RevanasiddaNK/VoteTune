import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth/next";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse> {
  // Get session with user id included
      const session = await getServerSession();
      const user = await prismaClient.user.findFirst({
            where: {
                email: session?.user?.email ?? "",
            }
        });

        //console.log("upvote user", user)
        if(!user){
            return NextResponse.json({
                message : "unauthenticated"
            },
            {
                status : 403,
            }
            );
        }

  try {
    const creatorId = req.nextUrl.searchParams.get("creatorId");

    // Fetch streams based on userId (session user id)
    const streams = await prismaClient.stream.findMany({
      where: {
        addedById: user.id, 
      },
      include: {
        _count: {
          select: {
            upvotes: true,
          },
        },
        upvotes: {
          where: {
            userId: user.id,
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
