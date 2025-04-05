// src/app/admin/(authenticated)/blog/edit/[id]/page.tsx
"use client"; // Needs client-side hooks for data fetching, state, and navigation

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FullPageBlogPostEditor, { BlogPostFormData } from '@/components/admin/FullPageBlogPostEditor';
// TODO: Add toast notifications

interface EditBlogPostPageProps {
  params: {
    id: string;
  };
}

export default function EditBlogPostPage({ params }: EditBlogPostPageProps) {
  const router = useRouter();
  const postId = parseInt(params.id, 10);
  const [postData, setPostData] = useState<Partial<BlogPostFormData> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(postId)) {
      setError("Invalid Post ID");
      setIsLoading(false);
      return;
    }

    const fetchPost = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/blog/${postId}`);
        if (response.status === 404) {
          throw new Error("Blog post not found");
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Transform data slightly if needed to match BlogPostFormData structure
        // e.g., map categories/tags/galleryImages if API returns full objects
        const initialFormData: Partial<BlogPostFormData> = {
            ...data,
            categoryIds: data.categories?.map((cat: { id: number }) => cat.id) || [],
            tagNames: data.tags?.map((tag: { name: string }) => tag.name) || [],
            // galleryImages structure should match if API includes it correctly
        };
        setPostData(initialFormData);
      } catch (err) {
        console.error("Failed to fetch blog post:", err);
        setError(err instanceof Error ? err.message : "Failed to load post data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [postId]); // Refetch if postId changes (though unlikely in this route structure)

  const handleSave = async (data: BlogPostFormData) => {
    console.log("Updating post:", postId, data);
    try {
      const response = await fetch(`/api/admin/blog/${postId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const updatedPost = await response.json();
      console.log("Post updated:", updatedPost);
      // TODO: Show success toast
      router.push('/admin/blog'); // Redirect to the list page

    } catch (error) {
      console.error("Failed to update blog post:", error);
      // TODO: Show error toast
    }
  };

  const handleCancel = () => {
    router.push('/admin/blog');
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading post data...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-destructive">{error}</div>;
  }

  if (!postData) {
     // Should be covered by error state, but as a fallback
    return <div className="container mx-auto px-4 py-8 text-center">Blog post not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Blog Post (ID: {postId})</h1>
      {/* Pass fetched data as initialData */}
      <FullPageBlogPostEditor initialData={postData} onSave={handleSave} onCancel={handleCancel} />
    </div>
  );
}