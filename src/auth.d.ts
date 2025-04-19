// src/auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import 'next-auth';
import { DefaultSession } from 'next-auth'; // Import DefaultSession

// Extend the built-in session/user types to include the 'role' property
declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's role. */
      role?: string; // Make it optional or required based on your logic
    } & DefaultSession['user']; // Keep the default properties
  }

  interface User {
    /** The user's role. */
    role?: string; // Make it optional or required based on your logic
  }
}

// Also extend the JWT type if you added role there (which we did)
declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** User role */
    role?: string;
  }
}