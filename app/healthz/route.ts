import { NextResponse } from 'next/server'
import prisma from '../../lib/prisma'

export async function GET() {
  try {
    await prisma.$connect()
    const count = await prisma.link.count()
    return NextResponse.json({ 
      ok: true, 
      version: '1.0',
      database: 'connected',
      linkCount: count,
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        dbType: process.env.DATABASE_URL?.includes('postgresql') ? 'postgres' : 'sqlite'
      }
    })
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      version: '1.0',
      database: 'failed',
      error: error.message,
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        dbType: process.env.DATABASE_URL?.includes('postgresql') ? 'postgres' : 'sqlite'
      }
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
