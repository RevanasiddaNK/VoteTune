'use client';

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
// @ts-ignore
import YouTubePlayer, { YouTubePlayer as PlayerInstance } from "youtube-player";
import Image from "next/image";
import axios from "axios";

type Video = {
  title: string;
  url: string;
  bigThumbnail: string;
  smallThumbnail: string;
  extractedId: string;
};

export default function CurrentlyPlaying({
  creatorId,
  playVideo,
}: {
  creatorId: string;
  playVideo: boolean;
}) {
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [playNextLoader, setPlayNextLoader] = useState(false);
  const videoPlayerRef = useRef<HTMLDivElement | null>(null);

  const playNext = async () => {
    try {
      setPlayNextLoader(true);
      const res = await axios.get("/api/streams/next", { withCredentials: true });
      const videoData = res.data.stream;
      setCurrentVideo({
        title: videoData.title,
        url: videoData.url,
        bigThumbnail: videoData.bigThumbnail,
        smallThumbnail: videoData.smallThumbnail,
        extractedId: videoData.extractedId,
      });
    } catch (error) {
      console.error("Error fetching next video:", error);
    } finally {
      setPlayNextLoader(false);
    }
  };




 


  useEffect(() => {
    if (!videoPlayerRef.current || !currentVideo) {
      return;
    }

    const player: PlayerInstance = YouTubePlayer(videoPlayerRef.current);
    player.loadVideoById(currentVideo.extractedId);
    player.playVideo();

    const handleStateChange = (event: any) => {
      if (event.data === 0) {
        // Video ended, play the next one
        playNext();
      }
    };

    player.on("stateChange", handleStateChange);

    return () => {
      player.destroy();
    };
  }, [currentVideo]);

  return (
    <div className="space-y-4">
      
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">

        <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-200">
                Now Playing
        </h2>
          {currentVideo ? (
             <div className="aspect-video">
              { playVideo ? (
                <div ref={videoPlayerRef} className="w-full" />
              ) : (
                <>
                  <Image
                    height={288}
                    width={288}
                    alt={currentVideo?.title || "Video thumbnail"}
                    src={currentVideo.bigThumbnail}
                    className="h-72 w-full rounded object-cover"
                  />
                  <p className="mt-2 text-center font-semibold">
                    {currentVideo.title}
                  </p>
                </>
              )}
            </div>
          ) : (
            <p className="py-8 text-center">No video playing</p>
          )}
        </CardContent>
      </Card>
      {playVideo && (
        <Button
          disabled={playNextLoader}
          onClick={playNext}
          className="w-full"
          aria-label="Play the next video"
        >
          <Play className="mr-2 h-4 w-4" />
          {playNextLoader ? "Loading..." : "Play next"}
        </Button>
      )}
    </div>
  );
}
