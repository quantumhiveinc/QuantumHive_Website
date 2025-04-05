// src/app/admin/layout.tsx
import React from 'react';
// import { auth } from '@/app/api/auth/[...nextauth]/route'; // No longer needed here
// import { redirect } from 'next/navigation'; // No longer needed here
// Import the new components
import AdminHeader from '@/components/AdminHeader';
import AdminSidebar from '@/components/AdminSidebar';
import AdminAuthGuard from '@/components/AdminAuthGuard'; // Import the guard component
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Session check is now handled by AdminAuthGuard

  // If session is valid and user is ADMIN, render the layout
  return (
    // Use AdminAuthGuard to wrap the entire authenticated layout
    <AdminAuthGuard>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Add the Sidebar */}
        <AdminSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Add the Header */}
          <AdminHeader />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-800 p-6">
            {/* The actual page content */}
            {children}
          </main>
        </div>
      </div>
    </AdminAuthGuard>
  );
}