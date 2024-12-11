import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";


export async function GET(req: NextRequest){

    try {
        const session = await getServerSession();
        const user = await prismaClient.user.findFirst({
            where: {
                email: session?.user?.email ?? "",
            }
        })
        //console.log("Downvote user", user)
        if(!user){
            return NextResponse.json({
                message : "unauthenticated"
            },
            {
                status : 403,
            }
            );
        }
    
        return NextResponse.json({
            user: user,
        },{
            status : 200,
        });
       
    } 
    catch (error) {
        
    }
}