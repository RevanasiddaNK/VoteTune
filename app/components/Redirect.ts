'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Redirect() {
    const { data: session } = useSession();
    const router = useRouter();
    const [creatorId, setCreatorId] = useState(null);

    useEffect(() => {
        const fetchCreatorId = async () => {
            try {
                const res = await axios.get("/api/auth/getUser", { withCredentials: true });
                setCreatorId(res.data.user.id); // Set creatorId once fetched
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        if (session?.user) {
            fetchCreatorId();
        }
    }, [session]);

    useEffect(() => {
        if (creatorId) {
            // Redirect to the dashboard with the creatorId
            router.push(`/dashboard?creatorId=${creatorId}`);
        }
    }, [creatorId, router]);

    return null;
}
