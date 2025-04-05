import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { auth } from '@/auth'; // No longer using auth() helper here
import { getToken } from 'next-auth/jwt'; // Import getToken

export async function middleware(request: NextRequest) {
  // Use getToken to directly get the JWT payload from the request cookies
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET!,
    // salt is deprecated and usually not needed; getToken infers the cookie name
  });
  // console.log("Middleware Token:", token); // Optional: Log token for debugging
  const { pathname } = request.nextUrl;

  // Define protected admin routes (excluding the login page itself)
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  if (isAdminRoute) {
    // If no session exists, redirect to the NextAuth sign-in flow
    // Check if token exists (user is logged in)
    if (!token) {
      console.log("Middleware: No session, redirecting to login for", pathname);
      // Redirect to NextAuth's signin page, which should then redirect to our custom /admin/login (defined in auth.ts pages)
      const loginUrl = new URL('/api/auth/signin', request.url);
      loginUrl.searchParams.set('callbackUrl', request.nextUrl.href); // Pass the intended destination
      return NextResponse.redirect(loginUrl);
    }

    // If session exists, check for ADMIN role
    // Note: Ensure the 'role' property is correctly added in your auth.ts callbacks
    // Check for ADMIN role within the token (ensure 'role' is added in auth.ts jwt callback)
    if (token.role !== 'ADMIN') {
       console.log(`Middleware: User not ADMIN (role: ${token.role}), redirecting to login for`, pathname);
       const loginUrl = new URL('/api/auth/signin', request.url);
       loginUrl.searchParams.set('callbackUrl', request.nextUrl.href);
       // Redirecting back to login. Consider an 'unauthorized' page for better UX.
       return NextResponse.redirect(loginUrl);
    }

    // If session exists and user is ADMIN, allow access
    console.log("Middleware: Valid admin session found for", pathname);
  }

  // Allow the request to proceed for non-admin routes or authenticated admin users
  // Pass the pathname via a custom header so the layout can access it reliably
  const response = NextResponse.next();
  response.headers.set('x-pathname', pathname);
  return response;
}

// Config: Apply middleware to all routes except static files, images, and API routes.
// The logic inside the middleware function specifically handles '/admin'.
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};