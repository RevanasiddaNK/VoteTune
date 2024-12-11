'use client';

import { Button } from "@/components/ui/button";
import { Music, Users, ThumbsUp, PlusCircle } from 'lucide-react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation'; 
import axios from "axios";

export default function Home() {
  const { data: session, status } = useSession(); // Destructure session data
  const router = useRouter(); // Initialize useRouter

  const handleGetStartedClick = async () => {
    try {
      const res = await axios.get("./api/auth/getUser", { withCredentials: true });
      const creatorId = res.data.user.id;
      console.log("creatorId", creatorId);
      if (router && creatorId) {
        router.push(`/dashboard?creatorId=${creatorId}`);
        //router.push(`/dashboard`);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <main>
      <section className="text-center">
        <h2 className="text-5xl font-bold mb-6 text-purple-800 dark:text-purple-300">
          Collaborative Music Streaming
        </h2>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          Create playlists, vote on songs, and stream music together with friends.
        </p>

        <Button 
          size="lg" 
          className="bg-purple-600 hover:bg-purple-700 text-white"
          onClick={handleGetStartedClick} 
        >
          Get Started
        </Button>
      </section>

      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 my-20">
        <FeatureCard
          icon={<Music className="h-10 w-10 text-purple-600" />}
          title="Create Playlists"
          description="Curate your perfect playlist and share it with friends."
        />
        <FeatureCard
          icon={<Users className="h-10 w-10 text-purple-600" />}
          title="Collaborate"
          description="Invite friends to add songs and shape the playlist together."
        />
        <FeatureCard
          icon={<ThumbsUp className="h-10 w-10 text-purple-600" />}
          title="Vote on Songs"
          description="Like or dislike songs to influence the playlist order."
        />
        <FeatureCard
          icon={<PlusCircle className="h-10 w-10 text-purple-600" />}
          title="Discover Music"
          description="Find new tracks based on your group's tastes."
        />
      </section>

      <section className="text-center py-20 bg-purple-100 dark:bg-purple-900 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-purple-800 dark:text-purple-300">
          Ready to Tune In?
        </h2>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          Join VoteTune today and start creating collaborative playlists with your friends.
        </p>

        <div>
          { !session?.user ? (
            <Button onClick={() => signIn()} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              Sign Up Now
            </Button>
          ) : (
            <Button onClick={() => signOut()} size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
              Sign Out
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-purple-800 dark:text-purple-300">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
