import './globals.css'

export const metadata = {
  title: 'TinyLink',
  description: 'Tiny URL service with Next.js + Neon + Prisma',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </body>
    </html>
  )
}
