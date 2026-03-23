import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const driverId = searchParams.get('driverId')
    const results = await prisma.quizResult.findMany({
      where: driverId ? { driverId } : {},
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { driverId, score, total, topic } = await req.json()
    const result = await prisma.quizResult.create({
      data: { driverId: driverId || null, score, total, topic: topic || null },
    })
    return NextResponse.json(result, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 })
  }
}
