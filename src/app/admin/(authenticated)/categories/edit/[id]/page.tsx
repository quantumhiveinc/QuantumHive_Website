// src/app/admin/(authenticated)/categories/edit/[id]/page.tsx
// This is now a Server Component

import React from 'react';
import EditCategoryClient from '@/components/admin/EditCategoryClient'; // Import the new client component

interface EditCategoryPageProps {
  // Update params to be a Promise as expected by Next.js 15+ for Server Components
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCategoryPage({ params: paramsPromise }: EditCategoryPageProps) {
  // Await the params promise to get the actual parameters
  const params = await paramsPromise;

  // Server-side: Parse the ID directly from resolved params
  const categoryId = parseInt(params.id, 10);

  // Basic validation on the server side
  if (isNaN(categoryId)) {
    return (
      <div className="flex flex-col h-full text-black">
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="bg-card p-6 rounded-lg border shadow-sm space-y-6 mx-auto max-w-2xl">
            <p className="text-center text-destructive">Invalid Category ID provided in URL.</p>
          </div>
        </div>
      </div>
    );
  }

  // Apply styling similar to other admin pages
  return (
    <div className="flex flex-col h-full text-black">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="bg-card p-6 rounded-lg border shadow-sm space-y-6 mx-auto max-w-2xl">
          {/* Render the client component and pass the validated ID */}
          <EditCategoryClient categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
}