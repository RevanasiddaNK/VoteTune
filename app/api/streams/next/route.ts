import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  /* ---------------- Session & user ---------------- */
  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "unauthenticated" }, { status: 403 });
  }

  const user = await prismaClient.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ message: "unauthenticated" }, { status: 403 });
  }

  /* ---------------- Playlist param  ---------------- */
  const playlistId = req.nextUrl.searchParams.get("playlistId");
  if (!playlistId) {
    return NextResponse.json({ message: "playlistId missing" }, { status: 400 });
  }

  /* Verify ownership */
  const playlist = await prismaClient.playlist.findUnique({
    where: { id: playlistId },
    select: { userId: true },
  });

  if (!playlist || playlist.userId !== user.id) {
    return NextResponse.json({ message: "forbidden" }, { status: 403 });
  }

  /* ---------------- Get top‑voted stream ---------------- */
  const maxUpvoted = await prismaClient.stream.findFirst({
    where: { playlistId },
    orderBy: { upvotes: { _count: "desc" } },
  });

  if (!maxUpvoted) {
    return NextResponse.json({ message: "no streams in playlist" }, { status: 404 });
  }

  /* ---------------- Transaction: upsert + delete ---------------- */
  await prismaClient.$transaction(async (prisma) => {
    // upsert current stream (1‑1 keyed by playlistId)
    await prisma.currentStream.upsert({
      where: { playlistId }, // PK
      update: {
        title: maxUpvoted.title,
        url: maxUpvoted.url,
        bigThumbnail: maxUpvoted.bigThumbnail,
        smallThumbnail: maxUpvoted.smallThumbnail,
        extractedId: maxUpvoted.extractedId,
      },
      create: {
        playlistId,
        title: maxUpvoted.title,
        url: maxUpvoted.url,
        bigThumbnail: maxUpvoted.bigThumbnail,
        smallThumbnail: maxUpvoted.smallThumbnail,
        extractedId: maxUpvoted.extractedId,
      },
    });

    // remove the stream from list
    await prisma.stream.delete({ where: { id: maxUpvoted.id } });
  });

  return NextResponse.json(
    { message: "Current stream updated with top‑voted track." },
    { status: 200 }
  );
}
