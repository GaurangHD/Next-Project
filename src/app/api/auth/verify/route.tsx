// app/api/auth/verify/route.ts
import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/jwt'

export const runtime = 'nodejs' // Explicit Node.js runtime

export async function GET(request: Request) {
  const token = request.headers.get('cookie')?.split('token=')[1]?.split(';')[0]
  
  if (!token) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }

  try {
    const isValid = await verifyToken(token)
    return NextResponse.json({ valid: isValid })
  } catch (error) {
    return NextResponse.json({ valid: false }, { status: 401 })
  }
}