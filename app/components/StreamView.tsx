'use client'
import SongSubmission from '@/app/components/SongSubmission'
import SongQueue from '@/app/components//SongQueue'
import CurrentlyPlaying from '@/app/components//CurrentlyPlaying'
import ShareButton from '@/app/components//ShareButton'
import { ThemeToggle } from '@/app/components/theme-toggle'

import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function StreamView(
    {creatorId}: { creatorId: string }
) {

  
const playVideo = true;
const currentVideo = {
  extractedId: "TZ4gX0jWkI4",
  bigImg: "",
  title: "Huttu Wasteu Bodyge Full Video Song ",
};
const playNextLoader = false;
const playNext = () => {
  console.log("Play next video!");
};

   
  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900 dark:to-indigo-950 min-h-screen p-4">
      <main className="container mx-auto max-w-4xl space-y-4">
        
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-purple-800 dark:text-purple-200">
            Stream Song Voting
          </h1>
          <div className="flex space-x-2">
            <ShareButton creatorId = {creatorId} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <CurrentlyPlaying 
            creatorId = {creatorId} 
            playVideo={playVideo}
            currentVideo={currentVideo}
            playNext={playNext}
            playNextLoader={playNextLoader}
        />

          <SongSubmission  creatorId = {creatorId}/>
        
        </div>

        <SongQueue creatorId = {creatorId} />
      </main>
    </div>
  )
}

