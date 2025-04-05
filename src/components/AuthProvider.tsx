// src/components/AuthProvider.tsx
"use client"; // This component must be a Client Component

import { SessionProvider } from "next-auth/react";
import React from "react";

interface AuthProviderProps {
  children: React.ReactNode;
  // We don't need to pass the session here as SessionProvider fetches it
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // SessionProvider needs to be the root of the part of the app
  // that needs access to the session.
  return <SessionProvider>{children}</SessionProvider>;
}