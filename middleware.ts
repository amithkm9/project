// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // Get the pathname
  const pathname = req.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/signup', '/login', '/about', '/contact'];
  
  // Routes that require authentication
  const protectedRoutes = ['/home', '/course', '/profile', '/settings', '/progress'];

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.includes(pathname);

  if (isProtectedRoute) {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Check localStorage fallback (for client-side routing)
      const url = req.nextUrl.clone();
      url.pathname = '/signup';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // If user is logged in and trying to access login/signup, redirect to home
  if (isPublicRoute && (pathname === '/login' || pathname === '/signup')) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const url = req.nextUrl.clone();
      url.pathname = '/home';
      return NextResponse.redirect(url);
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};