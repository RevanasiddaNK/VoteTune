'use client'; // Ensure this file is client-side

import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import StreamView from '../components/StreamView';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

const Dashboard = () => {
  const searchParams = useSearchParams();
  const creatorId = searchParams.get('creatorId'); // Retrieve the creatorId query parameter

  // Handle invalid creatorId (if not a string)
  if (typeof creatorId !== 'string') {
    return <div>Invalid creator ID</div>; // Show error or fallback UI
  }

  return (
    <StreamView creatorId={creatorId} playVideo={true} />
  );
};

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  );
}
