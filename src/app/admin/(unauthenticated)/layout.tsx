// src/app/admin/(unauthenticated)/layout.tsx
import React from 'react';

// This layout applies to routes within the (unauthenticated) group, like the login page.
// It does NOT include the AdminHeader or session checks.
export default function UnauthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Just render the children (e.g., the login page)
  return <>{children}</>;
}