// src/components/admin/CaseStudyForm.tsx
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Define the structure for form data, including optional id for editing
interface CaseStudyFormData {
  id?: number;
  title: string;
  description: string; // Assuming description is relevant
  content: string;     // Assuming content is relevant
  published: boolean;
  // Add other Case Study specific fields here (e.g., clientName, results)
}

interface CaseStudyFormProps {
  initialData?: CaseStudyFormData; // Optional initial data for editing
  onSave: () => void; // Callback function after successful save
  onCancel: () => void; // Callback function for cancellation
}

export default function CaseStudyForm({ initialData, onSave, onCancel }: CaseStudyFormProps) {
  const [formData, setFormData] = useState<CaseStudyFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    content: initialData?.content || '',
    published: initialData?.published || false,
    // Initialize other specific fields
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

    const apiUrl = isEditing ? `/api/admin/case-studies/${initialData.id}` : '/api/admin/case-studies';
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
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} case study`);
      }

      toast.success(`Case study ${isEditing ? 'updated' : 'created'} successfully!`);
      onSave(); // Trigger callback

    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} case study:`, err);
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
          maxLength={250}
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="content">Content (Markdown supported)</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          disabled={loading}
          rows={10}
        />
      </div>
       {/* Add inputs for other Case Study specific fields here */}
       <div className="flex items-center space-x-2">
        <Checkbox
            id="published"
            checked={formData.published}
            onCheckedChange={handleCheckboxChange}
            disabled={loading}
        />
        <Label htmlFor="published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Publish case study
        </Label>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
         <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
         </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Study' : 'Create Study')}
        </Button>
      </div>
    </form>
  );
}