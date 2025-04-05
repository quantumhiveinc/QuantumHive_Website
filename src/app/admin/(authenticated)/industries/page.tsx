// src/app/admin/industries/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import IndustryForm from '@/components/admin/IndustryForm'; // Import the form
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Define the structure of an Industry based on API response
interface Industry {
  id: number;
  title: string;
  slug: string;
  description?: string | null;
  content?: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  // Add other specific fields if returned by API
}

export default function AdminIndustriesPage() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [industryToDelete, setIndustryToDelete] = useState<Industry | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);

  const fetchIndustries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/industries');
      if (!response.ok) {
        throw new Error(`Failed to fetch industries: ${response.statusText}`);
      }
      const data: Industry[] = await response.json();
      setIndustries(data);
    } catch (err) {
      console.error("Error fetching industries:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      toast.error("Failed to load industries.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIndustries();
  }, [fetchIndustries]);

  const handleDeleteClick = (industry: Industry) => {
    setIndustryToDelete(industry);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!industryToDelete) return;
    try {
      const response = await fetch(`/api/admin/industries/${industryToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete industry: ${response.statusText}`);
      }
      toast.success(`Industry "${industryToDelete.title}" deleted successfully.`);
      setIndustries(industries.filter(i => i.id !== industryToDelete.id));
      setShowDeleteDialog(false);
      setIndustryToDelete(null);
    } catch (err) {
      console.error("Error deleting industry:", err);
      toast.error(`Failed to delete industry: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setShowDeleteDialog(false);
      setIndustryToDelete(null);
    }
  };

  const handleAddNew = () => {
    setEditingIndustry(null);
    setIsFormOpen(true);
  };

  const handleEdit = (industry: Industry) => {
    setEditingIndustry(industry);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    setIsFormOpen(false);
    setEditingIndustry(null);
    fetchIndustries();
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingIndustry(null);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Manage Industries</h2>
        <Button onClick={handleAddNew}>Add New Industry</Button>
      </div>

      {loading && <p>Loading industries...</p>}
      {error && <p className="text-red-600">Error loading industries: {error}</p>}

      {!loading && !error && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {industries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">No industries found.</TableCell>
              </TableRow>
            ) : (
              industries.map((industry) => (
                <TableRow key={industry.id}>
                  <TableCell className="font-medium">{industry.title}</TableCell>
                  <TableCell>{industry.slug}</TableCell>
                  <TableCell>{industry.published ? 'Published' : 'Draft'}</TableCell>
                  <TableCell>{new Date(industry.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(industry)}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(industry)}
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
              This action cannot be undone. This will permanently delete the industry
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              titled '{industryToDelete?.title}'.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIndustryToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Yes, delete industry
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingIndustry ? 'Edit Industry' : 'Add New Industry'}</DialogTitle>
            <DialogDescription>
              {editingIndustry ? 'Update the details.' : 'Fill in the details.'}
            </DialogDescription>
          </DialogHeader>
          {isFormOpen && (
            <IndustryForm
              key={editingIndustry ? editingIndustry.id : 'new'}
              initialData={editingIndustry ? {
                  id: editingIndustry.id,
                  title: editingIndustry.title,
                  description: editingIndustry.description || '',
                  content: editingIndustry.content || '',
                  published: editingIndustry.published,
                  // Add other specific fields if needed
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