import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createIntlMiddleware(routing);

export function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  const token = request.cookies.get('auth_token');
  const { pathname, origin, locale } = request.nextUrl;

  const protectedRoutes = ['/client', '/variables', '/history'];
  const publicRoutes = ['/login', '/signup'];

  const normalizedPath = pathname.replace(/^\/(en|ru)(\/|$)/, '/');

  const matchesProtected = protectedRoutes.some(
    (route) =>
      normalizedPath === route || normalizedPath.startsWith(`${route}/`)
  );

  const matchesPublic = publicRoutes.some(
    (route) =>
      normalizedPath === route || normalizedPath.startsWith(`${route}/`)
  );

  if (matchesProtected) {
    if (!token) {
      return NextResponse.redirect(`${origin}/${locale}`);
    }
  }

  if (matchesPublic) {
    if (token) {
      return NextResponse.redirect(`${origin}/${locale}`);
    }
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)'],
};
