import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // Usuario y contraseña para el panel
      if (user === 'admin' && pwd === 'Corte2026') {
        return NextResponse.next();
      }
    }

    return new NextResponse('Acceso denegado', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Panel Privado de Reservas"',
      },
    });
  }
}

export const config = {
  matcher: ['/admin/:path*'],
};
