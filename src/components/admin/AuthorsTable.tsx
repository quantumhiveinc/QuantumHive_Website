// src/components/admin/AuthorsTable.tsx
"use client"; // Needs client-side interaction for delete confirmation

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
import { toast } from "sonner"; // Assuming sonner is installed for toasts

// Define Author type (ideally import from shared types or Prisma)
interface Author {
    id: number;
    name: string;
    slug: string;
    profileImageUrl?: string | null;
    // Add _count if fetching post count from API
    _count?: {
        posts: number;
    };
}

interface AuthorsTableProps {
    authors: Author[];
    onDeleteSuccess: (authorId: number) => void; // Callback after successful delete
}

export default function AuthorsTable({ authors, onDeleteSuccess }: AuthorsTableProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [authorToDelete, setAuthorToDelete] = useState<Author | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDeleteClick = (author: Author) => {
        setAuthorToDelete(author);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!authorToDelete) return;
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/admin/authors/${authorToDelete.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to delete author: ${response.statusText}`);
            }

            toast.success(`Author "${authorToDelete.name}" deleted successfully.`);
            onDeleteSuccess(authorToDelete.id); // Notify parent component
            setShowDeleteDialog(false);
            setAuthorToDelete(null);

        } catch (err) {
            console.error("Error deleting author:", err);
            toast.error(`Failed to delete author: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setShowDeleteDialog(false);
            setAuthorToDelete(null);
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
                    {authors.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} className="text-center">No authors found.</TableCell>
                        </TableRow>
                    ) : (
                        authors.map((author) => (
                            <TableRow key={author.id}>
                                <TableCell className="font-medium">{author.name}</TableCell>
                                <TableCell>{author.slug}</TableCell>
                                {/* Optional: <TableCell>{author._count?.posts ?? 0}</TableCell> */}
                                <TableCell className="text-right space-x-2">
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/authors/edit/${author.id}`}>Edit</Link>
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => handleDeleteClick(author)}
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
                            This action cannot be undone. This will permanently delete the author
                            &quot;{authorToDelete?.name}&quot;. Associated blog posts will have their author set to null.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAuthorToDelete(null)} disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} disabled={isDeleting} className="bg-red-600 hover:bg-red-700">
                            {isDeleting ? 'Deleting...' : 'Yes, delete author'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}