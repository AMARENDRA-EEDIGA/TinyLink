import React from 'react'

type Link = { code: string; targetUrl: string; clicks: number; lastClicked: string | null; createdAt: string }

async function getLink(code: string) {
  const res = await fetch(`${process.env.BASE_URL || ''}/api/links/${code}`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Not found')
  return res.json() as Promise<Link>
}

export default async function Page({ params }: { params: { code: string } }) {
  let link: Link
  try {
    link = await getLink(params.code)
  } catch {
    return <div className="text-red-600">Link not found</div>
  }

  const full = (typeof window !== 'undefined' ? window.location.origin : (process.env.BASE_URL || '')) + `/${link.code}`

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Stats for {link.code}</h1>
      <div className="mb-4">
        <div className="text-sm text-gray-600">Target URL</div>
        <a className="text-blue-600" href={link.targetUrl} target="_blank" rel="noreferrer">{link.targetUrl}</a>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-white rounded shadow-sm">
          <div className="text-sm text-gray-600">Clicks</div>
          <div className="text-lg font-medium">{link.clicks}</div>
        </div>
        <div className="p-3 bg-white rounded shadow-sm">
          <div className="text-sm text-gray-600">Last Clicked</div>
          <div className="text-lg">{link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '—'}</div>
        </div>
      </div>
      <div className="mt-4">
        <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={() => navigator.clipboard?.writeText(full)}>Copy full URL</button>
      </div>
    </div>
  )
}
