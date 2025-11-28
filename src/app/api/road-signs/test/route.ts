import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ROAD_SIGN_STANDARD_QUESTIONS } from "@/lib/road-sign-seed-data";

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const count = parseInt(searchParams.get("count") || String(ROAD_SIGN_STANDARD_QUESTIONS));

    // Get signs based on category filter
    const signs = await prisma.roadSign.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    // Shuffle and limit
    const shuffledSigns = shuffleArray(signs).slice(0, count);

    // Generate questions with multiple choice options
    const questions = shuffledSigns.map((sign) => {
      // Get other signs to use as wrong answers
      const otherSigns = signs.filter((s) => s.id !== sign.id);
      const wrongAnswers = shuffleArray(otherSigns).slice(0, 3);

      // Create options array with correct answer and wrong answers
      const options = shuffleArray([
        { id: sign.id, text: sign.signMeaning, isCorrect: true },
        ...wrongAnswers.map((s) => ({
          id: s.id,
          text: s.signMeaning,
          isCorrect: false,
        })),
      ]);

      return {
        signId: sign.id,
        signName: sign.signName,
        shape: sign.shape,
        colorScheme: sign.colorScheme,
        categoryName: sign.category.name,
        additionalNotes: sign.additionalNotes,
        imageUrl: sign.imageUrl,
        options: options.map((opt, index) => ({
          letter: String.fromCharCode(65 + index), // A, B, C, D
          text: opt.text,
          signId: opt.id,
        })),
        correctAnswer: String.fromCharCode(
          65 + options.findIndex((opt) => opt.isCorrect)
        ),
      };
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error("Error generating road sign test:", error);
    return NextResponse.json(
      { error: "Failed to generate road sign test" },
      { status: 500 }
    );
  }
}

