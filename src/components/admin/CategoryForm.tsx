// src/components/admin/CategoryForm.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// TODO: Add toast notifications

// Define Category type (ideally import from shared types or Prisma)
export interface CategoryFormData {
    id?: number;
    name: string;
    slug?: string; // Slug is generated/updated server-side
}

interface CategoryFormProps {
    initialData?: CategoryFormData;
    onSaveSuccess: (categoryId: number) => void; // Callback on successful save
}

export default function CategoryForm({ initialData, onSaveSuccess }: CategoryFormProps) {
    const router = useRouter();
    const [name, setName] = useState(initialData?.name || '');
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);

        const url = initialData?.id ? `/api/admin/categories/${initialData.id}` : '/api/admin/categories';
        const method = initialData?.id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }), // Only send name, slug is handled server-side
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const savedCategory = await response.json();
            // TODO: Show success toast
            onSaveSuccess(savedCategory.id); // Call success callback

        } catch (error) {
            console.error("Failed to save category:", error);
            setSaveError(error instanceof Error ? error.message : 'Failed to save category');
            // TODO: Show error toast
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Display */}
            {saveError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{saveError}</span>
                </div>
            )}
            {/* Name */}
            <div className="space-y-2"> {/* Added space-y-2 */}
                <Label htmlFor="name">Category Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter category name"
                />
            </div>

            {/* Save/Cancel Buttons */}
            {/* Updated class, removed inline error */}
            <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : (initialData ? 'Update Category' : 'Create Category')}
                </Button>
            </div>
        </form>
    );
}