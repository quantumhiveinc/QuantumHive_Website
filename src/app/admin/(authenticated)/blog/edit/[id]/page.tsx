// src/app/admin/(authenticated)/blog/edit/[id]/page.tsx
// This is now a Server Component

import React from 'react';
import EditBlogPostClient from '@/components/admin/EditBlogPostClient'; // Import the new client component

interface EditBlogPostPageProps {
  // Update params to be a Promise as expected by Next.js 15+ for Server Components
  params: Promise<{
    id: string;
  }>;
}

export default async function EditBlogPostPage({ params: paramsPromise }: EditBlogPostPageProps) {
  // Await the params promise to get the actual parameters
  const params = await paramsPromise;

  // Server-side: Parse the ID directly from resolved params
  const postId = parseInt(params.id, 10);

  // Basic validation on the server side
  if (isNaN(postId)) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-destructive">
        Invalid Blog Post ID provided in URL.
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Render the client component and pass the validated ID */}
      <EditBlogPostClient postId={postId} />
    </div>
  );
}