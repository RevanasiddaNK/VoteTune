import { prismaClient } from "app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Stream } from "stream";
import {z} from 'zod'


const upvoteSchema = z.object({
    streamId : z.string(),
})

export async function POST(req : NextRequest){

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

        try{
            const data =  upvoteSchema.parse( await req.json());
            await prismaClient.upvote.create({
                data : {
                    streamId : data?.streamId,
                    userId : user.id
                }
            })

            return NextResponse.json({
                message : "upvoted successfully"
            })
        }
        catch(err){
            return NextResponse.json({
                message : "Error at upvoting stream"
            },
            {
                status : 403,
            }
            );
        }
}
