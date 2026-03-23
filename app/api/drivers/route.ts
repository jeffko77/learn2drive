import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        progress: { select: { status: true } },
      },
    })

    const totalSkills = await prisma.skill.count()

    const result = drivers.map((driver) => ({
      id: driver.id,
      name: driver.name,
      birthDate: driver.birthDate,
      startDate: driver.startDate,
      totalSkills,
      completed: driver.progress.filter((p) => p.status === 'completed').length,
      inProgress: driver.progress.filter((p) => p.status === 'in_progress').length,
    }))

    return NextResponse.json(result)
  } catch (error) {
    console.error('GET /api/drivers error:', error)
    return NextResponse.json({ error: 'Failed to fetch drivers' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, birthDate, startDate } = await req.json()
    if (!name || !birthDate) {
      return NextResponse.json({ error: 'Name and birthDate required' }, { status: 400 })
    }

    const driver = await prisma.driver.create({
      data: {
        name,
        birthDate: new Date(birthDate),
        startDate: startDate ? new Date(startDate) : new Date(),
      },
    })

    return NextResponse.json(driver, { status: 201 })
  } catch (error) {
    console.error('POST /api/drivers error:', error)
    return NextResponse.json({ error: 'Failed to create driver' }, { status: 500 })
  }
}
