'use client'
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import axios from 'axios';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

interface Video {
  id: string;
  title: string;
  url: string;
  bigThumbnail: string;
  smallThumbnail: string;
  extractedId: string;
  type: string;
  upvotesCount: number;
  active: boolean;
  userId: string;
  haveUpvoted: boolean;
}

const initialQueue: Video[] = [];

export default function SongQueue(
  {creatorId}: { creatorId: string }
) {
  const [queue, setQueue] = useState<Video[]>(initialQueue);

  const REFRESH_INTERVAL_MS = 10 * 1000; // 10 seconds

  async function refreshStreams() {
    try {
      const res = await axios.get(`/api/streams?creatorId=${creatorId}`, { withCredentials: true });
      console.log('Streams refreshed:', res.data);
      setQueue(Array.isArray(res.data.streams) ? res.data.streams.sort((a : any, b: any) => b.upvotesCount - a.upvotesCount) : []); // Ensure it's an array
    } catch (err) {
      console.error('Error refreshing streams:', err);
    }
  }

  useEffect(() => {
    refreshStreams();
    const interval = setInterval(refreshStreams, REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  const handleVote = async (id: string, isUpvoted : boolean ) => {
    try {
      await axios.post(
        `../api/streams/${isUpvoted ? 'downVote' :'upVote' }`,
        { streamId: id },
        { withCredentials: true }
      );
      refreshStreams();
    } 
    catch (err) {
      console.error('Error voting for song:', err);
    }
  };


  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-200">Upcoming Songs</h2>
        <ul className="space-y-2">
          {(Array.isArray(queue) ? [...queue] : [])
            .map(song => (
              <li
                key={song.id}
                className="flex items-center space-x-2 bg-white/70 dark:bg-gray-700/70 p-2 rounded-lg shadow"
              >
                <img
                  src={song.smallThumbnail}
                  alt={song.title}
                  className="w-20 h-12 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="font-medium text-sm text-purple-700 dark:text-purple-300">{song.title}</h3>
                </div>
                <div className="flex items-center space-x-1">
                
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(song.id, song.haveUpvoted)}
                    className={`flex items-center ${
                      !song.haveUpvoted
                        ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"
                        : "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                    } p-1`}
                  >
                    {song.haveUpvoted ? (
                      <ChevronUp className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    )}
                    <span className="ml-1 text-xs">{song.upvotesCount}</span>
                  </Button>

                </div>
              </li>
            ))}
        </ul>
      </CardContent>
    </Card>
  );
}
