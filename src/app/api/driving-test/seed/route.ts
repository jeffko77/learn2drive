import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { drivingTestCategories } from "@/lib/driving-test-seed-data";

export async function GET() {
  try {
    const categoryCount = await prisma.drivingTestCategory.count();
    const criteriaCount = await prisma.drivingTestCriteria.count();

    return NextResponse.json({
      categories: categoryCount,
      criteria: criteriaCount,
      seeded: categoryCount > 0 && criteriaCount > 0,
    });
  } catch (error) {
    console.error("Error checking driving test seed status:", error);
    return NextResponse.json(
      { error: "Failed to check seed status" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Check if already seeded
    const existingCategories = await prisma.drivingTestCategory.count();
    if (existingCategories > 0) {
      return NextResponse.json({
        message: "Driving test data already seeded",
        categories: existingCategories,
      });
    }

    // Seed categories and criteria
    for (const category of drivingTestCategories) {
      await prisma.drivingTestCategory.create({
        data: {
          name: category.name,
          description: category.description,
          orderIndex: category.orderIndex,
          criteria: {
            create: category.criteria.map((c) => ({
              criteriaName: c.criteriaName,
              evaluationGuide: c.evaluationGuide,
              maxPoints: c.maxPoints,
              orderIndex: c.orderIndex,
            })),
          },
        },
      });
    }

    const categoryCount = await prisma.drivingTestCategory.count();
    const criteriaCount = await prisma.drivingTestCriteria.count();

    return NextResponse.json({
      message: "Driving test data seeded successfully",
      categories: categoryCount,
      criteria: criteriaCount,
    });
  } catch (error) {
    console.error("Error seeding driving test data:", error);
    return NextResponse.json(
      { error: "Failed to seed driving test data" },
      { status: 500 }
    );
  }
}

