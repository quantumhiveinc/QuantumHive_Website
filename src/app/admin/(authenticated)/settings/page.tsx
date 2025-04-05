import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UnsplashSettingsForm } from '@/components/admin/settings/UnsplashSettingsForm';

// TODO: Fetch settings data
// TODO: Implement actual forms within tabs

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="integrations" orientation="vertical" className="flex gap-6">
        <TabsList className="flex flex-col h-auto w-48">
          <TabsTrigger value="integrations" className="justify-start w-full">Integrations</TabsTrigger>
          <TabsTrigger value="general" disabled className="justify-start w-full">General (Future)</TabsTrigger>
          <TabsTrigger value="seo" disabled className="justify-start w-full">SEO (Future)</TabsTrigger>
          <TabsTrigger value="social" disabled className="justify-start w-full">Social Media (Future)</TabsTrigger>
          {/* Add more triggers as needed */}
        </TabsList>

        <div className="flex-1 text-gray-900">
          <TabsContent value="integrations">
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Integrations</h2>
              <p className="text-sm text-muted-foreground mb-6">Manage connections to third-party services.</p>

              {/* Unsplash Section */}
              <div className="mt-4 p-4 border rounded-md bg-white">
                  <h3 className="text-lg font-medium mb-3">Unsplash API Configuration</h3>
                  <p className="text-sm text-muted-foreground mb-4">Configure API keys to enable searching and adding featured images directly from Unsplash.</p>
                  {/* Render the form component */}
                  <UnsplashSettingsForm />
              </div>

              {/* Add other integration sections here */}
            </div>
          </TabsContent>

          <TabsContent value="general">
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">General Settings (Future)</h2>
              <p>Site title, tagline, etc.</p>
            </div>
          </TabsContent>

          <TabsContent value="seo">
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">SEO Settings (Future)</h2>
              <p>Meta descriptions, tracking codes, etc.</p>
            </div>
          </TabsContent>

           <TabsContent value="social">
            <div className="p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Social Media Settings (Future)</h2>
              <p>Links to social profiles, etc.</p>
            </div>
          </TabsContent>
          {/* Add more content sections corresponding to triggers */}
        </div>
      </Tabs>
    </div>
  );
}