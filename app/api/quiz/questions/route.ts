import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const topic = searchParams.get('topic')
    const count = parseInt(searchParams.get('count') || '25')

    const where = topic ? { topic } : {}
    const questions = await prisma.quizQuestion.findMany({ where })

    // Shuffle
    const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, count)

    return NextResponse.json(shuffled)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }
}
