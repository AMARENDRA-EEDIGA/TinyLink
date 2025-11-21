import { NextResponse } from 'next/server'
import prisma from '../../../lib/prisma'

export async function GET() {
  try {
    // Test database connection
    await prisma.$connect()
    const count = await prisma.link.count()
    
    return NextResponse.json({ 
      status: 'connected', 
      linkCount: count,
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...'
      }
    })
  } catch (error) {
    console.error('Database connection test failed:', error)
    return NextResponse.json({ 
      status: 'failed', 
      error: error.message,
      env: {
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...'
      }
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}