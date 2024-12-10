'use client'

import StreamView from "@/app/components/StreamView";
import { Params } from "next/dist/server/request/params"
import { useParams } from "next/navigation"
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default async function dashBoard( {params} : {params : Params}) {
    let creatorId = await params.creatorId ;
    
    if (typeof creatorId !== 'string') {
        // Handle the case when creatorId is undefined or an array, for example:
        throw new Error("Invalid creatorId");
    }


    return (<>
        <StreamView  creatorId = {creatorId} />
    </>)
}