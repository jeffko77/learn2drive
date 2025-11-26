import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, status, notes, feedback } = body;

    const progress = await prisma.progress.upsert({
      where: { taskId },
      update: {
        status,
        notes,
        feedback,
        completionDate: status === "completed" ? new Date() : null,
      },
      create: {
        taskId,
        status,
        notes,
        feedback,
        completionDate: status === "completed" ? new Date() : null,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error updating progress:", error);
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskIds, status } = body;

    // Bulk update for multiple tasks
    const updates = await Promise.all(
      taskIds.map((taskId: string) =>
        prisma.progress.upsert({
          where: { taskId },
          update: {
            status,
            completionDate: status === "completed" ? new Date() : null,
          },
          create: {
            taskId,
            status,
            completionDate: status === "completed" ? new Date() : null,
          },
        })
      )
    );

    return NextResponse.json(updates);
  } catch (error) {
    console.error("Error bulk updating progress:", error);
    return NextResponse.json(
      { error: "Failed to bulk update progress" },
      { status: 500 }
    );
  }
}

