import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { findTeachingNotes } from "@/lib/teaching-notes";

// POST - Backfill teaching notes for all existing tasks
export async function POST() {
  try {
    // Get all tasks
    const tasks = await prisma.task.findMany({
      select: {
        id: true,
        title: true,
        teachingNotes: true,
      },
    });

    let updated = 0;
    let skipped = 0;

    for (const task of tasks) {
      // Skip if already has teaching notes
      if (task.teachingNotes) {
        skipped++;
        continue;
      }

      const notes = findTeachingNotes(task.title);
      if (notes) {
        await prisma.task.update({
          where: { id: task.id },
          data: { teachingNotes: notes },
        });
        updated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updated} tasks with teaching notes, skipped ${skipped} tasks that already had notes`,
      updated,
      skipped,
      total: tasks.length,
    });
  } catch (error) {
    console.error("Error backfilling teaching notes:", error);
    return NextResponse.json(
      { error: "Failed to backfill teaching notes" },
      { status: 500 }
    );
  }
}

// GET - Check status of teaching notes
export async function GET() {
  try {
    const total = await prisma.task.count();
    const withNotes = await prisma.task.count({
      where: {
        teachingNotes: {
          not: null,
        },
      },
    });
    const withoutNotes = total - withNotes;

    return NextResponse.json({
      total,
      withNotes,
      withoutNotes,
      percentage: total > 0 ? Math.round((withNotes / total) * 100) : 0,
    });
  } catch (error) {
    console.error("Error checking teaching notes status:", error);
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    );
  }
}

