
import StreamView from '../components/StreamView'
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
export default function Dashboard() {

  const creatorId = "e28bed57-2f14-4ff8-a8d2-fa4cfb8fae3e";

  return (
    <StreamView  creatorId = {creatorId} />
  )
}

