'use client'
import SongSubmission from '@/app/components/SongSubmission'
import SongQueue from './SongQueue'
import CurrentlyPlaying from '@/app/components/CurrentlyPlaying'
import ShareButton from '@/app/components//ShareButton'
import { ThemeToggle } from '@/app/components/theme-toggle'

import { Inter } from 'next/font/google';
import { useState } from 'react'
import axios from 'axios'
const inter = Inter({ subsets: ['latin'] });

export default function StreamView(
    {playlistId, playVideo}: 
    { playlistId: string, playVideo : boolean }
){
   
  return (
    <div className="bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-900 dark:to-indigo-950 min-h-screen p-4">
      <main className="container mx-auto max-w-4xl space-y-4">
        
        <div className="flex justify-between items-center mb-4">
        
          <div className="flex space-x-2">
            <ShareButton playlistId = {playlistId} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
          
          <CurrentlyPlaying playlistId={playlistId} playVideo = {playVideo} />

          <SongSubmission  playlistId = {playlistId}/>
        
        </div>

        <SongQueue playlistId = {playlistId} />
      </main>
    </div>
  )

}

