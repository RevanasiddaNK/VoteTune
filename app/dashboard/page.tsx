'use client'
import StreamView from '../components/StreamView'
import { useSearchParams } from 'next/navigation';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function Dashboard() {

  const searchParams = useSearchParams(); // Access query parameters
  const creatorId = searchParams.get('creatorId'); // Get the "creatorId" query parameter


  // Check if creatorId is a string before passing it to StreamView
  if (typeof creatorId !== 'string') {
    return <div>Invalid creator ID</div>; // or any fallback UI
  }


  console.log("Checking creator Inside Dashboard");

  return (
    <StreamView creatorId={creatorId} playVideo={true} />
  );
}
