import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET all driving logs (optionally filtered by driverId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const driverId = searchParams.get("driverId");

    const where = driverId ? { driverId } : {};

    const logs = await prisma.drivingLog.findMany({
      where,
      include: {
        driver: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Error fetching driving logs:", error);
    return NextResponse.json(
      { error: "Failed to fetch driving logs" },
      { status: 500 }
    );
  }
}

// POST create a new driving log
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { driverId, date, duration, notes, weather, roadTypes } = body;

    if (!driverId || !date || !duration) {
      return NextResponse.json(
        { error: "driverId, date, and duration are required" },
        { status: 400 }
      );
    }

    const log = await prisma.drivingLog.create({
      data: {
        driverId,
        date: new Date(date),
        duration: parseInt(duration),
        notes: notes || null,
        weather: weather || null,
        roadTypes: roadTypes || null,
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

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Error creating driving log:", error);
    return NextResponse.json(
      { error: "Failed to create driving log" },
      { status: 500 }
    );
  }
}

