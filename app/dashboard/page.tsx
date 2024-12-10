'use client'
import StreamView from '../components/StreamView'
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
export default function Dashboard() {

  const creatorId = "1dbcf99c-b728-4b5a-88f4-a12c7874c59b";

  return (
    <StreamView  creatorId = {creatorId} playVideo = {false} />
  )
}

