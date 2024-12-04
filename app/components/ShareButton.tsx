'use client'

import { Button } from "@/components/ui/button"
import { Share2 } from 'lucide-react'
import toast from 'react-hot-toast';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

//ToDo : add copy link feature too
export default function ShareButton(
  {creatorId} : { creatorId: string }
) {
  //const creatorId = "e28bed57-2f14-4ff8-a8d2-fa4cfb8fae3e";
  const handleShare = () => {
    // if (navigator.share) {
    if(1){
      const shareableLink = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/creator/${creatorId}`;
      
      navigator.clipboard.writeText(shareableLink)
      .then(() => {
        toast.success("Link copied to the clipboard")
        console.log('Thanks for sharing!');
      })
      .catch(console.error);
/*
      navigator.share({
        title: 'Join our stream and vote for the next song!',
        url: shareableLink
      })
*/

    } else {
      alert(`Share this link with your friends: ${window.location.pathname}/creator/${creatorId}`);
    }
  }

  return (
    <Button onClick={handleShare} size="sm" className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600">
      <Share2 className="h-3 w-3" />
      <span className="text-xs">Share</span>
    </Button>
  )
}

