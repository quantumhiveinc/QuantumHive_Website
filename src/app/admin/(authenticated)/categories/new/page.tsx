// src/app/admin/(authenticated)/categories/new/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import CategoryForm from '@/components/admin/CategoryForm';
// TODO: Add toast notifications

export default function NewCategoryPage() {
  const router = useRouter();

  const handleSaveSuccess = (categoryId: number) => {
    console.log("Category created with ID:", categoryId);
    // TODO: Show success toast
    router.push('/admin/categories'); // Redirect to categories list after creation
  };

  return (
    // Apply styling similar to FullPageBlogPostEditor's main container and content columns
    <div className="flex flex-col h-full text-black"> {/* Added text-black for accessibility */}
      <div className="flex-grow p-4 overflow-y-auto"> {/* Added padding and scroll */}
        {/* Center content and apply card styling */}
        <div className="space-y-6 bg-card p-6 rounded-lg border shadow-sm mx-auto max-w-2xl">
          <h1 className="text-2xl font-semibold">Create New Category</h1> {/* Adjusted heading style */}
          <CategoryForm onSaveSuccess={handleSaveSuccess} />
        </div>
      </div>
    </div>
  );
}