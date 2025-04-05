// src/app/admin/(authenticated)/categories/edit/[id]/page.tsx
"use client"; // Needs client-side hooks

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CategoryForm, { CategoryFormData } from '@/components/admin/CategoryForm';
// TODO: Add toast notifications

interface EditCategoryPageProps {
  params: {
    id: string;
  };
}

export default function EditCategoryPage({ params }: EditCategoryPageProps) {
  const router = useRouter();
  const categoryId = parseInt(params.id, 10);
  const [categoryData, setCategoryData] = useState<CategoryFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(categoryId)) {
      setError("Invalid Category ID");
      setIsLoading(false);
      return;
    }

    const fetchCategory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Note: We don't have a GET /api/admin/categories/[id] endpoint yet.
        // For now, we'll fetch all categories and filter.
        // TODO: Implement a dedicated GET by ID endpoint for categories later.
        const response = await fetch('/api/admin/categories');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        const categories: CategoryFormData[] = await response.json();
        const foundCategory = categories.find(cat => cat.id === categoryId);

        if (!foundCategory) {
             throw new Error("Category not found");
        }
        setCategoryData(foundCategory);

      } catch (err) {
        console.error("Failed to fetch category:", err);
        setError(err instanceof Error ? err.message : "Failed to load category data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSaveSuccess = (savedCategoryId: number) => {
    console.log("Category updated with ID:", savedCategoryId);
    // TODO: Show success toast
    router.push('/admin/categories'); // Redirect to categories list after update
  };

  // Apply styling similar to other admin pages
  return (
    <div className="flex flex-col h-full text-black">
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="bg-card p-6 rounded-lg border shadow-sm space-y-6 mx-auto max-w-2xl">
          {/* Loading State */}
          {isLoading && (
            <p className="text-center text-muted-foreground">Loading category data...</p>
          )}

          {/* Error State */}
          {error && !isLoading && (
             <p className="text-center text-destructive">{error}</p>
          )}

          {/* Not Found State (covered by error, but good fallback) */}
          {!isLoading && !error && !categoryData && (
             <p className="text-center text-muted-foreground">Category not found.</p>
          )}

          {/* Content when data is loaded */}
          {!isLoading && !error && categoryData && (
            <>
              <h1 className="text-2xl font-semibold">Edit Category (ID: {categoryId})</h1>
              <CategoryForm initialData={categoryData} onSaveSuccess={handleSaveSuccess} />
            </>
          )}
        </div>
      </div>
    </div>
  );

  /* Original return structure commented out for reference

  if (isLoading) { ... }
  if (error) { ... }
  if (!categoryData) { ... }
  return ( ... original simple div ... );
  */
}