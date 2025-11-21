'use client'
import React, { useEffect, useState } from 'react'

type Link = { code: string; targetUrl: string; clicks: number; lastClicked: string | null; createdAt: string }

function isValidUrl(url: string) {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:'].includes(parsed.protocol)
  } catch { return false }
}

export default function Dashboard() {
  const [links, setLinks] = useState<Link[] | null>(null)
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch('/api/links')
      if (!res.ok) throw new Error('Failed to load links')
      const data = await res.json()
      setLinks(data)
    } catch (e: any) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    
    if (!url.trim()) return setError('URL is required')
    if (!isValidUrl(url)) return setError('Please enter a valid HTTP/HTTPS URL')
    if (code && !/^[A-Za-z0-9]{3,64}$/.test(code)) return setError('Code must be 3-64 alphanumeric characters')
    
    setCreating(true)
    try {
      const res = await fetch('/api/links', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ url: url.trim(), code: code.trim() || undefined }) 
      })
      if (res.status === 409) throw new Error('Code already exists')
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body?.error || 'Failed to create link')
      }
      setUrl('')
      setCode('')
      await load()
    } catch (e: any) { 
      setError(e.message) 
    } finally { 
      setCreating(false) 
    }
  }

  async function remove(c: string) {
    if (!confirm('Delete this link? This action cannot be undone.')) return
    setDeleting(c)
    try {
      const res = await fetch(`/api/links/${c}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      await load()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">TinyLink</h1>
        <p className="text-gray-600 mt-1">Create short links for easy sharing</p>
      </header>

      <form onSubmit={create} className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="https://example.com" 
              value={url} 
              onChange={e => setUrl(e.target.value)}
              disabled={creating}
            />
            <input 
              className="sm:w-40 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
              placeholder="Custom code (optional)" 
              value={code} 
              onChange={e => setCode(e.target.value)}
              disabled={creating}
            />
            <button 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium" 
              disabled={creating || !url.trim()}
            >
              {creating ? 'Creating...' : 'Create Link'}
            </button>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </form>

      <section className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Your Links</h2>
        </div>
        <div className="p-6">
          {loading && !links && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading links...</p>
            </div>
          )}
          {!loading && links?.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No links created yet</p>
              <p className="text-sm text-gray-400 mt-1">Create your first short link above</p>
            </div>
          )}
          {links && links.length > 0 && (
            <div className="space-y-3">
              {links.map(l => (
                <div key={l.code} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <a 
                          className="text-blue-600 font-medium hover:underline" 
                          href={`/${l.code}`} 
                          target="_blank" 
                          rel="noreferrer"
                        >
                          /{l.code}
                        </a>
                        <button 
                          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 border rounded"
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/${l.code}`)}
                        >
                          Copy
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 truncate">{l.targetUrl}</div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span>Clicks:</span>
                        <span className="font-medium text-gray-900">{l.clicks}</span>
                      </div>
                      <button 
                        className="text-red-600 hover:text-red-700 disabled:opacity-50" 
                        onClick={() => remove(l.code)}
                        disabled={deleting === l.code}
                      >
                        {deleting === l.code ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
