// src/types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Define a role enum or type if you prefer stricter role management
// export enum Role {
//   USER = "USER",
//   ADMIN = "ADMIN",
// }

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: string; // Or use Role enum: role?: Role;
    // Add other custom properties if needed
  }
}

// Extend the User type
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string; // Or use Role enum: role?: Role;
    // Add other custom properties if needed
  }

  // Extend the Session type
  interface Session extends DefaultSession {
    user?: {
      role?: string; // Or use Role enum: role?: Role;
    } & DefaultSession["user"]; // Keep the default properties
    // Add other custom session properties if needed
  }
}