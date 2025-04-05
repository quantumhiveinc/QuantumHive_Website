// src/components/admin/CategoriesTable.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Define Category type
interface Category {
    id: number;
    name: string;
    slug: string;
    // Add _count if fetching post count from API
    _count?: {
        posts: number;
    };
}

interface CategoriesTableProps {
    categories: Category[];
    onDeleteSuccess: (categoryId: number) => void;
}

export default function CategoriesTable({ categories, onDeleteSuccess }: CategoriesTableProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/categories/${categoryToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete category: ${response.statusText}`);
            }

            toast.success(`Category "${categoryToDelete.name}" deleted successfully.`);
            onDeleteSuccess(categoryToDelete.id);
            setShowDeleteDialog(false);
            setCategoryToDelete(null);

        } catch (err) {
            console.error("Error deleting category:", err);
            toast.error(`Failed to delete category: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setShowDeleteDialog(false);
            setCategoryToDelete(null);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        {/* Optional: <TableHead>Post Count</TableHead> */}
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">No categories found.</TableCell>
                        </TableRow>
                    ) : (
                        categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>{category.slug}</TableCell>
                                {/* Optional: <TableCell>{category._count?.posts ?? 0}</TableCell> */}
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/categories/edit/${category.id}`}>Edit</Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteClick(category)}
                                        disabled={isDeleting}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the category
                            &quot;{categoryToDelete?.name}&quot;. It will be removed from all associated blog posts.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setCategoryToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? 'Deleting...' : 'Yes, delete category'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}