import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const phases = await prisma.phase.findMany({
      orderBy: { orderIndex: 'asc' },
      include: { skills: { orderBy: { orderIndex: 'asc' } } },
    })
    return NextResponse.json(phases)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch phases' }, { status: 500 })
  }
}
