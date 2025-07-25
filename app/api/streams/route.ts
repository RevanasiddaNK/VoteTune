import { prismaClient } from "app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { boolean, z } from "zod";

// @ts-ignore
import youtubesearchapi from "youtube-search-api";
import { getServerSession } from "next-auth";
import Cors from 'cors';

// Initialize the CORS middleware
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  origin: 'http://localhost:3000', // The frontend domain you're allowing
});


var regex = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/;
const YoutubeRegex = new RegExp(regex);

function getYouTubeVideoID(url:string) {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S+?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[^\s]*)/;
  const match = url.match(regex);
  return match ? match[1] : null; // Return the video ID or null if not found
}

// Define the schema for creating a stream
const createStreamSchema = z.object({
  playlistId: z.string(),
  url: z.string(),
});



export async function POST(req: NextRequest): Promise<NextResponse> {
  try {

    const session = await getServerSession();
        if (!session || !session.user?.email) {
            return NextResponse.json(
                { status: 401, message: "User not authenticated" },
                { status: 401 }
            );
        }

        // Fetch user from database
        const userData = await prismaClient.user.findFirst({
            where: { email: session.user.email },
        });

        if (!userData) {
            return NextResponse.json(
                { status: 404, message: "User not found" },
                { status: 404 }
            );
        }

    const data = createStreamSchema.parse(await req.json());
    console.log("POST createStream", data);

    const existingCount = prismaClient.stream.count({
      where : {
        playlistId : data.playlistId,
        addedById : userData.id
      }
    });

   if ( await existingCount >= 5) {
    return NextResponse.json(
      { message: "You can only add up to 5 currently existing songs in this playlist." },
      { status: 400 }
      );
  }


    const playlist = await prismaClient.playlist.findUnique({
      where: { id: data.playlistId }
    });

    if (!playlist) {
      return NextResponse.json({ message: "Invalid playlistId" }, { status: 404 });
    }


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

    const extractedId =  getYouTubeVideoID(data.url);

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
      console.log("Warning: Missing YouTube details or thumbnails. Using default thumbnails.");
      // Fallback to default thumbnail URLs if no valid thumbnails are found
        

      const stream = await prismaClient.stream.create({
        data: {
          addedById : userData.id,
          playlistId : data.playlistId,
          url: data.url || "",
          title: streamDetails?.title ?? "Title not found", 
          smallThumbnail: `https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`,
          bigThumbnail:`https://img.youtube.com/vi/${extractedId}/hqdefault.jpg`,
          extractedId: extractedId,
          type: "Youtube",
        },
      });

      console.log("Stream added with default thumbnails:", stream);

      return NextResponse.json({
        message: "Stream added with default thumbnails",
        id: stream.id,
      });
    }

    console.log("Stream details:", streamDetails);

    const ImageUrls = streamDetails.thumbnail.thumbnails.sort(
      (a: { width: number }, b: { width: number }) => b.width - a.width
    );

    // Use default thumbnails if the sorted ImageUrls array is empty
    const smallThumbnail = ImageUrls.length > 1 ? ImageUrls[1].url : "" ;
    const bigThumbnail = ImageUrls.length > 0 ? ImageUrls[0].url : ""  ;

    const stream = await prismaClient.stream.create({
      data: {
        addedById : userData.id,
        playlistId : data.playlistId,
        url: data.url || "",
        title: streamDetails.title ?? "Title not found", 
        smallThumbnail,
        bigThumbnail,
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
    console.error("Error creating stream:", e instanceof Error? e.message : e );
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
    
      const playlistId = req.nextUrl.searchParams.get("playlistId") || "";
      console.log(playlistId)
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

      if (!playlistId) {
          return NextResponse.json(
              { status: 403, message: "Invalid creator" },
              { status: 403 }
          );
      }
      const playlist = await prismaClient.playlist.findUnique({
        where: { id: playlistId },
      });

    if (!playlist) {
      return NextResponse.json(
        { message: "Playlist not found" },
        { status: 404 }
      );
    }

       
              // --- inputs ---
        // playlistId : string  ( required, comes from the query or params)
        // user       : { id: string }  (logged‑in user)

        const [streams, activeStream] = await Promise.all([
          prismaClient.stream.findMany({
            where: { playlistId },
            include: {
              _count: { select: { upvotes: true } },
              upvotes: { where: { userId: user.id } },
            },
            orderBy: { createdAt: "asc" }, 
          }),

          prismaClient.currentStream.findUnique({
            where: { playlistId }, 
          }),
        ]);



        return NextResponse.json({
          streams: streams.map(({ _count, upvotes, ...rest }) => ({
            ...rest,
            upvotesCount: _count.upvotes,
            haveUpvoted:
              upvotes?.some((upvote) => upvote.userId === user.id) ?? false,
          })),
          activeStream,
        });

     
    }catch (error) {
      console.log("Error retrieving streams");
      
      // Returning proper JSON response with status code 500
      return NextResponse.json(
        { message: "Error retrieving streams" },
        { status: 500 }
    );
  }
}
