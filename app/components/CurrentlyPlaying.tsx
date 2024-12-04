import { Card, CardContent } from "@/components/ui/card"
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function CurrentlyPlaying(
  {creatorId}: { creatorId: string }
) {
  const currentVideoId = 'P1fIdFRnfqw'

  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold mb-2 text-purple-800 dark:text-purple-200">Now Playing</h2>
        <div className="aspect-video">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${currentVideoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </CardContent>
    </Card>
  );

}

