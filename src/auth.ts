// src/auth.ts
/**
 * @see https://authjs.dev/getting-started/typescript
 */

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials'; // Restore Credentials provider
// import { PrismaAdapter } from "@auth/prisma-adapter"; // Keep commented for now
// import prisma from "@/lib/prisma"; // Keep commented for now
export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  // adapter: PrismaAdapter(prisma), // Keep commented for now
  providers: [
    Credentials({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("[Auth] Authorize function called with credentials:", credentials); // <-- ADDED LOG
        // IMPORTANT: Replace with actual user lookup and password verification.
        // IMPORTANT: Replace with actual user lookup and password verification.
        if (credentials?.username === "admin" && credentials?.password === "password") { // insecure placeholder
          const user = { id: "1", name: "Admin User", email: "admin@example.com", role: "ADMIN" };
          console.log("[Auth] Credentials match. Returning user:", user); // <-- ADDED LOG
          // Return user object with role
          return user;
        } else {
          console.log("[Auth] Credentials do not match. Returning null."); // <-- ADDED LOG
          return null;
        }
      }
    })
    // Add other providers like Google, GitHub etc. if needed
  ],
  session: { strategy: "jwt" }, // Restore session strategy
  callbacks: { // Restore callbacks
    async jwt({ token, user }) {
      // Add role to the JWT token right after sign in
      if (user?.role) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Add role to the session object from the JWT token
      if (token?.role && session?.user) {
        session.user.role = token.role as string; // Add type assertion if needed
      }
      return session;
    },
  },
  pages: { signIn: '/admin/login' }, // Restore custom login page redirect
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
});