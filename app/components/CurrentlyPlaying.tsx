'use client'
import React, { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
//@ts-ignore
import YouTubePlayer from "youtube-player";
import Image from "next/image";


type Props = {
  playVideo: boolean;
  creatorId : string;
  //@ts-ignore
  currentVideo: Video | null;
  playNextLoader: boolean;
  playNext: () => void;
};

export default function CurrentlyPlaying({
  playVideo,
  currentVideo,
  playNext,
  creatorId,
  playNextLoader,
}: Props) {
  const videoPlayerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (!videoPlayerRef.current || !currentVideo) {
      return;
    }
    let player = YouTubePlayer(videoPlayerRef.current);

    // 'loadVideoById' is queued until the player is ready to receive API calls.
    player.loadVideoById(currentVideo.extractedId);

    // 'playVideo' is queue until the player is ready to received API calls and after 'loadVideoById' has been called.
    player.playVideo();
    function eventHandler(event: any) {
      console.log(event);
      console.log(event.data);
      if (event.data === 0) {
        playNext();
      }
    }
    player.on("stateChange", eventHandler);
    return () => {
      player.destroy();
    };
  }, [currentVideo, videoPlayerRef]);

  return (
    <div className="space-y-4">
      
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-200">Now Playing</h2>
          {currentVideo ? (
            <div className="aspect-video">
              {playVideo ? (
                <>
                  {/* @ts-ignore */}
                  
                  <div ref={videoPlayerRef} className="w-full" />
                </>
              ) : (
                <>
                  <Image
                    height={288}
                    width={288}
                    alt={currentVideo.bigImg}
                    src={currentVideo.bigImg}
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
        <Button disabled={playNextLoader} onClick={playNext} className="w-full">
          <Play className="mr-2 h-4 w-4" />{" "}
          {playNextLoader ? "Loading..." : "Play next"}
        </Button>
      )}

    </div>
    
  );
}