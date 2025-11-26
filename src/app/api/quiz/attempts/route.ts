import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get("driverId");

    const attempts = await prisma.quizAttempt.findMany({
      where: driverId ? { driverId } : undefined,
      include: {
        answers: {
          include: {
            question: true,
          },
        },
        driver: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        dateTaken: "desc",
      },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("Error fetching attempts:", error);
    return NextResponse.json(
      { error: "Failed to fetch attempts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, answers, timeTaken, mode } = body;

    // Calculate score
    let score = 0;
    const answerRecords = [];

    for (const answer of answers) {
      const question = await prisma.quizQuestion.findUnique({
        where: { id: answer.questionId },
      });

      const isCorrect = question?.correctAnswer === answer.selectedAnswer;
      if (isCorrect) score++;

      answerRecords.push({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
      });
    }

    const attempt = await prisma.quizAttempt.create({
      data: {
        driverId,
        score,
        totalQuestions: answers.length,
        timeTaken,
        mode: mode || "practice",
        answers: {
          create: answerRecords,
        },
      },
      include: {
        answers: {
          include: {
            question: true,
          },
        },
      },
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Error creating attempt:", error);
    return NextResponse.json(
      { error: "Failed to create attempt" },
      { status: 500 }
    );
  }
}

