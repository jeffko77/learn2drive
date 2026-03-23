import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id } = await params
    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        drivingLogs: { orderBy: { date: 'desc' } },
      },
    })

    if (!driver) return NextResponse.json({ error: 'Driver not found' }, { status: 404 })

    const phases = await prisma.phase.findMany({
      where: { driverId: id },
      orderBy: { orderIndex: 'asc' },
      include: { skills: { orderBy: { orderIndex: 'asc' }, include: { progress: true } } },
    })

    const phasesWithProgress = phases.map((phase) => ({
      ...phase,
      skills: phase.skills.map((skill) => ({
        ...skill,
        progress: skill.progress || null,
      })),
      completed: phase.skills.filter((s) => s.progress?.status === 'completed').length,
      inProgress: phase.skills.filter((s) => s.progress?.status === 'in_progress').length,
    }))

    const allSkills = phases.flatMap((phase) => phase.skills)
    const totalSkills = allSkills.length
    const completed = allSkills.filter((skill) => skill.progress?.status === 'completed').length
    const inProgress = allSkills.filter((skill) => skill.progress?.status === 'in_progress').length

    return NextResponse.json({
      driver: {
        id: driver.id,
        name: driver.name,
        birthDate: driver.birthDate,
        startDate: driver.startDate,
      },
      stats: { totalSkills, completed, inProgress, remaining: totalSkills - completed - inProgress },
      phases: phasesWithProgress,
      drivingLogs: driver.drivingLogs.map((log) => ({
        ...log,
        location: log.roadTypes,
      })),
      notes: [],
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
