// src/components/admin/FullPageBlogPostEditor.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { JSONContent } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
// Removed unused Switch import
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X as LucideX } from 'lucide-react';
import UnsplashImageSearch from './UnsplashImageSearch'; // Import Unsplash search component
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
// TODO: Add toast notifications for upload status/errors (e.g., react-hot-toast)


// Basic types for fetched data
interface Author { id: number; name: string; }
interface Category { id: number; name: string; }
// Removed unused Tag interface

interface GalleryImage {
    url: string;
    altText?: string;
}

export interface BlogPostFormData { // Add export keyword
    id?: number;
    title: string;
    description?: string | null;
    contentJson?: JSONContent | null;
    published?: boolean;
    featuredImageUrl?: string | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    youtubeUrl?: string | null;
    authorId?: number | null;
    categoryIds?: number[]; // Will be derived from selectedCategoryIds Set
    tagNames?: string[]; // Will be derived from currentTags array
    galleryImages?: GalleryImage[];
    // Add Unsplash attribution fields
    featuredImageUnsplashUrl?: string | null;
    featuredImagePhotographerName?: string | null;
    featuredImagePhotographerUrl?: string | null;
}

interface EditorProps {
    initialData?: Partial<BlogPostFormData>; // Use Partial as not all fields might be present initially
    onSave: (data: BlogPostFormData, isPublishing: boolean) => Promise<void>; // Updated signature
    onCancel: () => void;
}

