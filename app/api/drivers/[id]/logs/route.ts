import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: driverId } = await params
    const { date, duration, location, notes } = await req.json()

    const log = await prisma.drivingLog.create({
      data: {
        driverId,
        date: date ? new Date(date) : new Date(),
        duration: Number(duration) || 30,
        location: location || null,
        notes: notes || null,
      },
    })

    return NextResponse.json(log, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create log' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id: driverId } = await params
    const { logId } = await req.json()
    await prisma.drivingLog.delete({ where: { id: logId, driverId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete log' }, { status: 500 })
  }
}
