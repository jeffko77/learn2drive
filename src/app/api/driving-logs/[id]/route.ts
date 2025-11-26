import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single driving log
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const log = await prisma.drivingLog.findUnique({
      where: { id },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!log) {
      return NextResponse.json(
        { error: "Driving log not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error fetching driving log:", error);
    return NextResponse.json(
      { error: "Failed to fetch driving log" },
      { status: 500 }
    );
  }
}

// PUT update driving log
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { date, duration, notes, weather, roadTypes } = body;

    const log = await prisma.drivingLog.update({
      where: { id },
      data: {
        ...(date && { date: new Date(date) }),
        ...(duration !== undefined && { duration: parseInt(duration) }),
        ...(notes !== undefined && { notes }),
        ...(weather !== undefined && { weather }),
        ...(roadTypes !== undefined && { roadTypes }),
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json(log);
  } catch (error) {
    console.error("Error updating driving log:", error);
    return NextResponse.json(
      { error: "Failed to update driving log" },
      { status: 500 }
    );
  }
}

// DELETE driving log
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.drivingLog.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting driving log:", error);
    return NextResponse.json(
      { error: "Failed to delete driving log" },
      { status: 500 }
    );
  }
}

