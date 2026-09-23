import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const authCookie = req.cookies.get('auth_token');
    
    // If no valid cookie, redirect to /login
    if (!authCookie || authCookie.value !== 'Corte2026') {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
