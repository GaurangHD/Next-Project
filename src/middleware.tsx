// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '../src/lib/jwt';

// middleware.ts
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  if (!token && pathname.startsWith('/admin')) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  // For API routes or pages that need verification
  if (pathname.startsWith('/admin')) {
    const verifyResponse = await fetch(new URL('/api/auth/verify', request.url), {
      headers: { 'Cookie': `token=${token}` }
    })
    
    if (!verifyResponse.ok) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  return NextResponse.next()
}