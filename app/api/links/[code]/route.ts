import { NextResponse } from 'next/server'
import prisma from '../../../../lib/prisma'

export async function GET(_: Request, { params }: { params: { code: string } }) {
  try {
    const code = params.code
    const link = await prisma.link.findUnique({ where: { code } })
    if (!link) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(link)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database connection failed', details: error.message }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { code: string } }) {
  try {
    const code = params.code
    const existing = await prisma.link.findUnique({ where: { code } })
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await prisma.link.delete({ where: { code } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database connection failed', details: error.message }, { status: 500 })
  }
}
