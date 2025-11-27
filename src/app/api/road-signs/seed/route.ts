import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { roadSignCategories } from "@/lib/road-sign-seed-data";

export async function GET() {
  try {
    const categoryCount = await prisma.roadSignCategory.count();
    const signCount = await prisma.roadSign.count();

    return NextResponse.json({
      categories: categoryCount,
      signs: signCount,
      seeded: categoryCount > 0 && signCount > 0,
    });
  } catch (error) {
    console.error("Error checking road sign seed status:", error);
    return NextResponse.json(
      { error: "Failed to check seed status" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Check if already seeded
    const existingCategories = await prisma.roadSignCategory.count();
    if (existingCategories > 0) {
      return NextResponse.json({
        message: "Road sign data already seeded",
        categories: existingCategories,
      });
    }

    // Seed categories and signs
    for (const category of roadSignCategories) {
      await prisma.roadSignCategory.create({
        data: {
          name: category.name,
          description: category.description,
          orderIndex: category.orderIndex,
          signs: {
            create: category.signs.map((sign) => ({
              signName: sign.signName,
              signMeaning: sign.signMeaning,
              shape: sign.shape,
              colorScheme: sign.colorScheme,
              additionalNotes: sign.additionalNotes,
              orderIndex: sign.orderIndex,
            })),
          },
        },
      });
    }

    const categoryCount = await prisma.roadSignCategory.count();
    const signCount = await prisma.roadSign.count();

    return NextResponse.json({
      message: "Road sign data seeded successfully",
      categories: categoryCount,
      signs: signCount,
    });
  } catch (error) {
    console.error("Error seeding road sign data:", error);
    return NextResponse.json(
      { error: "Failed to seed road sign data" },
      { status: 500 }
    );
  }
}

