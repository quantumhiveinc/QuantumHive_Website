// src/app/admin/(authenticated)/authors/new/page.tsx
"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import AuthorForm from '@/components/admin/AuthorForm';
// TODO: Add toast notifications

export default function NewAuthorPage() {
  const router = useRouter();

  const handleSaveSuccess = (authorId: number) => {
    console.log("Author created with ID:", authorId);
    // TODO: Show success toast
    router.push('/admin/authors'); // Redirect to authors list after creation
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create New Author</h1>
      <AuthorForm onSaveSuccess={handleSaveSuccess} />
    </div>
  );
}