'use client'; // Mark as a client-side component
import { Button } from '@/components/ui/button'; // Importing Button component
import { signIn } from 'next-auth/react'; // Importing next-auth for sign-in
import { useSearchParams } from 'next/navigation'; // For client-side navigation
import React, { Suspense } from 'react';

const SignIn = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/'; // Default to '/' if no callbackUrl is present

  return (
    <div className="flex items-center justify-center h-screen text-center py-20 bg-purple-100 dark:bg-purple-900 rounded-lg">
      <Button
        onClick={() => signIn('google', { callbackUrl: callbackUrl as string })}
        size="lg"
        className="bg-purple-600 hover:bg-purple-700 text-white"
      >
        Sign Up Now
      </Button>
    </div>
  );
};

// Page component with Suspense for loading state
export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignIn />
    </Suspense>
  );
}
