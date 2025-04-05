// src/app/admin/(authenticated)/blog/new/page.tsx
"use client"; // This page needs client-side interactivity for form handling and navigation

import React from 'react';
import { useRouter } from 'next/navigation';
import FullPageBlogPostEditor, { BlogPostFormData } from '@/components/admin/FullPageBlogPostEditor'; // Import type
// TODO: Add toast notifications (e.g., react-hot-toast)

export default function NewBlogPostPage() {
  const router = useRouter();

  const handleSave = async (data: BlogPostFormData) => { // Use the imported type
    console.log("Saving new post:", data); // Log data being sent
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const newPost = await response.json();
      console.log("Post created:", newPost);
      // TODO: Show success toast
      router.push('/admin/blog'); // Redirect to the blog list page on success
      // Optionally redirect to the edit page: router.push(`/admin/blog/edit/${newPost.id}`);

    } catch (error) {
      console.error("Failed to create blog post:", error);
      // TODO: Show error toast
    }
  };

  const handleCancel = () => {
    router.push('/admin/blog'); // Navigate back to the list page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Create New Blog Post</h1>
      <FullPageBlogPostEditor onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}