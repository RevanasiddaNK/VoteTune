"use client"

import StreamView from "@/app/components/StreamView";
import { Params } from "next/dist/server/request/params"
import { useParams } from "next/navigation"
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default async function dashBoard( {params} : {params : Params}) {
    const {creatorId} = await params;
    
    return (<>
        <StreamView  creatorId = {creatorId} />
    </>)
}