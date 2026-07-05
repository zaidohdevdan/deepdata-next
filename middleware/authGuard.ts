// middleware/authGuard.ts
// Global Next.js middleware to protect all routes except public pages and auth endpoints.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const PUBLIC_PATHS = [
  '/login',
  '/api/auth',
  '/_next',
  '/public',
  '/favicon.ico',
];

export async function middleware(request: NextRequest) {
  if (PUBLIC_PATHS.some((p) => request.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const secureCookie = request.nextUrl.protocol === 'https:';
  const token = await getToken({ 
    req: request, 
    secret,
    secureCookie
  });
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/:path*',
};
