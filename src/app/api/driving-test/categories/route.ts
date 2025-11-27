import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.drivingTestCategory.findMany({
      include: {
        criteria: {
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
    console.error("Error fetching driving test categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch driving test categories" },
      { status: 500 }
    );
  }
}

