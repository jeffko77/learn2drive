import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DRIVING_TEST_PASSING_SCORE } from "@/lib/driving-test-seed-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get("driverId");

    const attempts = await prisma.drivingTestAttempt.findMany({
      where: driverId ? { driverId } : undefined,
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
    console.error("Error fetching driving test attempts:", error);
    return NextResponse.json(
      { error: "Failed to fetch driving test attempts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, evaluations, evaluatorName, notes, automaticFail } = body;

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

    // Calculate scores
    let totalDeductions = 0;
    let maxPossibleScore = 0;

    // Get all criteria to calculate max possible score
    const allCriteria = await prisma.drivingTestCriteria.findMany();
    maxPossibleScore = allCriteria.reduce((sum, c) => sum + c.maxPoints, 0);

    // Calculate total deductions from evaluations
    for (const evaluation of evaluations) {
      totalDeductions += evaluation.pointsDeducted || 0;
    }

    const totalScore = maxPossibleScore - totalDeductions;
    const passed = automaticFail ? false : totalScore >= DRIVING_TEST_PASSING_SCORE;

    // Create the attempt with evaluations
    const attempt = await prisma.drivingTestAttempt.create({
      data: {
        driverId,
        totalScore,
        maxPossibleScore,
        passed,
        evaluatorName,
        notes: automaticFail ? `AUTOMATIC FAIL: ${notes}` : notes,
        evaluations: {
          create: evaluations.map((e: { criteriaId: string; pointsDeducted: number; evaluatorNotes?: string }) => ({
            criteriaId: e.criteriaId,
            pointsDeducted: e.pointsDeducted || 0,
            evaluatorNotes: e.evaluatorNotes,
          })),
        },
      },
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
            name: true,
          },
        },
      },
    });

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Error creating driving test attempt:", error);
    return NextResponse.json(
      { error: "Failed to create driving test attempt" },
      { status: 500 }
    );
  }
}

