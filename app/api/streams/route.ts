
import { prismaClient } from "app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {number, z} from 'zod'

// @ts-ignore
// @ts-ignore
import  youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";


var regex =  /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;;
const YoutubeRegex = new RegExp(regex);

const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string()
});

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const data = createStreamSchema.parse(await req.json());
    //console.log("POST createStream", data);

    // Ensure URL is a YouTube URL
    const isYoutube = YoutubeRegex.test(data.url);
    //console.log(isYoutube);
    if (!isYoutube) {
      console.log("Error: Provide a URL in correct format");
      return NextResponse.json(
        {
          message: "Provide a URL in correct format",
        },
        { status: 411 }
      );
    }

    // Improved extraction of video ID for both youtube.com and youtu.be
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

    // Fetch stream details from YouTube
    const streamDetails = await youtubesearchapi.GetVideoDetails(extractedId);
    //console.log("Stream Details:", streamDetails);

    // Check if the streamDetails object is valid and contains necessary properties
    if (
      !streamDetails ||
      !streamDetails.title ||
      !streamDetails.thumbnail ||
      !streamDetails.thumbnail.thumbnails
    ) {
      return NextResponse.json(
        {
          message: "Could not fetch valid stream details from YouTube. Missing title or thumbnails.",
        },
        { status: 500 }
      );
    }

    // Process the thumbnails (if available)
    const ImageUrls = streamDetails.thumbnail.thumbnails.sort(
      (a: { width: number }, b: { width: number }) => b.width - a.width
    );

    // Create stream in the database
    const stream = await prismaClient.stream.create({
      data: {
        userId: data.creatorId ?? "",
        url: data.url || "",
        title: streamDetails.title ?? "Title not found", // Fallback for title
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
    const errorMessage = e instanceof Error ? e.message : "Unknown error";
    console.error("Error:", errorMessage);
    // console.log("Error: at adding stream");
    return NextResponse.json(
      {
        message: `Error while adding stream: ${errorMessage}`,
      },
      { status: 411 }
    );
  }
}

  
  

export async function GET(req: NextRequest) {
    try {
        // Retrieve creatorId from query params
        const creatorId = req.nextUrl.searchParams.get("creatorId") || "";

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
                },
                include : {
                    stream : true,
                }

            })
    ]);

        // Format response
        return NextResponse.json({
            streams: streams.map(({ _count, upvotes, ...rest }) => ({
                ...rest,
                upvotesCount: _count.upvotes,
                haveUpvoted: upvotes?.some((upvote) => upvote.userId === user.id) ?? false,
            })),
        });
    } catch (error) {
        console.error("Error retrieving streams:", error);
        return NextResponse.json(
            { status: "error", message: "Error retrieving streams" },
            { status: 500 }
        );
    }
}