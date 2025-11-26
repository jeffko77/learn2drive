import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { quizQuestions } from "@/lib/seed-data";

export async function POST() {
  try {
    // Check if questions already exist
    const existingCount = await prisma.quizQuestion.count();
    
    if (existingCount > 0) {
      return NextResponse.json({ 
        message: "Quiz questions already seeded", 
        count: existingCount 
      });
    }

    // Seed quiz questions
    const result = await prisma.quizQuestion.createMany({
      data: quizQuestions,
      skipDuplicates: true,
    });

    return NextResponse.json({ 
      message: "Quiz questions seeded successfully", 
      count: result.count 
    }, { status: 201 });
  } catch (error) {
    console.error("Error seeding data:", error);
    return NextResponse.json(
      { error: "Failed to seed data" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const questionCount = await prisma.quizQuestion.count();
    const driverCount = await prisma.driver.count();
    
    return NextResponse.json({
      questions: questionCount,
      drivers: driverCount,
    });
  } catch (error) {
    console.error("Error checking seed status:", error);
    return NextResponse.json(
      { error: "Failed to check seed status" },
      { status: 500 }
    );
  }
}

