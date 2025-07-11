'use client';

import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareButton({ playlistId }: { playlistId: string }) {
  const handleShare = () => {
    const shareableLink = `${window.location.origin}/dashboard?playlistId=${playlistId}`;

    navigator.clipboard
      .writeText(shareableLink)
      .then(() => toast.success('Link copied! Send it to your friends 🎵'))
      .catch(() => toast.error('Could not copy link'));
  };

  return (
    <Button
      onClick={handleShare}
      size="sm"
      className="flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700"
    >
      <Share2 className="h-3 w-3" />
      <span className="text-xs">Share</span>
    </Button>
  );
}
