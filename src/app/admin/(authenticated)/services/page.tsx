// src/app/admin/(authenticated)/services/page.tsx
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
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

// Define the structure of a Service based on API response
interface Service {
  id: number;
  title: string;
  slug: string;
  published: boolean;
  createdAt: string;
  // Add other relevant fields if needed, e.g., description, icon
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/services'); // Fetch from services API route
      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }
      const data: Service[] = await response.json();
      setServices(data);
    } catch (err) {
      console.error("Error fetching services:", err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      toast.error("Failed to load services."); // Show error toast
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!serviceToDelete) return;

    try {
      const response = await fetch(`/api/admin/services/${serviceToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete service: ${response.statusText}`);
      }

      toast.success(`Service "${serviceToDelete.title}" deleted successfully.`); // Show success toast
      setServices(services.filter(s => s.id !== serviceToDelete.id)); // Update state locally
      setShowDeleteDialog(false);
      setServiceToDelete(null);

    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error(`Failed to delete service: ${err instanceof Error ? err.message : 'Unknown error'}`); // Show error toast
      setShowDeleteDialog(false);
      setServiceToDelete(null);
    }
  };


  return (
    // Apply styling similar to the blog admin page
    <div className="flex flex-col h-full text-black">
      <div className="flex-grow p-4 overflow-y-auto">
        {/* Wrap content in a card */}
        <div className="bg-card p-6 rounded-lg border shadow-sm space-y-6">
          {/* Header row */}
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Manage Services</h2>
            {/* Assuming the route for adding a new service */}
            <Button asChild>
                <Link href="/admin/services/new">Add New Service</Link>
            </Button>
          </div>

          {/* Loading and Error States */}
          {loading && <p className="text-muted-foreground">Loading services...</p>}
          {error && <p className="text-destructive">Error loading services: {error}</p>}

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
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">No services found.</TableCell> {/* Updated colSpan */}
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell>{service.slug}</TableCell>
                      <TableCell>{service.published ? 'Published' : 'Draft'}</TableCell>
                      <TableCell>{new Date(service.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right space-x-2">
                         {/* Assuming the route for editing a service */}
                         <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/services/edit/${service.id}`}>Edit</Link>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(service)}
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
        </div> {/* End card */}
      </div> {/* End flex-grow */}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service
              titled &quot;{serviceToDelete?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setServiceToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Yes, delete service
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div> // End flex container
  );
}