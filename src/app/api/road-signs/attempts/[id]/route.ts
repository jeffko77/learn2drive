import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const attempt = await prisma.roadSignTestAttempt.findUnique({
      where: { id },
      include: {
        answers: {
          include: {
            sign: {
              include: {
                category: true,
              },
            },
          },
        },
        driver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { error: "Attempt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(attempt);
  } catch (error) {
    console.error("Error fetching road sign test attempt:", error);
    return NextResponse.json(
      { error: "Failed to fetch road sign test attempt" },
      { status: 500 }
    );
  }
}

