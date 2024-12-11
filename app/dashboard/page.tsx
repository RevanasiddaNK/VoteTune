'use client'
import StreamView from '../components/StreamView'
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
export default function Dashboard() {

  const creatorId = "4a36cdfa-f563-4d51-9ec9-dca387f3655a";

  return (
    <StreamView  creatorId = {creatorId} playVideo = {true} />
  )
}

