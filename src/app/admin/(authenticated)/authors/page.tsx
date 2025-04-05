// src/app/admin/(authenticated)/authors/page.tsx
"use client"; // Needs client-side state for table updates

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AuthorsTable from '@/components/admin/AuthorsTable'; // Import the table component
import { toast } from "sonner"; // Assuming sonner is installed

// Define Author type matching the table component's expectation
interface Author {
    id: number;
    name: string;
    slug: string;
    profileImageUrl?: string | null;
    _count?: { posts: number };
}

export default function ManageAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAuthors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/authors'); // Fetch from our API route
      if (!response.ok) {
        throw new Error(`Failed to fetch authors: ${response.statusText}`);
      }
      const data: Author[] = await response.json();
      setAuthors(data);
    } catch (err) {
      console.error("Error fetching authors:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      toast.error("Failed to load authors.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthors();
  }, [fetchAuthors]);

  // Handler for when an author is successfully deleted in the child component
  const handleDeleteSuccess = (deletedAuthorId: number) => {
    setAuthors(prevAuthors => prevAuthors.filter(author => author.id !== deletedAuthorId));
  };


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Authors</h1>
        <Button asChild>
           <Link href="/admin/authors/new">Create New Author</Link>
        </Button>
      </div>

      {loading && <p>Loading authors...</p>}
      {error && <p className="text-red-600">Error loading authors: {error}</p>}

      {!loading && !error && (
         <AuthorsTable authors={authors} onDeleteSuccess={handleDeleteSuccess} />
      )}
    </div>
  );
}