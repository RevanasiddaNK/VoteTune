'use client';

import StreamView from "@/app/components/StreamView";
import { Inter } from 'next/font/google';
import { useSearchParams } from "next/navigation";

const inter = Inter({ subsets: ['latin'] });

export default function dashBoard() {
    const searchParams = useSearchParams(); // Access the route parameters using the hook
    const playlistId = searchParams.get("playlistId");
    const playVideo = searchParams.get("playVideo") === "true";

    if (!playlistId|| typeof playlistId !== 'string') {
        throw new Error("Invalid creatorId");
    }

    return (
        <>
            <StreamView playlistId={playlistId} playVideo={playVideo} />
        </>
    );
}
