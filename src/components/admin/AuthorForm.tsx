// src/components/admin/AuthorForm.tsx
"use client";

import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { X as LucideX } from 'lucide-react'; // Import icon
// TODO: Add toast notifications

// Define Author type (ideally import from shared types or Prisma)
// Export the type for use in other components/pages
export interface AuthorFormData {
    id?: number;
    name: string;
    slug?: string; // Slug is generated/updated server-side but might be displayed
    bio?: string | null;
    profileImageUrl?: string | null;
    socialMediaLinks?: { [key: string]: string }; // e.g., { twitter: '...', linkedin: '...' }
}

interface AuthorFormProps {
    initialData?: AuthorFormData;
    onSaveSuccess: (authorId: number) => void; // Callback on successful save
}

export default function AuthorForm({ initialData, onSaveSuccess }: AuthorFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState<AuthorFormData>({
        name: initialData?.name || '',
        bio: initialData?.bio || '',
        profileImageUrl: initialData?.profileImageUrl || null,
        socialMediaLinks: initialData?.socialMediaLinks || {},
    });
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(initialData?.profileImageUrl || null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (platform: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            socialMediaLinks: {
                ...prev.socialMediaLinks,
                [platform]: value,
            },
        }));
    };

    // --- Profile Image Upload ---
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        setIsUploading(true);
        setUploadError(null);

        try {
            const response = await fetch('/api/admin/upload', { method: 'POST', body: uploadFormData });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProfileImageUrl(data.url); // Update preview state
            setFormData(prev => ({ ...prev, profileImageUrl: data.url })); // Update form data state
            // TODO: Show success toast
        } catch (error) {
            console.error("Profile image upload failed:", error);
            setUploadError(error instanceof Error ? error.message : 'Upload failed');
            // TODO: Show error toast
        } finally {
            setIsUploading(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
        multiple: false,
    });

    const removeProfileImage = () => {
        setProfileImageUrl(null);
        setFormData(prev => ({ ...prev, profileImageUrl: null }));
    };

    // --- Save Handler ---
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveError(null);

        const url = initialData?.id ? `/api/admin/authors/${initialData.id}` : '/api/admin/authors';
        const method = initialData?.id ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const savedAuthor = await response.json();
            // TODO: Show success toast
            onSaveSuccess(savedAuthor.id); // Call success callback

        } catch (error) {
            console.error("Failed to save author:", error);
            setSaveError(error instanceof Error ? error.message : 'Failed to save author');
            // TODO: Show error toast
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Author's full name"
                />
            </div>

            {/* Bio */}
            <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                    id="bio"
                    name="bio"
                    value={formData.bio || ''}
                    onChange={handleChange}
                    placeholder="Short biography (optional)"
                    rows={4}
                />
            </div>

            {/* Profile Image */}
             <div className="space-y-2">
                <Label>Profile Image</Label>
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${isDragActive ? 'border-primary' : 'border-muted-foreground/50'} hover:border-primary transition-colors`}
                >
                    <input {...getInputProps()} />
                    {isUploading ? (
                        <p>Uploading...</p>
                    ) : isDragActive ? (
                        <p>Drop the image here...</p>
                    ) : profileImageUrl ? (
                        <p>Drag &apos;n&apos; drop to replace, or click</p>
                    ) : (
                        <p>Drag &apos;n&apos; drop image, or click to select</p>
                    )}
                </div>
                {uploadError && <p className="text-sm text-destructive mt-1">{uploadError}</p>}
                {profileImageUrl && !isUploading && (
                    <div className="mt-4 relative w-32 h-32 rounded-full overflow-hidden mx-auto">
                        <Image
                            src={profileImageUrl}
                            alt="Profile image preview"
                            layout="fill"
                            objectFit="cover"
                        />
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1 rounded-full h-6 w-6 p-0"
                            onClick={removeProfileImage}
                            aria-label="Remove profile image"
                        >
                           <LucideX size={14} />
                        </Button>
                    </div>
                )}
            </div>

             {/* Social Links */}
             <div className="space-y-4 border-t pt-4">
                 <h3 className="text-lg font-medium">Social Media Links (Optional)</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                         <Label htmlFor="social-twitter">Twitter URL</Label>
                         <Input
                             id="social-twitter"
                             value={formData.socialMediaLinks?.twitter || ''}
                             onChange={(e) => handleSocialChange('twitter', e.target.value)}
                             placeholder="https://twitter.com/username"
                         />
                     </div>
                     <div>
                         <Label htmlFor="social-linkedin">LinkedIn URL</Label>
                         <Input
                             id="social-linkedin"
                             value={formData.socialMediaLinks?.linkedin || ''}
                             onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                             placeholder="https://linkedin.com/in/username"
                         />
                     </div>
                     {/* Add more social platforms as needed */}
                 </div>
             </div>


            {/* Save/Cancel Buttons */}
            <div className="flex justify-end gap-4 pt-6 border-t">
                 {saveError && <p className="text-sm text-destructive mr-auto">{saveError}</p>}
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={isSaving}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSaving || isUploading}>
                    {isSaving ? 'Saving...' : (initialData ? 'Update Author' : 'Create Author')}
                </Button>
            </div>
        </form>
    );
}