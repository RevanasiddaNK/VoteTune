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
      if (playVideo) {
        await axios.post("/api/streams/next", {}, { withCredentials: true });
      }
      await getCurrentVideoData();
    } catch (error) {
      console.error("Error handling stream update:", error);
    } finally {
      setPlayNextLoader(false);
    }
  };

  const getCurrentVideoData = async () => {
    try {
      const res = await axios.get(`/api/streams?creatorId=${creatorId}`, { withCredentials: true });
      const videoData = res.data.activeStream;

      if (!videoData) {
        throw new Error("No active stream found after update.");
      }

      setCurrentVideo({
        title: videoData.title,
        url: videoData.url,
        bigThumbnail: videoData.bigThumbnail,
        smallThumbnail: videoData.smallThumbnail,
        extractedId: videoData.extractedId,
      });

    
    } catch (error) {
      console.error("Error accessing video data:", error);
    }
  };

  const REFRESH_INTERVAL_MS = 1000; 
  useEffect(() => {
    if(!playVideo){
      getCurrentVideoData()
      const interval = setInterval(getCurrentVideoData, REFRESH_INTERVAL_MS);
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    if (playVideo && currentVideo) {
      if (!videoPlayerRef.current) {
        return;
      }

      const player: PlayerInstance = YouTubePlayer(videoPlayerRef.current);
      player.loadVideoById(currentVideo.extractedId);
      player.playVideo();

      const handleStateChange = (event: any) => {
        if (event.data === 0) {
          playNext();  // Play next when current video ends
        }
      };

      player.on("stateChange", handleStateChange);

      return () => {
        player.destroy();
      };
    }
  }, [currentVideo, playVideo]);  // Trigger when currentVideo or playVideo changes

  return (
    <div className="space-y-4">
      <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-200">
            Now Playing
          </h2>
          {currentVideo ? (
            <div>
              {playVideo ? (
                <div ref={videoPlayerRef} className="w-full" />
              ) : (
                <div className="relative w-full h-72">
                  <Image
                    alt={currentVideo.title || "Video thumbnail"}
                    src={currentVideo.bigThumbnail}
                    fill
                    className="rounded object-contain"
                  />
                  <p className="mt-2 text-center font-semibold">
                    {currentVideo.title.split("|")[0].trim()}
                  </p>
                </div>
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
