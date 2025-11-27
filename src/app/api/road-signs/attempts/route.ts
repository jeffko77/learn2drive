import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ROAD_SIGN_PASSING_SCORE } from "@/lib/road-sign-seed-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get("driverId");

    const attempts = await prisma.roadSignTestAttempt.findMany({
      where: driverId ? { driverId } : undefined,
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
            name: true,
          },
        },
      },
      orderBy: {
        testDate: "desc",
      },
    });

    return NextResponse.json(attempts);
  } catch (error) {
    console.error("Error fetching road sign test attempts:", error);
    return NextResponse.json(
      { error: "Failed to fetch road sign test attempts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, answers, timeTaken, testMode } = body;

    // Validate driver exists
    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
    });

    if (!driver) {
      return NextResponse.json(
        { error: "Driver not found" },
        { status: 404 }
      );
    }

    // Calculate score
    let correctCount = 0;
    const answerRecords = [];

    for (const answer of answers) {
      const sign = await prisma.roadSign.findUnique({
        where: { id: answer.signId },
      });

      // Check if the selected answer's signId matches the question's signId
      const isCorrect = answer.selectedSignId === answer.signId;
      if (isCorrect) correctCount++;

      answerRecords.push({
        signId: answer.signId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect,
        timeSpent: answer.timeSpent,
      });
    }

    const totalQuestions = answers.length;
    const percentage = (correctCount / totalQuestions) * 100;
    const passed = percentage >= ROAD_SIGN_PASSING_SCORE;

    const attempt = await prisma.roadSignTestAttempt.create({
      data: {
        driverId,
        totalQuestions,
        correctAnswers: correctCount,
        percentage,
        passed,
        timeTaken,
        testMode: testMode || "all",
        answers: {
          create: answerRecords,
        },
      },
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
            name: true,
          },
        },
      },
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Error creating road sign test attempt:", error);
    return NextResponse.json(
      { error: "Failed to create road sign test attempt" },
      { status: 500 }
    );
  }
}

