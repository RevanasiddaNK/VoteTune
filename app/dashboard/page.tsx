'use client'
import StreamView from '../components/StreamView'
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
export default function Dashboard() {

  const creatorId = "58abcec8-d847-47b4-8c7e-622f94d9f8fe";

  return (
    <StreamView  creatorId = {creatorId} playVideo = {true} />
  )
}

