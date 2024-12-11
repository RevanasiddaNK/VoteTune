import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req : NextRequest){

    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where: {
            email: session?.user?.email ?? "",
        }
    })

    if(!user){
        return NextResponse.json(
            {
                message : "unauthenticated"
            },
            {
                status : 403,
            }
        );
    }
    
    //const creatorId = req.nextUrl.searchParams.get("creatorId")
    const maxUpvotedStream = await prismaClient.stream.findFirst({
        where : {
            userId: user.id,
        },

        orderBy : {
            upvotes : {
                _count : "desc"
            }
        }
    })

    await prismaClient.$transaction(async (prisma) => {
        // Perform upsert
        await prisma.currentStream.upsert({
          where: {
            userId: user.id,
          },
          update: {
            title     :   maxUpvotedStream?.title,
            url          :  maxUpvotedStream?.url,
            bigThumbnail  : maxUpvotedStream?.bigThumbnail,
            smallThumbnail : maxUpvotedStream?.smallThumbnail,
            extractedId   : maxUpvotedStream?. extractedId,
          },
          create: {
            userId: user.id,
            title     :   maxUpvotedStream?.title,
            url          :  maxUpvotedStream?.url,
            bigThumbnail  : maxUpvotedStream?.bigThumbnail,
            smallThumbnail : maxUpvotedStream?.smallThumbnail,
            extractedId   : maxUpvotedStream?. extractedId,
          },
        });
      
        // Delete the stream
        if (maxUpvotedStream?.id) {
          await prisma.stream.delete({
            where: {
              id: maxUpvotedStream.id,
            },
          });
        }
    });
      

    return NextResponse.json({
        message : "maxUpvotedStream is added to currentStream "
    },{
      status : 200
    }
  );

}