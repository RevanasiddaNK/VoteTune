// app/api/playlists/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export async function POST(req: NextRequest) {
  const { name } = await req.json();

  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Invalid name" }, { status: 400 });
  }

  try {

    const playlist = await prisma?.playlist.create({
      data: { name }
    });

    return NextResponse.json(playlist, { status: 201 });
    
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create playlist" }, { status: 500 });
  }
}
