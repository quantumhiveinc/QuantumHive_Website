// src/components/admin/BlogPostForm.tsx
"use client";

import React, { useState } from 'react';
// import { useRouter } from 'next/navigation'; // Not used in this component directly
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea component exists
import { Checkbox } from "@/components/ui/checkbox"; // Assuming Checkbox component exists
import { toast } from "sonner";

// Define the structure for form data, including optional id for editing
interface BlogPostFormData {
  id?: number;
  title: string;
  description: string;
  content: string;
  published: boolean;
}

interface BlogPostFormProps {
  initialData?: BlogPostFormData; // Optional initial data for editing
  onSave: () => void; // Callback function after successful save
  onCancel: () => void; // Callback function for cancellation
}

export default function BlogPostForm({ initialData, onSave, onCancel }: BlogPostFormProps) {
  // const router = useRouter(); // Not needed here
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    published: initialData?.published || false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData?.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
     if (typeof checked === 'boolean') {
        setFormData(prev => ({ ...prev, published: checked }));
     }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const apiUrl = isEditing ? `/api/admin/blog/${initialData.id}` : '/api/admin/blog';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} post`);
      }

      toast.success(`Blog post ${isEditing ? 'updated' : 'created'} successfully!`);
      onSave(); // Trigger callback (e.g., close modal, refresh list)

    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} post:`, err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
       {error && (
         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
        </div>
       )}
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          disabled={loading}
          maxLength={250} // Add reasonable length limit
        />
      </div>
       <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={loading}
          rows={3}
        />
        <p className="text-sm text-muted-foreground">
          A short summary or excerpt for display on listing pages.
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content (Markdown supported)</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          disabled={loading}
          rows={10} // Adjust rows as needed
        />
         <p className="text-sm text-muted-foreground">
          Main body of the blog post. Basic Markdown is processed.
        </p>
      </div>
       <div className="flex items-center space-x-2">
        <Checkbox
            id="published"
            checked={formData.published}
            onCheckedChange={handleCheckboxChange}
            disabled={loading}
        />
        <Label htmlFor="published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Publish post
        </Label>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
         <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
         </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Post' : 'Create Post')}
        </Button>
      </div>
    </form>
  );
}