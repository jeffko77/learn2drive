import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const topics = await prisma.quizQuestion.groupBy({
      by: ["topic"],
      _count: {
        topic: true,
      },
      orderBy: {
        topic: "asc",
      },
    });

    return NextResponse.json(
      topics.map((t) => ({
        topic: t.topic,
        count: t._count.topic,
      }))
    );
  } catch (error) {
    console.error("Error fetching topics:", error);
    return NextResponse.json(
      { error: "Failed to fetch topics" },
      { status: 500 }
    );
  }
}

