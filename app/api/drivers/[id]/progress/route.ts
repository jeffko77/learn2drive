import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: driverId } = await params
    const { skillId, status, notes, feedback } = await req.json()

    if (!skillId || !status) {
      return NextResponse.json({ error: 'skillId and status required' }, { status: 400 })
    }

    const skill = await prisma.skill.findFirst({
      where: { id: skillId, phase: { driverId } },
      select: { id: true },
    })
    if (!skill) {
      return NextResponse.json({ error: 'Task not found for driver' }, { status: 404 })
    }

    const progress = await prisma.skillProgress.upsert({
      where: { skillId },
      create: {
        id: crypto.randomUUID(),
        status,
        notes: notes || null,
        feedback: feedback || null,
        completedAt: status === 'completed' ? new Date() : null,
        skill: { connect: { id: skillId } },
      },
      update: {
        status,
        notes: notes !== undefined ? notes : undefined,
        feedback: feedback !== undefined ? feedback : undefined,
        completedAt: status === 'completed' ? new Date() : status === 'not_started' ? null : undefined,
      },
    })

    return NextResponse.json(progress)
  } catch (error) {
    console.error('POST /api/drivers/[id]/progress error:', error)
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
