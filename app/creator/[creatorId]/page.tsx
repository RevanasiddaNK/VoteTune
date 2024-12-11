'use client';

import StreamView from "@/app/components/StreamView";
import { useParams } from "next/navigation";
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function dashBoard() {
    const params = useParams(); // Access the route parameters using the hook
    const creatorId = params?.creatorId;

    // Validate that `creatorId` is a string
    if (!creatorId || typeof creatorId !== 'string') {
        throw new Error("Invalid creatorId");
    }

    return (
        <>
            <StreamView creatorId={creatorId} playVideo={false} />
        </>
    );
}
