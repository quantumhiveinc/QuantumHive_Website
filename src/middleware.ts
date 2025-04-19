import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// import { auth } from '@/auth'; // No longer using auth() helper here
import { getToken } from 'next-auth/jwt'; // Import getToken

export async function middleware(request: NextRequest) {
  const authSecret = process.env.AUTH_SECRET; // Changed to AUTH_SECRET

  // Explicitly check if the secret is available at runtime
  if (!authSecret) { // Changed to authSecret
    console.error("FATAL ERROR in middleware: AUTH_SECRET environment variable is not set or not accessible."); // Changed message
    // Return a generic server error response as the application cannot proceed securely
    return new NextResponse(
      'Internal Server Error: Authentication configuration is missing.',
      { status: 500 }
    );
  }

  // Use getToken to directly get the JWT payload from the request cookies
  console.log("Attempting getToken. AUTH_SECRET type:", typeof authSecret); // Changed log
  console.log("AUTH_SECRET value (first 5 chars):", authSecret?.substring(0, 5)); // Changed log
  console.log("Using salt:", '__Secure-authjs.session-token'); // Log the salt being used
  const token = await getToken({
    req: request,
    secret: authSecret, // Changed to authSecret
    // salt is required in v5 beta, typically matches the secure cookie name
    salt: '__Secure-authjs.session-token', // Use 'authjs.session-token' if using http
  });
  // console.log("Middleware Token:", token); // Optional: Log token for debugging
  const { pathname } = request.nextUrl;

  // Define protected admin routes (excluding the login page itself)
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login');

  if (isAdminRoute) {
    // If no session exists, redirect to the NextAuth sign-in flow
    // Check if token exists (user is logged in)
    console.log(`[Middleware Debug] Checking token for path: ${pathname}`); // <-- ADDED LOG
    if (!token) {
      console.log("Middleware: No session, redirecting to login for", pathname);
      console.log("Middleware: request.url:", request.url); // <-- ADDED LOG
      console.log("Middleware: request.nextUrl.href:", request.nextUrl.href); // <-- ADDED LOG
      console.log(`[Middleware Debug] Token not found. Redirecting to login.`); // <-- ADDED LOG
      // Redirect to NextAuth's signin page, using NEXTAUTH_URL as the base
      const baseLoginUrl = `${process.env.NEXTAUTH_URL}/api/auth/signin`;
      const callbackDestination = `${process.env.NEXTAUTH_URL}${pathname}`; // Construct callback using NEXTAUTH_URL + original path
      const loginUrl = new URL(baseLoginUrl);
      loginUrl.searchParams.set('callbackUrl', callbackDestination); // Pass the correctly constructed destination
      console.log("Middleware: Redirecting to loginUrl:", loginUrl.toString()); // <-- ADDED LOG
      return NextResponse.redirect(loginUrl);
    }

    console.log(`[Middleware Debug] Token found. Checking role.`); // <-- ADDED LOG
    console.log(`[Middleware Debug] Token details:`, JSON.stringify(token, null, 2)); // <-- ADDED LOG (Log entire token)

    // If session exists, check for ADMIN role
    // Note: Ensure the 'role' property is correctly added in your auth.ts callbacks
    // Check for ADMIN role within the token (ensure 'role' is added in auth.ts jwt callback)
    if (token.role !== 'ADMIN') {
       console.log(`Middleware: User not ADMIN (role: ${token.role}), redirecting to login for`, pathname);
       console.log("Middleware: request.url:", request.url); // <-- ADDED LOG
       console.log("Middleware: request.nextUrl.href:", request.nextUrl.href); // <-- ADDED LOG
       console.log(`[Middleware Debug] Role is not ADMIN (${token.role}). Redirecting to login.`); // <-- ADDED LOG
       // Redirect to NextAuth's signin page, using NEXTAUTH_URL as the base
       const baseLoginUrl = `${process.env.NEXTAUTH_URL}/api/auth/signin`;
       const callbackDestination = `${process.env.NEXTAUTH_URL}${pathname}`; // Construct callback using NEXTAUTH_URL + original path
       const loginUrl = new URL(baseLoginUrl);
       loginUrl.searchParams.set('callbackUrl', callbackDestination); // Pass the correctly constructed destination
       console.log("Middleware: Redirecting to loginUrl (unauthorized):", loginUrl.toString()); // <-- ADDED LOG
       // Redirecting back to login. Consider an 'unauthorized' page for better UX.
       return NextResponse.redirect(loginUrl);
    }

    // If session exists and user is ADMIN, allow access
    console.log("Middleware: Valid admin session found for", pathname);
    console.log(`[Middleware Debug] Role is ADMIN. Allowing request.`); // <-- ADDED LOG
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