'use client'
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
export default function Appbar() {

const session = useSession();

  return (
    <div className="flex justify-between m-4">

      
      <div>
     
        { !session.data && 
            <Button onClick={() => signIn()}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            >SignIn</Button>
        }

        { session.data && 
            <Button onClick={() => signOut()}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white"
            >SignOut</Button>
        }



      </div>

    </div>
  );
}