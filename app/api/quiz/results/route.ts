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
    return NextResponse.json(results.map((result) => ({
      score: result.score,
      total: result.total,
      topic: result.topic,
      createdAt: result.createdAt,
    })))
  } catch {
    return NextResponse.json({ error: 'Failed to fetch results' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { driverId, score, total, topic } = await req.json()
    const resolvedDriverId = driverId || (await prisma.driver.findFirst({ orderBy: { createdAt: 'asc' }, select: { id: true } }))?.id
    if (!resolvedDriverId) {
      return NextResponse.json({ error: 'No driver profile available for quiz result' }, { status: 400 })
    }
    const result = await prisma.quizResult.create({
      data: { id: crypto.randomUUID(), driverId: resolvedDriverId, score, total, topic: topic || 'practice' },
    })
    return NextResponse.json({
      score: result.score,
      total: result.total,
      topic: result.topic,
      createdAt: result.createdAt,
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to save result' }, { status: 500 })
  }
}
