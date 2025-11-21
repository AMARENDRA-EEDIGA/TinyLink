import { NextResponse } from 'next/server'
import { notFound } from 'next/navigation'
import prisma from '../../lib/prisma'

export async function GET(_: Request, { params }: { params: { code: string } }) {
  const code = params.code
  const link = await prisma.link.findUnique({ where: { code } })
  if (!link) return notFound()

  await prisma.link.update({
    where: { code },
    data: { clicks: { increment: 1 }, lastClicked: new Date() }
  })

  return NextResponse.redirect(link.targetUrl, 302)
}
