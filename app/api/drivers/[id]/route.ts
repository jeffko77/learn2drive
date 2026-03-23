import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        progress: {
          include: { skill: { include: { phase: true } } },
        },
        drivingLogs: { orderBy: { date: 'desc' } },
        notes: { orderBy: { createdAt: 'desc' } },
      },
    })

    if (!driver) return NextResponse.json({ error: 'Driver not found' }, { status: 404 })

    const phases = await prisma.phase.findMany({
      orderBy: { orderIndex: 'asc' },
      include: { skills: { orderBy: { orderIndex: 'asc' } } },
    })

    const progressMap = new Map(driver.progress.map((progressEntry) => [progressEntry.skillId, progressEntry]))

    const phasesWithProgress = phases.map((phase) => ({
      ...phase,
      skills: phase.skills.map((skill) => ({
        ...skill,
        progress: progressMap.get(skill.id) || null,
      })),
      completed: phase.skills.filter((s) => progressMap.get(s.id)?.status === 'completed').length,
      inProgress: phase.skills.filter((s) => progressMap.get(s.id)?.status === 'in_progress').length,
    }))

    const totalSkills = phases.reduce((acc, p) => acc + p.skills.length, 0)
    const completed = driver.progress.filter((p) => p.status === 'completed').length
    const inProgress = driver.progress.filter((p) => p.status === 'in_progress').length

    return NextResponse.json({
      driver: {
        id: driver.id,
        name: driver.name,
        birthDate: driver.birthDate,
        startDate: driver.startDate,
      },
      stats: { totalSkills, completed, inProgress, remaining: totalSkills - completed - inProgress },
      phases: phasesWithProgress,
      drivingLogs: driver.drivingLogs,
      notes: driver.notes,
    })
  } catch (error) {
    console.error('GET /api/drivers/[id] error:', error)
    return NextResponse.json({ error: 'Failed to fetch driver' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const body = await req.json()
    const driver = await prisma.driver.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.birthDate && { birthDate: new Date(body.birthDate) }),
        ...(body.startDate && { startDate: new Date(body.startDate) }),
      },
    })
    return NextResponse.json(driver)
  } catch {
    return NextResponse.json({ error: 'Failed to update driver' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    await prisma.driver.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete driver' }, { status: 500 })
  }
}
