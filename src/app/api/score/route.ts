import { query } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { player, score } = await req.json();

  if (!player || typeof score !== "number") {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

console.log(player, score)
  await query(
    "INSERT INTO score (player, score) VALUES ($1, $2)",
    [player, score]
  );

  return NextResponse.json({ success: true });
}
