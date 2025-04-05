import React from 'react';
// import { auth } from '@/auth'; // No longer needed here
// import { redirect } from 'next/navigation'; // No longer needed here

// This component now just acts as a wrapper, as auth is handled by middleware.
// It doesn't need to be async anymore.
export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  // Authentication and authorization are handled by src/middleware.ts
  // This component simply renders its children if the middleware allows the request.
  return <>{children}</>;
}