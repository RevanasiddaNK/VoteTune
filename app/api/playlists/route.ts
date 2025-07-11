import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prismaClient } from "@/app/lib/db";

export async function POST(req: NextRequest) {
  /* --------------- Validate request body --------------- */
  const { name } = await req.json();
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  /* --------------- Auth & current user --------------- */
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

  /* --------------- Create or join logic --------------- */
  try {
    // 1. Check for an existing playlist with the same name
    const existing = await prismaClient.playlist.findFirst({
      where: { name },           // case‑sensitive match; use mode: "insensitive" for ci
    });

    // 2. If it exists -> "join" it (return as is)
    if (existing) {
      return NextResponse.json(
        { playlist: existing, joined: true },
        { status: 200 }
      );
    }

    // 3. Otherwise create it
    const created = await prismaClient.playlist.create({
      data: {
        name,
        userId: user.id, // owner
      },
    });

    return NextResponse.json(
      { playlist: created, joined: false },
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
