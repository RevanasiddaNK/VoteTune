'use client';

import { useState, FormEvent } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { Radio, Users, ThumbsUp, PlusCircle } from 'lucide-react';

export default function Home() {
  /* ───────── hooks ───────── */
  const { data: session } = useSession();
  const router = useRouter();

  const [name, setName]   = useState('');
  const [loading, setLoading] = useState(false);

  /* ───────── handlers ───────── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error('Please sign in first.');
      return signIn();
    }
    if (!name.trim()) {
      return toast.error("Name can’t be empty.");
    }

    try {
      setLoading(true);

      const res = await fetch('/api/playlists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error(await res.text());

      const { playlist, joined, playVideo } = await res.json();

      toast(joined ? 'Joined existing playlist!' : 'Created new playlist!');

      router.push(
        `/dashboard?playlistId=${playlist.id}&playVideo=${playVideo}`
      );
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  /* ───────── render ───────── */
  return (
    <main className="container mx-auto px-4">
      {/* Hero */}
      <section className="text-center my-16">
        <h2 className="text-5xl font-bold mb-6 text-purple-800 dark:text-purple-300">
          Collaborative Music Streaming
        </h2>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          Create playlists, vote on songs, and stream music together with friends.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
          <div>
            <Label htmlFor="playlist-name">Name</Label>
            <Input
              id="playlist-name"
              placeholder="e.g. Road‑trip Bangers"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? 'Creating…' : 'Create or Join Playlist'}
          </Button>
        </form>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 my-20">
        <FeatureCard
          icon={<Users className="h-10 w-10 text-purple-600" />}
          title="Collaborate"
          description="Invite friends to add songs and shape the playlist together."
        />
        <FeatureCard
          icon={<Radio className="h-10 w-10 text-purple-600" />}
          title="Live Streaming"
          description="Stream with real-time input."
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

      {/* Call to action */}
      <section className="text-center py-20 bg-purple-100 dark:bg-purple-900 rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-purple-800 dark:text-purple-300">
          Ready to Tune In?
        </h2>
        <p className="text-xl mb-8 text-gray-600 dark:text-gray-300">
          Join VoteTune today and start creating collaborative playlists with your friends.
        </p>

        {!session?.user ? (
          <Button
            onClick={() => signIn()}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Sign Up Now
          </Button>
        ) : (
          <Button
            onClick={() => signOut()}
            size="lg"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Sign Out
          </Button>
        )}
      </section>
    </main>
  );
}

/* ───────── sub‑component ───────── */
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-purple-800 dark:text-purple-300">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
