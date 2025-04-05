// src/app/admin/(authenticated)/categories/page.tsx
"use client"; // Needs client-side state

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import CategoriesTable from '@/components/admin/CategoriesTable'; // Import the table
import { toast } from "sonner"; // Assuming sonner is installed

// Define Category type matching the table component's expectation
interface Category {
    id: number;
    name: string;
    slug: string;
    _count?: { posts: number };
}

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/categories');
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      const data: Category[] = await response.json();
      setCategories(data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      toast.error("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Handler for when a category is successfully deleted
  const handleDeleteSuccess = (deletedCategoryId: number) => {
    setCategories(prevCategories => prevCategories.filter(cat => cat.id !== deletedCategoryId));
  };

  return (
    // Apply styling similar to the Create Category page
    <div className="flex flex-col h-full text-black">
      <div className="flex-grow p-4 overflow-y-auto">
        {/* Wrap content in a card */}
        <div className="bg-card p-6 rounded-lg border shadow-sm space-y-6">
          {/* Header row */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Manage Categories</h1> {/* Updated heading style */}
         <Button asChild>
           <Link href="/admin/categories/new">Create New Category</Link>
        </Button>
      </div>

          {/* Loading and Error States */}
          {loading && <p className="text-muted-foreground">Loading categories...</p>}
          {error && <p className="text-destructive">Error loading categories: {error}</p>}

          {/* Table */}
          {!loading && !error && (
            <CategoriesTable categories={categories} onDeleteSuccess={handleDeleteSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}