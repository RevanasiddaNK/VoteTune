'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function Appbar() {

const session = useSession();

  return (
    <div className="flex justify-between m-4">
      <div>
        <h2>VoteTune</h2>
      </div>

      <div>

        { !session.data && 
            <button onClick={() => signIn()}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-200"
            >SignIn</button>
        }

        { session.data && 
            <button onClick={() => signOut()}
            className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition ease-in-out duration-200"
            >SignOut</button>
        }

      </div>
    </div>
  );
}
