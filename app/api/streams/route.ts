
import { prismaClient } from "app/lib/db";
import { NextRequest, NextResponse } from "next/server";
import {number, z} from 'zod'

// @ts-ignore
import  youtubesearchapi from "youtube-search-api";

var regex = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\/?\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/g;
const YoutubeRegex = new RegExp(regex);

const createStreamSchema = z.object({
    creatorId: z.string(),
    url: z.string().refine(
        (value) =>
            value.includes("youtube.com") || value.includes("spotify.com"),
        {
            message: "URL must be from YouTube or Spotify",
        }
    ),
});

export async function POST(req : NextRequest, res : NextResponse){
    
    try{
       const data = createStreamSchema.parse(await req.json());
       
        const isYoutube = YoutubeRegex.test(data.url);
        //console.log("isYoutube", isYoutube);
        
        if(!isYoutube){
            return NextResponse.json(
                {
                    message: "provide a URL in correct format",
                },
                { status: 411 }
            );
        }

        const extractedId = await data.url.split("?v=")[1];
        //console.log("extractedId", extractedId)
    
        const streamDetails = await youtubesearchapi.GetVideoDetails(extractedId);
        
        if (!streamDetails || !streamDetails?.title || !streamDetails?.thumbnail?.thumbnails) {
            return NextResponse.json(
                {
                    message: "Could not fetch valid thumbnail data from YouTube",
                },
                { status: 500 }
            );
        }
        
        //console.log(streamDetails.title);
        const ImageUrls = streamDetails?.thumbnail?.thumbnails
        .sort((a: { width: number }, b: { width: number }) => b.width - a.width);
        //console.log(ImageUrls)

        const stream = await prismaClient.stream.create({
        data : {
            userId : data.creatorId || "",
            url : data.url || "",
            title : streamDetails.title || "Title not found",
            smallThumbnail : (ImageUrls.length > 1 ) ? ImageUrls[1].url :  ImageUrls[0].url,
            bigThumbnail : ImageUrls[ 0 ].url,
            extractedId : extractedId,
            type : "Youtube"
        }
        })

        //console.log(stream);
      return NextResponse.json({
        message : "Stream added",
        id : stream.id,
        stream
      })

    }
    catch(e){
        const errorMessage = e instanceof Error ? e.message : 'Unknown error';
        console.error('Error:', errorMessage);
        return NextResponse.json(
            {
                message: "Error while adding stream",
            },
            { status: 411 }
        );
    }
}

export async function GET(req :NextRequest){
    try {
        const creatorId = req.nextUrl.searchParams.get("creatorId")

        const streams = await prismaClient.stream.findMany({
            where : {
                userId : creatorId || "",
           }
        })

       return NextResponse.json({streams});
          
    } 
    catch (error) {
        return NextResponse.json({ status : "error at retrieving stream"},{
            status: 500
        })
    }
}