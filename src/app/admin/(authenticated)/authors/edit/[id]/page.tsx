// src/app/admin/(authenticated)/authors/edit/[id]/page.tsx
"use client"; // Needs client-side hooks

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthorForm, { AuthorFormData } from '@/components/admin/AuthorForm'; // Import the type
// TODO: Add toast notifications

interface EditAuthorPageProps {
  params: {
    id: string;
  };
}

export default function EditAuthorPage({ params }: EditAuthorPageProps) {
  const router = useRouter();
  const authorId = parseInt(params.id, 10);
  const [authorData, setAuthorData] = useState<AuthorFormData | null>(null); // Use the imported type
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(authorId)) {
      setError("Invalid Author ID");
      setIsLoading(false);
      return;
    }

    const fetchAuthor = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/authors/${authorId}`);
        if (response.status === 404) {
          throw new Error("Author not found");
        }
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAuthorData(data);
      } catch (err) {
        console.error("Failed to fetch author:", err);
        setError(err instanceof Error ? err.message : "Failed to load author data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAuthor();
  }, [authorId]);

  const handleSaveSuccess = (savedAuthorId: number) => {
    console.log("Author updated with ID:", savedAuthorId);
     // TODO: Show success toast
    router.push('/admin/authors'); // Redirect to authors list after update
  };

   if (isLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading author data...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-destructive">{error}</div>;
  }

  if (!authorData) {
    return <div className="container mx-auto px-4 py-8 text-center">Author not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Author (ID: {authorId})</h1>
      <AuthorForm initialData={authorData} onSaveSuccess={handleSaveSuccess} />
    </div>
  );
}