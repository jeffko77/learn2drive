import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: driverId } = await params
    const { content } = await req.json()
    if (!content) return NextResponse.json({ error: 'Content required' }, { status: 400 })

    const note = await prisma.driverNote.create({ data: { driverId, content } })
    return NextResponse.json(note, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const { id: driverId } = await params
    const { noteId } = await req.json()
    await prisma.driverNote.delete({ where: { id: noteId, driverId } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
  }
}
