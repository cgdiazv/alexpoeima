import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get('admin_session')?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/dashboard') && (!sessionToken || sessionToken !== 'authenticated_alexpoeima_user')) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  if (pathname === '/admin' && sessionToken === 'authenticated_alexpoeima_user') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
};
