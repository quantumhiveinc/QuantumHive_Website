"use client"; // This component needs client-side hooks

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CategoryForm, { CategoryFormData } from '@/components/admin/CategoryForm';
// TODO: Add toast notifications

interface EditCategoryClientProps {
  categoryId: number; // Receive the ID as a prop
}

export default function EditCategoryClient({ categoryId }: EditCategoryClientProps) {
  const router = useRouter();
  const [categoryData, setCategoryData] = useState<CategoryFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isNaN(categoryId)) {
      setError("Invalid Category ID provided");
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

  // Loading State
  if (isLoading) {
    return <p className="text-center text-muted-foreground">Loading category data...</p>;
  }

  // Error State
  if (error) {
     return <p className="text-center text-destructive">{error}</p>;
  }

  // Not Found State (covered by error, but good fallback)
  if (!categoryData) {
     return <p className="text-center text-muted-foreground">Category not found.</p>;
  }

  // Content when data is loaded
  return (
    <>
      <h1 className="text-2xl font-semibold">Edit Category (ID: {categoryId})</h1>
      <CategoryForm initialData={categoryData} onSaveSuccess={handleSaveSuccess} />
    </>
  );
}