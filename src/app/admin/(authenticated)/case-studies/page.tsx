// src/app/admin/case-studies/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import CaseStudyForm from '@/components/admin/CaseStudyForm'; // Import the form
// import CaseStudyForm from '@/components/admin/CaseStudyForm';
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

// Define the structure of a CaseStudy based on API response
interface CaseStudy {
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

export default function AdminCaseStudiesPage() {
  const [studies, setStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [studyToDelete, setStudyToDelete] = useState<CaseStudy | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<CaseStudy | null>(null);

  const fetchStudies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/case-studies');
      if (!response.ok) {
        throw new Error(`Failed to fetch case studies: ${response.statusText}`);
      }
      const data: CaseStudy[] = await response.json();
      setStudies(data);
    } catch (err) {
      console.error("Error fetching case studies:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      toast.error("Failed to load case studies.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudies();
  }, [fetchStudies]);

  const handleDeleteClick = (study: CaseStudy) => {
    setStudyToDelete(study);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!studyToDelete) return;
    try {
      const response = await fetch(`/api/admin/case-studies/${studyToDelete.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete case study: ${response.statusText}`);
      }
      toast.success(`Case study "${studyToDelete.title}" deleted successfully.`);
      setStudies(studies.filter(s => s.id !== studyToDelete.id));
      setShowDeleteDialog(false);
      setStudyToDelete(null);
    } catch (err) {
      console.error("Error deleting case study:", err);
      toast.error(`Failed to delete case study: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setShowDeleteDialog(false);
      setStudyToDelete(null);
    }
  };

  const handleAddNew = () => {
    setEditingStudy(null);
    setIsFormOpen(true);
    // toast.info("Case Study Form not yet implemented."); // Remove placeholder
  };

  const handleEdit = (study: CaseStudy) => {
    setEditingStudy(study);
    setIsFormOpen(true);
     // toast.info("Case Study Form not yet implemented."); // Remove placeholder
  };

  const handleSave = () => {
    setIsFormOpen(false);
    setEditingStudy(null);
    fetchStudies();
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setEditingStudy(null);
  };

  return (
    // Apply styling similar to the Manage Categories page
    <div className="flex flex-col h-full text-black">
      <div className="flex-grow p-4 overflow-y-auto">
        {/* Wrap content in a card */}
        <div className="bg-card p-6 rounded-lg border shadow-sm space-y-6">
          {/* Header row */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Manage Case Studies</h2>
            <Button onClick={handleAddNew}>Add New Case Study</Button>
          </div>

          {/* Loading and Error States */}
          {loading && <p className="text-muted-foreground">Loading case studies...</p>}
          {error && <p className="text-destructive">Error loading case studies: {error}</p>}

          {/* Table */}
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
                {studies.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No case studies found.</TableCell>
                  </TableRow>
                ) : (
                  studies.map((study) => (
                    <TableRow key={study.id}>
                      <TableCell className="font-medium">{study.title}</TableCell>
                      <TableCell>{study.slug}</TableCell>
                      <TableCell>{study.published ? 'Published' : 'Draft'}</TableCell>
                      <TableCell>{new Date(study.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(study)}>
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(study)}
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
        {/* Dialogs remain outside the main card structure */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the case study
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              titled '{studyToDelete?.title}'.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStudyToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Yes, delete study
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingStudy ? 'Edit Case Study' : 'Add New Case Study'}</DialogTitle>
            <DialogDescription>
              {editingStudy ? 'Update the details.' : 'Fill in the details.'}
            </DialogDescription>
          </DialogHeader>
          {/* Render CaseStudyForm */}
          {isFormOpen && (
            <CaseStudyForm
              key={editingStudy ? editingStudy.id : 'new'}
              initialData={editingStudy ? {
                  id: editingStudy.id,
                  title: editingStudy.title,
                  description: editingStudy.description || '',
                  content: editingStudy.content || '',
                  published: editingStudy.published,
                  // Add other specific fields if needed for the form
              } : undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </DialogContent>
      </Dialog>
        </div> {/* End card */}
      </div> {/* End flex-grow */}

      {/* Dialogs remain at this level */}
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the case study
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              titled '{studyToDelete?.title}'.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStudyToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Yes, delete study
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add/Edit Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingStudy ? 'Edit Case Study' : 'Add New Case Study'}</DialogTitle>
            <DialogDescription>
              {editingStudy ? 'Update the details.' : 'Fill in the details.'}
            </DialogDescription>
          </DialogHeader>
          {/* Render CaseStudyForm */}
          {isFormOpen && (
            <CaseStudyForm
              key={editingStudy ? editingStudy.id : 'new'}
              initialData={editingStudy ? {
                  id: editingStudy.id,
                  title: editingStudy.title,
                  description: editingStudy.description || '',
                  content: editingStudy.content || '',
                  published: editingStudy.published,
                  // Add other specific fields if needed for the form
              } : undefined}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </DialogContent>
      </Dialog>
    </div> // End flex container
  );
}