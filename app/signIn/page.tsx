"use client"
import { Button } from '@/components/ui/button';
// Import necessary modules
import { signIn } from 'next-auth/react'; // Function to initiate sign-in
import { useSearchParams } from 'next/navigation';// For client-side navigation
import { useEffect } from 'react';

export default function SignIn() {
    const searchParams = useSearchParams(); // Get query parameters from the URL
  const callbackUrl = searchParams.get('callbackUrl') || '/'; // Default to '/' if no `callbackUrl` is present


  return (
    <div className="flex items-center justify-center h-screentext-center py-20 bg-purple-100 dark:bg-purple-900 rounded-lg">
     

        {/* Login with Google */}

        <Button  onClick={() => signIn('google', { callbackUrl: callbackUrl as string })} 
            size="lg" 
            className="bg-purple-600 hover:bg-purple-700 text-white"
        >
              Sign Up Now
        </Button>

    </div>
  );
}
