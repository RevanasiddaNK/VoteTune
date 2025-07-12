'use client'; // Ensure this file is client-side

import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import StreamView from '../components/StreamView';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const Dashboard = () => {
  const searchParams = useSearchParams();
  const playlistId = searchParams.get("playlistId");
  const playVideo = searchParams.get("playVideo") === "true";

  console.log("playlistId",playlistId)
  if (typeof playlistId !== 'string') {
    return <div><div>Loading...</div></div>; 
  }

  return (
    <StreamView playlistId = {playlistId} playVideo={playVideo} />
  );
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}