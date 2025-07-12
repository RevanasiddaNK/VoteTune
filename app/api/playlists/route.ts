import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prismaClient } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  
  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }


  const session = await getServerSession();
  if (!session?.user?.email) {
    return NextResponse.json({ message: "unauthenticated" }, { status: 401 });
  }

  const user = await prismaClient.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  try {
 
    const existing = await prismaClient.playlist.findFirst({
      where: { name },              
    });

    if (existing) {
      const playVideo = existing.userId === user.id;
      return NextResponse.json(
        {
          playlist: existing,
          joined: true,
          playVideo,                  
        },
        { status: 200 }
      );
    }

    
    const created = await prismaClient.playlist.create({
      data: {
        name,
        userId: user.id,
      },
    });

    // user just created it, so playVideo is always true
    return NextResponse.json(
      {
        playlist: created,
        joined: false,
        playVideo: true,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[PLAYLIST_CREATE_OR_JOIN]", err);
    return NextResponse.json(
      { error: "Failed to create or fetch playlist" },
      { status: 500 }
    );
  }
}
