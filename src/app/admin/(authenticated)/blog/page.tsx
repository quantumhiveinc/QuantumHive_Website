// src/app/admin/blog/page.tsx
"use client"; // This page requires client-side data fetching and interaction

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import BlogPostForm from '@/components/admin/BlogPostForm'; // Import the form
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  // DialogTrigger, // Not used directly here
  // DialogFooter, // Not used directly here
  // DialogClose, // Not used directly here
} from "@/components/ui/dialog";

// Define the structure of a BlogPost based on our Prisma schema (or API response)
interface BlogPost {
  id: number;
  title: string;
  slug: string;
  description?: string | null; // Add optional description
  content?: string | null;     // Add optional content
  published: boolean;
  createdAt: string; // Dates will likely be strings from JSON
  updatedAt: string;
}

export default function AdminBlogPage() {
  // const router = useRouter(); // Not used yet
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null); // Store post being edited

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

  // Placeholder for navigation
  const handleAddNew = () => {
    setEditingPost(null); // Ensure we are not editing
    setIsFormOpen(true); // Open the dialog
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post); // Set the post to edit
    setIsFormOpen(true); // Open the dialog
  };
  // Callback for when the form is saved successfully
  const handleSave = () => {
    setIsFormOpen(false); // Close the dialog
    setEditingPost(null); // Reset editing state
    fetchPosts(); // Refresh the list of posts
  };

  // Callback for when the form is cancelled
  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };


  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Blog Posts</h2>
        {/* Using DialogTrigger might be simpler if form is always in dialog */}
        <Button onClick={handleAddNew}>Add New Post</Button>
      </div>

      {loading && <p>Loading posts...</p>}
      {error && <p className="text-red-600">Error loading posts: {error}</p>}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No blog posts found.</TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">{post.title}</TableCell>
                  <TableCell>{post.slug}</TableCell>
                  <TableCell>{post.published ? 'Published' : 'Draft'}</TableCell>
                  <TableCell>{new Date(post.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>
                      Edit
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
     {/* Add/Edit Form Dialog - Moved inside the main div */}
     <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
       <DialogContent className="sm:max-w-[600px]"> {/* Adjust width as needed */}
         <DialogHeader>
           <DialogTitle>{editingPost ? 'Edit Blog Post' : 'Add New Blog Post'}</DialogTitle>
           <DialogDescription>
             {editingPost ? 'Update the details of the blog post.' : 'Fill in the details for the new blog post.'}
           </DialogDescription>
         </DialogHeader>
         {/* Conditionally render form only when dialog is open to ensure initialData is correctly passed */}
         {isFormOpen && (
           <BlogPostForm
             key={editingPost ? editingPost.id : 'new'} // Add key to force re-mount on edit/add switch
             initialData={editingPost ? {
                 id: editingPost.id,
                 title: editingPost.title,
                 // NOTE: For a real edit form, you'd fetch the full post data here
                 // based on editingPost.id instead of using placeholders.
                 description: editingPost.description || '', // Use existing description if available
                 content: editingPost.content || '',       // Use existing content if available
                 published: editingPost.published,
             } : undefined}
             onSave={handleSave}
             onCancel={handleCancel}
           />
         )}
       </DialogContent>
     </Dialog>
   </div>
 );
}