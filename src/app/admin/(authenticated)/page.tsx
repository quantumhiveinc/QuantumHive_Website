// src/app/admin/page.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link'; // Import Link for navigation

// This page is protected by the src/app/admin/layout.tsx which checks for admin session

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-slate-900">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder Card for Blog Management */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Blog Posts</CardTitle>
            <CardDescription>Create, edit, and delete blog articles.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add link once the blog management page exists */}
            <Link href="/admin/blog" className="text-blue-600 hover:underline">
              Go to Blog Management (Coming Soon)
            </Link>
          </CardContent>
        </Card>

        {/* Placeholder Card for Case Studies Management */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Case Studies</CardTitle>
            <CardDescription>Create, edit, and delete case studies.</CardDescription>
          </CardHeader>
          <CardContent>
             {/* Add link once the case studies management page exists */}
             <Link href="/admin/case-studies" className="text-blue-600 hover:underline">
               Go to Case Studies Management (Coming Soon)
             </Link>
          </CardContent>
        </Card>

        {/* Placeholder Card for Industries Management */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Industries</CardTitle>
            <CardDescription>Create, edit, and delete industry pages.</CardDescription>
          </CardHeader>
          <CardContent>
             {/* Add link once the industries management page exists */}
             <Link href="/admin/industries" className="text-blue-600 hover:underline">
               Go to Industries Management (Coming Soon)
             </Link>
          </CardContent>
        </Card>

        {/* Add more cards for other admin sections if needed */}

      </div>
    </div>
  );
}