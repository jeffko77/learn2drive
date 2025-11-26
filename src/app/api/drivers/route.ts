import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trainingPhases } from "@/lib/seed-data";
import { findTeachingNotes } from "@/lib/teaching-notes";

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        phases: {
          include: {
            tasks: {
              include: {
                progress: true,
              },
            },
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(drivers);
  } catch (error) {
    console.error("Error fetching drivers:", error);
    return NextResponse.json(
      { error: "Failed to fetch drivers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, birthDate, startDate } = body;

    // Create driver with default training phases
    const driver = await prisma.driver.create({
      data: {
        name,
        birthDate: new Date(birthDate),
        startDate: new Date(startDate),
        phases: {
          create: trainingPhases.map((phase, index) => ({
            title: phase.title,
            description: phase.description,
            orderIndex: index,
            tasks: {
              create: phase.tasks.map((task, taskIndex) => ({
                title: task.title,
                description: task.description,
                teachingNotes: findTeachingNotes(task.title),
                orderIndex: taskIndex,
              })),
            },
          })),
        },
      },
      include: {
        phases: {
          include: {
            tasks: {
              include: {
                progress: true,
              },
            },
          },
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    });

    return NextResponse.json(driver, { status: 201 });
  } catch (error) {
    console.error("Error creating driver:", error);
    return NextResponse.json(
      { error: "Failed to create driver" },
      { status: 500 }
    );
  }
}

