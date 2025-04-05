// src/app/admin/blog/page.tsx
"use client"; // This page requires client-side data fetching and interaction

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link'; // Import Link
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
  // AlertDialogTrigger, // Not needed if using controlled dialog
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
// Removed Dialog imports

// Define the structure of a BlogPost based on our Prisma schema (or API response)
// Updated BlogPost interface to include fetched relations
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: { id: number; name: string } | null;
  categories: { id: number; name: string }[];
  tags: { id: number; name: string }[];
  // Add other fields if needed by the table display
}

export default function AdminBlogPage() {
  // const router = useRouter(); // Not used yet
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  // Removed state related to the form dialog
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/blog'); // Fetch from our API route
      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }
      const data: BlogPost[] = await response.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      toast.error("Failed to load blog posts."); // Show error toast
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!postToDelete) return;

    try {
      const response = await fetch(`/api/admin/blog/${postToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete post: ${response.statusText}`);
      }

      toast.success(`Blog post "${postToDelete.title}" deleted successfully.`); // Show success toast
      setPosts(posts.filter(p => p.id !== postToDelete.id)); // Update state locally
      setShowDeleteDialog(false);
      setPostToDelete(null);

    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error(`Failed to delete post: ${err instanceof Error ? err.message : 'Unknown error'}`); // Show error toast
      setShowDeleteDialog(false);
      setPostToDelete(null);
    }
  };

  // Removed handler functions related to the form dialog


  return (
    // Apply styling similar to the other admin management pages
    <div className="flex flex-col h-full text-black">
      <div className="flex-grow p-4 overflow-y-auto">
        {/* Wrap content in a card */}
        <div className="bg-card p-6 rounded-lg border shadow-sm space-y-6">
          {/* Header row */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Manage Blog Posts</h2>
            <Button asChild>
                <Link href="/admin/blog/new">Add New Post</Link>
            </Button>
          </div>

          {/* Loading and Error States */}
          {loading && <p className="text-muted-foreground">Loading posts...</p>}
          {error && <p className="text-destructive">Error loading posts: {error}</p>}

          {/* Table */}
          {!loading && !error && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Author</TableHead> {/* Added Author column */}
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No blog posts found.</TableCell> {/* Updated colSpan */}
                  </TableRow>
                ) : (
                  posts.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">{post.title}</TableCell>
                      <TableCell>{post.slug}</TableCell>
                      <TableCell>{post.published ? 'Published' : 'Draft'}</TableCell>
                      <TableCell>{post.author?.name || 'N/A'}</TableCell> {/* Display author name */}
                      <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                         <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/blog/edit/${post.id}`}>Edit</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(post)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        {/* Delete Dialog remains outside the main card structure */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post
              titled &quot;{postToDelete?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Yes, delete post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Removed the Dialog and BlogPostForm */}
        </div> {/* End card */}
      </div> {/* End flex-grow */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the blog post
              titled &quot;{postToDelete?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPostToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Yes, delete post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div> // End flex container
  );
}