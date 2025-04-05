// src/components/admin/IndustryForm.tsx
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// Define the structure for form data, including optional id for editing
interface IndustryFormData {
  id?: number;
  title: string;
  description: string; // Assuming description is relevant
  content: string;     // Assuming content is relevant
  published: boolean;
  // Add other Industry specific fields here (e.g., iconUrl, relatedServices)
}

interface IndustryFormProps {
  initialData?: IndustryFormData; // Optional initial data for editing
  onSave: () => void; // Callback function after successful save
  onCancel: () => void; // Callback function for cancellation
}

export default function IndustryForm({ initialData, onSave, onCancel }: IndustryFormProps) {
  const [formData, setFormData] = useState<IndustryFormData>({
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

    const apiUrl = isEditing ? `/api/admin/industries/${initialData.id}` : '/api/admin/industries';
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
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} industry`);
      }

      toast.success(`Industry ${isEditing ? 'updated' : 'created'} successfully!`);
      onSave(); // Trigger callback

    } catch (err) {
      console.error(`Error ${isEditing ? 'updating' : 'creating'} industry:`, err);
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
        <Label htmlFor="title">Industry Name</Label>
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
        <Label htmlFor="description">Short Description (Optional)</Label>
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
        <Label htmlFor="content">Detailed Content (Markdown supported)</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          disabled={loading}
          rows={10}
        />
      </div>
       {/* Add inputs for other Industry specific fields here */}
       <div className="flex items-center space-x-2">
        <Checkbox
            id="published"
            checked={formData.published}
            onCheckedChange={handleCheckboxChange}
            disabled={loading}
        />
        <Label htmlFor="published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Publish industry page
        </Label>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
         <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancel
         </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Industry' : 'Create Industry')}
        </Button>
      </div>
    </form>
  );
}