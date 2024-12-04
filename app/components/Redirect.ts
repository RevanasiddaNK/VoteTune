"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Correct hook for client-side navigation in Next.js 13+
import { useEffect } from "react";
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export default function Redirect() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session?.user) {
            router.push("/dashboard"); // Redirect if session exists
        }
    }, [session]);

    return null; // Component does not render anything
}
