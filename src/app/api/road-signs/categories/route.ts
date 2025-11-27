import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.roadSignCategory.findMany({
      include: {
        signs: {
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
      orderBy: {
        orderIndex: "asc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching road sign categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch road sign categories" },
      { status: 500 }
    );
  }
}