export default function FullPageBlogPostEditor({ initialData, onSave, onCancel }: EditorProps) {
    // --- State Variables ---
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    // Removed unused published state - now determined by handleSave parameter
    const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(initialData?.featuredImageUrl || null);
    const [isUploadingFeatured, setIsUploadingFeatured] = useState(false);
    const [uploadErrorFeatured, setUploadErrorFeatured] = useState<string | null>(null);
    const [authorId, setAuthorId] = useState<number | null>(initialData?.authorId || null);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<number>>(
        new Set(initialData?.categoryIds || [])
    );
    const [currentTags, setCurrentTags] = useState<string[]>(initialData?.tagNames || []);
    const [tagInput, setTagInput] = useState('');
    const [availableAuthors, setAvailableAuthors] = useState<Author[]>([]);
    const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
    const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || '');
    const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || '');
    const [youtubeUrl, setYoutubeUrl] = useState(initialData?.youtubeUrl || '');
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialData?.galleryImages || []);
    const [isUploadingGallery, setIsUploadingGallery] = useState(false);
    const [uploadErrorGallery, setUploadErrorGallery] = useState<string | null>(null);
    // Add state for Unsplash attribution
    const [featuredImageUnsplashUrl, setFeaturedImageUnsplashUrl] = useState<string | null>(initialData?.featuredImageUnsplashUrl || null);
    const [featuredImagePhotographerName, setFeaturedImagePhotographerName] = useState<string | null>(initialData?.featuredImagePhotographerName || null);
    const [featuredImagePhotographerUrl, setFeaturedImagePhotographerUrl] = useState<string | null>(initialData?.featuredImagePhotographerUrl || null);

    // --- TipTap Editor Setup ---
    const editor = useEditor({
        extensions: [
            StarterKit,
            // TODO: Add other extensions as needed (e.g., Image, Link, Placeholder)
        ],
        immediatelyRender: false, // Prevent SSR hydration mismatch
        content: initialData?.contentJson || '<p>Start writing your blog post...</p>',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl my-5 focus:outline-none border rounded-md min-h-[400px] text-black', // Changed m-5 to my-5, Removed dark:prose-invert, increased min-height, added text-black, removed p-4
            },
        },
        onUpdate: () => {
            // Optionally handle content changes immediately
        },
    });

    // --- Featured Image Upload Logic ---
    const onDropFeatured = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append('file', file);

        setIsUploadingFeatured(true);
        setUploadErrorFeatured(null);

        try {
            const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setFeaturedImageUrl(data.url);
            // TODO: Show success toast
        } catch (error) {
            console.error("Featured image upload failed:", error);
            setUploadErrorFeatured(error instanceof Error ? error.message : 'Upload failed');
            // TODO: Show error toast
        } finally {
            setIsUploadingFeatured(false);
        }
    }, []);

    const { getRootProps: getFeaturedRootProps, getInputProps: getFeaturedInputProps, isDragActive: isFeaturedDragActive } = useDropzone({
        onDrop: onDropFeatured,
        accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
        multiple: false,
    });

    const removeFeaturedImage = () => {
        setFeaturedImageUrl(null);
    };

    // --- Tag Input Logic ---
    const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagInput(e.target.value);
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !currentTags.includes(newTag)) {
                setCurrentTags([...currentTags, newTag]);
            }
            setTagInput('');
        } else if (e.key === 'Backspace' && tagInput === '' && currentTags.length > 0) {
            setCurrentTags(currentTags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        setCurrentTags(currentTags.filter(tag => tag !== tagToRemove));
    };

    // --- Category Checkbox Logic ---
     const handleCategoryChange = (categoryId: number, checked: boolean) => {
        setSelectedCategoryIds(prev => {
            const newSet = new Set(prev);
            if (checked) {
                newSet.add(categoryId);
            } else {
                newSet.delete(categoryId);
            }
            return newSet;
        });
    };

     // --- Gallery Image Upload Logic ---
    const onDropGallery = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        setIsUploadingGallery(true);
        setUploadErrorGallery(null);
        let uploadFailed = false;
        const uploadedUrls: GalleryImage[] = [];

        for (const file of acceptedFiles) {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await fetch('/api/admin/upload', { method: 'POST', body: formData });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                uploadedUrls.push({ url: data.url, altText: '' }); // Add successful upload
            } catch (error) {
                console.error("Gallery image upload failed:", error);
                setUploadErrorGallery(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
                uploadFailed = true;
                break; // Stop on first error
            }
        }

        // Add successfully uploaded images to state *after* the loop
        if (uploadedUrls.length > 0) {
             setGalleryImages(prev => [...prev, ...uploadedUrls]);
        }

        setIsUploadingGallery(false);
        if (!uploadFailed) {
             setUploadErrorGallery(null); // Clear error if all succeed
             // TODO: Show success toast for gallery uploads
        } else {
            // TODO: Show error toast for gallery uploads
        }

    }, []); // Dependency array is empty, relies on state setters

     const { getRootProps: getGalleryRootProps, getInputProps: getGalleryInputProps, isDragActive: isGalleryDragActive } = useDropzone({
        onDrop: onDropGallery,
        accept: { 'image/*': ['.jpeg', '.png', '.gif', '.webp'] },
        multiple: true, // Allow multiple files
    });

    const removeGalleryImage = (urlToRemove: string) => {
        setGalleryImages(prev => prev.filter(img => img.url !== urlToRemove));
    };

    // TODO: Add function to handle alt text changes for gallery images

    // --- Validation Logic ---
    // Validation for enabling the Publish button
    const canPublish =
        title.trim() !== '' &&
        editor?.getText().trim() !== '' &&
        selectedCategoryIds.size > 0;

    // Validation for enabling the Save Draft button
    const canSaveDraft = title.trim() !== '';

    // Disable buttons during uploads
    const isUploading = isUploadingFeatured || isUploadingGallery;

    // --- Save Handler ---
    const handleSave = async (isPublishing: boolean) => {
        if (!editor) return;
        const contentJson = editor.getJSON();

        const postData: BlogPostFormData = {
            title,
            description: description || null,
            contentJson,
            published: isPublishing, // Set published status based on button clicked
            featuredImageUrl,
            authorId: authorId,
            categoryIds: Array.from(selectedCategoryIds),
            tagNames: currentTags,
            metaTitle: metaTitle || null,
            metaDescription: metaDescription || null,
            youtubeUrl: youtubeUrl || null,
            galleryImages: galleryImages, // Use current state
            // Include Unsplash attribution data
            featuredImageUnsplashUrl: featuredImageUnsplashUrl,
            featuredImagePhotographerName: featuredImagePhotographerName,
            featuredImagePhotographerUrl: featuredImagePhotographerUrl,
        };

        if (initialData?.id) {
           postData.id = initialData.id;
        }

        await onSave(postData, isPublishing); // Pass publishing intent
    };

    // --- Cancel Handler ---
    const handleCancel = () => {
        if (title.trim() || description.trim() || (editor && editor.getText().trim() !== '' && editor.getText().trim() !== '<p>Start writing your blog post...</p>')) {
            if (window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
                onCancel();
            }
        } else {
            onCancel();
        }
    };

    // --- Fetch initial data for selects/checkboxes ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [authorRes, categoryRes] = await Promise.all([
                    fetch('/api/admin/authors'),
                    fetch('/api/admin/categories')
                ]);

                if (authorRes.ok) setAvailableAuthors(await authorRes.json());
                else console.error("Failed to fetch authors");

                if (categoryRes.ok) setAvailableCategories(await categoryRes.json());
                else console.error("Failed to fetch categories");

            } catch (error) {
                console.error("Error fetching editor data:", error);
                // TODO: Show error toast
            }
        };
        fetchData();
    }, []); // Run only on mount

    // --- Update state when initialData changes ---
    useEffect(() => {
        // Update form fields based on initialData
        setTitle(initialData?.title || '');
        setDescription(initialData?.description || '');
        setFeaturedImageUrl(initialData?.featuredImageUrl || null);
        setAuthorId(initialData?.authorId || null);
        setSelectedCategoryIds(new Set(initialData?.categoryIds || []));
        setCurrentTags(initialData?.tagNames || []);
        setMetaTitle(initialData?.metaTitle || '');
        setMetaDescription(initialData?.metaDescription || '');
        setYoutubeUrl(initialData?.youtubeUrl || '');
        setGalleryImages(initialData?.galleryImages || []); // Update gallery images
        // Update Unsplash attribution state
        setFeaturedImageUnsplashUrl(initialData?.featuredImageUnsplashUrl || null);
        setFeaturedImagePhotographerName(initialData?.featuredImagePhotographerName || null);
        setFeaturedImagePhotographerUrl(initialData?.featuredImagePhotographerUrl || null);

        // Reset specific states not directly tied to initialData props
        setTagInput('');
        setUploadErrorFeatured(null);
        setIsUploadingFeatured(false);
        setUploadErrorGallery(null);
        setIsUploadingGallery(false);

        // Update editor content
        if (editor) {
            const newContent = initialData?.contentJson ?? '<p></p>';
            // Check if content is actually different before setting to avoid unnecessary updates/cursor jumps
            if (JSON.stringify(editor.getJSON()) !== JSON.stringify(newContent)) {
                 // Use setTimeout to avoid race condition with editor initialization
                setTimeout(() => editor.commands.setContent(newContent, false), 0); // Pass false to avoid emitting update event
            }
        }
    }, [initialData, editor]); // Rerun when initialData or editor instance changes

   // --- Unsplash Image Select Handler ---
   const handleUnsplashImageSelect = (imageUrl: string, unsplashUrl: string, photographerName: string, photographerUrl: string) => {
       setFeaturedImageUrl(imageUrl); // Update the main image URL state
       setFeaturedImageUnsplashUrl(unsplashUrl);
       setFeaturedImagePhotographerName(photographerName);
       setFeaturedImagePhotographerUrl(photographerUrl);
       setUploadErrorFeatured(null); // Clear any previous upload errors
       // TODO: Add toast notification
       console.log("Unsplash image selected:", imageUrl);
   };


    if (!editor) {
        return <div>Loading Editor...</div>;
    }

    // --- Render Component ---
    return (
        <div className="flex flex-col h-full text-black"> {/* Use flex column for full height */}
            {/* Main Content Area */}
            <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 p-4 overflow-y-auto"> {/* Allow scrolling */}
                {/* Main Content Area (Editor) */}
                <div className="md:col-span-2 space-y-4 bg-card p-4 rounded-lg border">
                    <div>
                        <Label htmlFor="title" className="text-black">Title</Label> {/* Added text-black */}
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Blog Post Title"
                            required
                        />
                    </div>
                     <div>
                        <Label htmlFor="description" className="text-black">Short Description / Excerpt</Label> {/* Added text-black */}
                        <Textarea
                            id="description"
                            value={description || ''} // Handle null value
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="A brief summary of the post"
                        />
                    </div>
                    <div>
                        <Label className="text-black">Description</Label> {/* Changed label */}
                        {/* --- Tiptap Toolbar --- */}
                        <div className="tiptap-toolbar p-2 border-b flex flex-wrap gap-1">
                           <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={isUploading || !editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>Bold</button>
                           <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={isUploading || !editor.can().chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>Italic</button>
                           <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={isUploading || !editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>Strike</button>
                           <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} disabled={isUploading || !editor.can().chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''}>Code</button>
                           <button type="button" onClick={() => editor.chain().focus().setParagraph().run()} disabled={isUploading} className={editor.isActive('paragraph') ? 'is-active' : ''}>Paragraph</button>
                           <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} disabled={isUploading || !editor.can().chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>H2</button>
                           <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} disabled={isUploading || !editor.can().chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>H3</button>
                           <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} disabled={isUploading || !editor.can().chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>Bullet List</button>
                           <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} disabled={isUploading || !editor.can().chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>Ordered List</button>
                           <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} disabled={isUploading || !editor.can().chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>Code Block</button>
                           <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} disabled={isUploading || !editor.can().chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>Blockquote</button>
                           <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} disabled={isUploading}>HR</button>
                           {/* Add more buttons for other StarterKit features or custom extensions */}
                        </div>
                        <EditorContent editor={editor} />
                    </div>
                    {/* SEO Section Moved Below Editor */}
                    <div className="pt-4 border-t mt-4 space-y-2">
                         <h3 className="text-lg font-medium text-black">SEO</h3>
                         <div>
                             <Label htmlFor="meta-title-main" className="text-black">Meta Title</Label>
                             <Input
                                 id="meta-title-main"
                                 placeholder="SEO friendly title (optional)"
                                 value={metaTitle || ''}
                                 onChange={(e) => setMetaTitle(e.target.value)}
                             />
                         </div>
                         <div>
                            <Label htmlFor="meta-description-main" className="text-black">Meta Description</Label>
                            <Textarea
                                id="meta-description-main"
                                placeholder="Brief description for search engines (optional)"
                                value={metaDescription || ''}
                                onChange={(e) => setMetaDescription(e.target.value)}
                                className="text-black"
                                rows={3}
                            />
                        </div>
                    </div>
                </div>

                {/* Sidebar Area (Metadata, Relations, etc.) */}
                <div className="md:col-span-1 space-y-4 bg-card p-4 rounded-lg border flex flex-col"> {/* Use flex-col */}
                    <h2 className="text-xl font-semibold mb-2 border-b pb-2 text-black">Post Settings</h2> {/* Added text-black */}

                    {/* Accordion for Settings Sections */}
                    <Accordion type="multiple" defaultValue={['item-1', 'item-2']} className="w-full flex-grow"> {/* Allow multiple open, flex-grow */}

                        {/* Featured Image Section */}
                        <AccordionItem value="item-1">
                            <AccordionTrigger>Featured Image</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pt-2"> {/* Added pt-2 */}
                                    <div
                                        {...getFeaturedRootProps()} // Use specific props
                                        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${isFeaturedDragActive ? 'border-primary' : 'border-muted-foreground/50'} hover:border-primary transition-colors`}
                                    >
                                        <input {...getFeaturedInputProps()} />
                                        {isUploadingFeatured ? (
                                            <p className="text-black">Uploading...</p>
                                        ) : isFeaturedDragActive ? (
                                            <p className="text-black">Drop the image here...</p>
                                        ) : featuredImageUrl ? (
                                            <p className="text-black">Drag &apos;n&apos; drop to replace, or click</p>
                                        ) : (
                                            <p className="text-black">Drag &apos;n&apos; drop image, or click to select</p>
                                        )}
                                    </div>
                                    {uploadErrorFeatured && <p className="text-sm text-destructive mt-1">{uploadErrorFeatured}</p>}
                                    {featuredImageUrl && !isUploadingFeatured && (
                                        <div className="mt-4 relative w-full h-40">
                                            <Image
                                                src={featuredImageUrl}
                                                alt="Featured image preview"
                                                layout="fill"
                                                objectFit="contain"
                                            />
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="absolute top-1 right-1"
                                                onClick={removeFeaturedImage}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    )}
                                    {/* Divider */}
                                    <div className="my-4 border-t pt-4">
                                        <p className="text-sm font-medium text-center text-muted-foreground mb-2">Or search Unsplash</p>
                                        <UnsplashImageSearch
                                            onImageSelect={handleUnsplashImageSelect}
                                            currentImageUrl={featuredImageUrl}
                                        />
                                        {/* Display Unsplash attribution if selected */}
                                        {featuredImageUrl && featuredImageUnsplashUrl && (
                                            <p className="text-xs text-muted-foreground mt-2">
                                                Photo by{' '}
                                                <a
                                                    href={`${featuredImagePhotographerUrl}?utm_source=quantumhive_website&utm_medium=referral`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline hover:text-primary"
                                                >
                                                    {featuredImagePhotographerName}
                                                </a>
                                                {' '}on{' '}
                                                <a
                                                    href={`${featuredImageUnsplashUrl}?utm_source=quantumhive_website&utm_medium=referral`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="underline hover:text-primary"
                                                >
                                                    Unsplash
                                                </a>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Categories Section */}
                        <AccordionItem value="item-2">
                            <AccordionTrigger>Categories</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pt-2 max-h-40 overflow-y-auto"> {/* Added pt-2, scroll */}
                                    {availableCategories.length > 0 ? availableCategories.map(category => (
                                        <div key={category.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={`category-${category.id}`}
                                                checked={selectedCategoryIds.has(category.id)}
                                                onCheckedChange={(checked) => handleCategoryChange(category.id, !!checked)}
                                            />
                                            <label
                                                htmlFor={`category-${category.id}`}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                                            >
                                                {category.name}
                                            </label>
                                        </div>
                                    )) : <p className="text-sm text-muted-foreground">No categories found.</p>}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Tags Section */}
                        <AccordionItem value="item-3">
                            <AccordionTrigger>Tags</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pt-2"> {/* Added pt-2 */}
                                    <div className="flex flex-wrap gap-1 rounded-md border p-2 min-h-[40px]">
                                         {currentTags.map(tag => (
                                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                                {tag}
                                                <button type="button" onClick={() => removeTag(tag)} className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                                                    <LucideX size={12} />
                                                </button>
                                            </Badge>
                                        ))}
                                        <Input
                                            type="text"
                                            value={tagInput}
                                            onChange={handleTagInputChange}
                                            onKeyDown={handleTagInputKeyDown}
                                            placeholder="Add tags..."
                                            className="flex-grow border-none focus:ring-0 h-auto p-0 text-sm"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">Press Enter or comma to add a tag.</p>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* Author Section */}
                        <AccordionItem value="item-4">
                            <AccordionTrigger>Author</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pt-2"> {/* Added pt-2 */}
                                    <Select
                                        value={authorId?.toString() || ''}
                                        onValueChange={(value) => setAuthorId(value ? parseInt(value, 10) : null)}
                                        disabled={availableAuthors.length === 0}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select author" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {availableAuthors.map(author => (
                                                <SelectItem key={author.id} value={author.id.toString()}>
                                                    {author.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                         {/* Gallery Section */}
                        <AccordionItem value="item-5">
                            <AccordionTrigger>Image Gallery</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pt-2"> {/* Added pt-2 */}
                                     <div
                                        {...getGalleryRootProps()}
                                        className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${isGalleryDragActive ? 'border-primary' : 'border-muted-foreground/50'} hover:border-primary transition-colors`}
                                    >
                                        <input {...getGalleryInputProps()} />
                                        {isUploadingGallery ? (
                                            <p className="text-black">Uploading gallery images...</p>
                                        ) : isGalleryDragActive ? (
                                            <p className="text-black">Drop images here...</p>
                                        ) : (
                                            <p className="text-black">Drag &apos;n&apos; drop images, or click to select</p>
                                        )}
                                    </div>
                                    {uploadErrorGallery && <p className="text-sm text-destructive mt-1">{uploadErrorGallery}</p>}
                                    {/* Gallery Preview */}
                                     <div className="mt-4 grid grid-cols-3 gap-2">
                                         {galleryImages.map((image, index) => (
                                            <div key={index} className="relative group aspect-square">
                                                <Image
                                                    src={image.url}
                                                    alt={image.altText || `Gallery image ${index + 1}`}
                                                    layout="fill"
                                                    objectFit="cover"
                                                    className="rounded"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeGalleryImage(image.url)}
                                                        aria-label="Remove gallery image"
                                                    >
                                                        <LucideX size={16} />
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* TODO: Add inputs for alt text for each gallery image */}
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                        {/* YouTube Video Section */}
                        <AccordionItem value="item-6">
                            <AccordionTrigger>YouTube Video</AccordionTrigger>
                            <AccordionContent>
                                <div className="space-y-2 pt-2"> {/* Added pt-2 */}
                                    <Label htmlFor="youtube-url" className="text-black">YouTube Video URL</Label>
                                    <Input
                                        id="youtube-url"
                                        placeholder="https://www.youtube.com/watch?v=..."
                                        value={youtubeUrl || ''}
                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                    />
                                </div>
                            </AccordionContent>
                        </AccordionItem>

                    </Accordion>

                    {/* Action Buttons - Pushed to bottom */}
                    <div className="flex justify-end gap-2 pt-4 border-t mt-auto"> {/* Use mt-auto to push to bottom */}
                        <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
                            Cancel
                        </Button>
                        <Button
                            onClick={() => handleSave(false)}
                            disabled={isUploading || !canSaveDraft}
                            variant="secondary"
                        >
                            {isUploading ? 'Saving...' : 'Save Draft'}
                        </Button>
                        <Button
                            onClick={() => handleSave(true)}
                            disabled={isUploading || !canPublish}
                        >
                            {isUploading ? 'Publishing...' : 'Publish'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}