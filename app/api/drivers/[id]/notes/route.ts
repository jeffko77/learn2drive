import { NextRequest, NextResponse } from 'next/server'

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  await req
  await params
  return NextResponse.json({ error: 'Driver notes are not available in this database schema' }, { status: 501 })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  await req
  await params
  return NextResponse.json({ error: 'Driver notes are not available in this database schema' }, { status: 501 })
}
