// src/app/admin/(authenticated)/services/new/page.tsx
"use client"; // This page needs client-side interactivity for form handling and navigation

import React from 'react';
import { useRouter } from 'next/navigation';
import ServiceForm, { ServiceFormData } from '@/components/ServiceForm'; // Assuming ServiceForm and its data type exist
// TODO: Add toast notifications (e.g., react-hot-toast)

export default function NewServicePage() {
  const router = useRouter();

  const handleSave = async (data: ServiceFormData) => { // Use the service data type
    console.log("Saving new service:", data); // Log data being sent
    try {
      const response = await fetch('/api/admin/services', { // Use the services API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const newService = await response.json();
      console.log("Service created:", newService);
      // TODO: Show success toast
      router.push('/admin/services'); // Redirect to the services list page on success
      // Optionally redirect to the edit page: router.push(`/admin/services/edit/${newService.id}`);

    } catch (error) {
      console.error("Failed to create service:", error);
      // TODO: Show error toast
    }
  };

  const handleCancel = () => {
    router.push('/admin/services'); // Navigate back to the list page
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-black">Create New Service</h1> {/* Changed title */}
      <ServiceForm onSave={handleSave} onCancel={handleCancel} /> {/* Use ServiceForm */}
    </div>
  );
}