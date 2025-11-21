import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

function isValidUrl(url: string) {
  try {
    // allow http/https only
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch (e) {
    return false
  }
}

function generateCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let code = ''
  for (let i = 0; i < length; i++) code += chars[Math.floor(Math.random() * chars.length)]
  return code
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(links)
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database connection failed', details: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const url = body?.url
    let code = body?.code

    if (!url || typeof url !== 'string' || !isValidUrl(url)) {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    if (code) {
      if (typeof code !== 'string' || !/^[A-Za-z0-9]{3,64}$/.test(code)) {
        return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
      }
      const existing = await prisma.link.findUnique({ where: { code } })
      if (existing) return NextResponse.json({ error: 'Code already exists' }, { status: 409 })
    } else {
      // generate 6-8 char code, ensure uniqueness (loop a few times)
      let tries = 0
      do {
        code = generateCode(6 + Math.floor(Math.random() * 3))
        const existing = await prisma.link.findUnique({ where: { code } })
        if (!existing) break
        tries++
      } while (tries < 5)
    }

    const created = await prisma.link.create({ data: { code, targetUrl: url } })
    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json({ error: 'Database connection failed', details: error.message }, { status: 500 })
  }
}
