import { prismaClient } from "app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// @ts-ignore
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";

var regex = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;
const YoutubeRegex = new RegExp(regex);

// Define the schema for creating a stream
const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = createStreamSchema.parse(await req.json());
    console.log("POST createStream", data);

    const isYoutube = YoutubeRegex.test(data.url);
    if (!isYoutube) {
      console.log("Error: Provide a URL in correct format");
      return NextResponse.json(
        {
          message: "Provide a URL in correct format",
        },
        { status: 411 }
      );
    }

    const extractedId = (() => {
      const match = data.url.match(
        /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/]+\/[^\/]+|(?:v|e(?:mbed)?)\/|(?:watch\?v=))|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      return match ? match[1] : null;
    })();

    if (!extractedId) {
      console.log("Error2: Invalid YouTube URL format");
      return NextResponse.json(
        {
          message: "Invalid YouTube URL format",
        },
        { status: 411 }
      );
    }


    const streamDetails = await youtubesearchapi.GetVideoDetails(extractedId);
    console.log("Stream details:", streamDetails);
    
    if (!streamDetails || !streamDetails.thumbnail || !streamDetails.thumbnail.thumbnails) {
      console.log("Error3: Missing YouTube details or thumbnails");
      return NextResponse.json(
        {
          message: "Could not fetch valid stream details from YouTube. Missing title or thumbnails.",
        },
        { status: 500 }
      );
    }

    const ImageUrls = streamDetails.thumbnail.thumbnails.sort(
      (a: { width: number }, b: { width: number }) => b.width - a.width
    );

    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId ?? "",
        url: data.url || "",
        title: streamDetails.title ?? "Title not found", 
        smallThumbnail: ImageUrls.length > 1 ? ImageUrls[1].url : ImageUrls[0].url,
        bigThumbnail: ImageUrls[0].url,
        extractedId: extractedId,
        type: "Youtube",
      },
    });

    console.log("Stream added:", stream);

    return NextResponse.json({
      message: "Stream added",
      id: stream.id,
    });
  } catch (e) {
    console.error("Error creating stream:", e);
    return NextResponse.json(
      {
        message: "Error while adding stream",
      },
      { status: 411 }
    );
  }
}


export async function GET(req: NextRequest) {
  try {
      // Retrieve creatorId from query params
      const creatorId = req.nextUrl.searchParams.get("creatorId") || "";
      console.log(creatorId)
      // Fetch current user session
      const session = await getServerSession();
      if (!session || !session.user?.email) {
          return NextResponse.json(
              { status: 401, message: "User not authenticated" },
              { status: 401 }
          );
      }

      // Fetch user from database
      const user = await prismaClient.user.findFirst({
          where: { email: session.user.email },
      });

      if (!user) {
          return NextResponse.json(
              { status: 404, message: "User not found" },
              { status: 404 }
          );
      }

      if (!creatorId) {
          return NextResponse.json(
              { status: 403, message: "Invalid creator" },
              { status: 403 }
          );
      }

      // Fetch streams for the creator
      const [streams, activeStream] = await Promise.all([ 
           await prismaClient.stream.findMany({
              where: { userId: creatorId },
              include: {
                  _count: { select: { upvotes: true } },
                  upvotes: { where: { userId: user.id } },
              },
          }),

          await prismaClient.currentStream.findFirst({
              where : {
                  userId: creatorId,
              }
          })
      ]);
     // console.log("Streams", streams, activeStream)

      // Format response
      return NextResponse.json({
          streams: streams.map(({ _count, upvotes, ...rest }) => ({
              ...rest,
              upvotesCount: _count.upvotes,
              haveUpvoted: upvotes?.some((upvote) => upvote.userId === user.id) ?? false,
          })),
          activeStream: activeStream
      });
  } catch (error) {
      console.log("Error retrieving streams");
      
      // Returning proper JSON response with status code 500
      return NextResponse.json(
        { message: "Error retrieving streams" },
        { status: 500 }
    );
  }
}
