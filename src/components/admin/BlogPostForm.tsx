// src/components/admin/BlogPostForm.tsx
"use client";

import React, { useState } from 'react'; // Removed unused useMemo
import Image from 'next/image';
// import dynamic from 'next/dynamic'; // Import dynamic (No longer needed for static import test)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea"; // No longer needed for description
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import UnsplashImageSearch from './UnsplashImageSearch';
import TiptapEditor from './TiptapEditor'; // Use static import for testing
import './TiptapEditor.css'; // Keep CSS import

// Define the structure for form data, including optional id for editing
interface BlogPostFormData {
  id?: number;
  title: string;
  description: string;
  content: string;
  published: boolean;
  featuredImageUrl?: string | null;
  featuredImageUnsplashUrl?: string | null; // Link to the image page on Unsplash
  featuredImagePhotographerName?: string | null; // Photographer's name
  featuredImagePhotographerUrl?: string | null; // Link to photographer's profile
}

interface BlogPostFormProps {
  initialData?: BlogPostFormData; // Optional initial data for editing
  onSave: () => void; // Callback function after successful save
  onCancel: () => void; // Callback function for cancellation
}

// Dynamically import TiptapEditor with SSR disabled
// const TiptapEditor = dynamic(() => import('./TiptapEditor'), { ssr: false }); // Temporarily disable dynamic import

export default function BlogPostForm({ initialData, onSave, onCancel }: BlogPostFormProps) {
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    published: initialData?.published || false,
    featuredImageUrl: initialData?.featuredImageUrl || null,
    featuredImageUnsplashUrl: initialData?.featuredImageUnsplashUrl || null,
    featuredImagePhotographerName: initialData?.featuredImagePhotographerName || null,
    featuredImagePhotographerUrl: initialData?.featuredImagePhotographerUrl || null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData?.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only handle title here now
    const { name, value } = e.target;
    if (name === 'title') {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Specific handler for Tiptap content changes (main content)
  const handleContentChange = (htmlContent: string) => {
    setFormData(prev => ({ ...prev, content: htmlContent }));
  };

  // Specific handler for Tiptap description changes
  const handleDescriptionChange = (htmlContent: string) => {
    setFormData(prev => ({ ...prev, description: htmlContent }));
  };

  const handleCheckboxChange = (checked: boolean | 'indeterminate') => {
     if (typeof checked === 'boolean') {
        setFormData(prev => ({ ...prev, published: checked }));
     }
  };

  const handleImageSelect = (imageUrl: string, unsplashUrl: string, photographerName: string, photographerUrl: string) => {
    setFormData(prev => ({
      ...prev,
      featuredImageUrl: imageUrl,
      featuredImageUnsplashUrl: unsplashUrl,
      featuredImagePhotographerName: photographerName,
      featuredImagePhotographerUrl: photographerUrl,
    }));
    // Optionally add a toast notification
    toast.info("Featured image selected.");
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
        {/* Replace Textarea with TiptapEditor for description */}
        <TiptapEditor
          initialContent={formData.description}
          onChange={handleDescriptionChange} // Use the new handler
          disabled={loading}
          // You might want different controls or a simpler toolbar for the description
          // For now, it uses the same TiptapEditor component as content
        />
        <p className="text-sm text-muted-foreground">
          A short summary or excerpt for display on listing pages, using the rich text editor.
        </p>
      </div>

     {/* Featured Image Section */}
     <div className="space-y-2">
         <Label>Featured Image (via Unsplash)</Label>
         {/* Display current image preview if available and no search results shown */}
         {formData.featuredImageUrl && (
           <div className="mt-2 mb-2 relative aspect-video w-full max-w-sm border rounded overflow-hidden">
               <Image
               src={formData.featuredImageUrl}
               alt="Current featured image"
               fill
               style={{ objectFit: 'cover' }}
               />
           </div>
         )}
         <UnsplashImageSearch
             onImageSelect={handleImageSelect}
             currentImageUrl={formData.featuredImageUrl} // Pass current URL for initial display logic
         />
         {/* Display attribution only if an image is selected */}
         {formData.featuredImageUrl && formData.featuredImageUnsplashUrl && (
             <p className="text-sm text-muted-foreground mt-1">
                 Photo by{' '}
                 <a
                     href={`${formData.featuredImagePhotographerUrl}?utm_source=quantumhive_website&utm_medium=referral`} // Replace your_app_name
                     target="_blank"
                     rel="noopener noreferrer"
                     className="underline hover:text-primary"
                 >
                     {formData.featuredImagePhotographerName || 'Unknown Photographer'}
                 </a>{' '}
                 on{' '}
                 <a
                     href={`${formData.featuredImageUnsplashUrl}?utm_source=quantumhive_website&utm_medium=referral`} // Replace your_app_name
                     target="_blank"
                     rel="noopener noreferrer"
                     className="underline hover:text-primary"
                 >
                     Unsplash
                 </a>
             </p>
         )}
         <p className="text-xs text-muted-foreground">Search for an image and click to select it. The regular size image will be saved.</p>
     </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        {/* Replace Textarea with TiptapEditor */}
        <TiptapEditor
          initialContent={formData.content}
          onChange={handleContentChange}
          disabled={loading}
        />
         <p className="text-sm text-muted-foreground">
           Use the editor above to format the main body of the blog post.
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