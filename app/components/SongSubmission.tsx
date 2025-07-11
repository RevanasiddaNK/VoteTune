'use client'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import axios from 'axios'
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function SongSubmission(
  {playlistId}: { playlistId: string }
) {
  const [videoUrl, setVideoUrl] = useState('')
  const [previewId, setPreviewId] = useState('')
  const [loading, setLoading] = useState(false)

  async function  HandleAddSong(){
    try {
      setLoading(true);

      const res = await axios.post("../api/streams", 
        {
          playlistId : playlistId,
          url: videoUrl
        },
        { withCredentials: true },
       );

      console.log(res);
      
      setLoading(false);
      setVideoUrl('')
      setPreviewId('')
    } catch (error) {
      console.log("Error at HandleAddSong at Client side")
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    HandleAddSong(); 
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setVideoUrl(url)
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.+)/)
    if (match && match[1]) {
      setPreviewId(match[1])
    } else {
      setPreviewId('')
    }
  }

  return (
    <Card className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardContent className="p-4">
       
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="YouTube URL"
              value={videoUrl}
              onChange={handleInputChange}
              className="flex-grow bg-white/70 dark:bg-gray-700/70"
            />
            <Button type="submit" disabled = {loading} className="bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">  
              {loading ? "Loading..." : "Add"}
            </Button>
          </div>
          {previewId && (
            <div className="aspect-video mt-2">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${previewId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

