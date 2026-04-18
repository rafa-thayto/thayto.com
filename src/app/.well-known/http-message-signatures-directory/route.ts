import { NextResponse } from 'next/server'

const PUBLIC_KEY = {
  kty: 'OKP',
  crv: 'Ed25519',
  x: '_0LqPzYj5kUDWwT51NsfVqXW7T8aKQ4ec43FYNR4E8Q',
  kid: 'ngi_MYsqiLe95lKsDFzUoWrENno5iRHDGj5-AUbR02c',
  use: 'sig',
  alg: 'EdDSA',
}

export async function GET() {
  return NextResponse.json(
    { keys: [PUBLIC_KEY] },
    {
      headers: {
        'Content-Type': 'application/http-message-signatures-directory+json',
        'Cache-Control': 'public, max-age=86400',
      },
    },
  )
}
