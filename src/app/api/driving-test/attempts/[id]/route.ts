import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const attempt = await prisma.drivingTestAttempt.findUnique({
      where: { id },
      include: {
        evaluations: {
          include: {
            criteria: {
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
    console.error("Error fetching driving test attempt:", error);
    return NextResponse.json(
      { error: "Failed to fetch driving test attempt" },
      { status: 500 }
    );
  }
}

