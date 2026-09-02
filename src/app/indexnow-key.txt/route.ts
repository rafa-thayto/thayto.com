import { NextResponse } from 'next/server'

// IndexNow verifies ownership by fetching the key from the host; the payload
// points here via keyLocation, so the key never has to be a public file name.
export async function GET() {
  const key = process.env.INDEXNOW_KEY
  if (!key) {
    return new NextResponse('Not Found', { status: 404 })
  }
  return new NextResponse(key, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
