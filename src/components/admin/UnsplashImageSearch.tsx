// src/components/admin/UnsplashImageSearch.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface UnsplashImageResult {
  id: string;
  description: string;
  urls: {
    small: string;
    regular: string;
  };
  user: {
    name: string;
    link: string;
  };
  links: {
    html: string; // Link back to the image on Unsplash
  };
}

interface UnsplashImageSearchProps {
  onImageSelect: (imageUrl: string, unsplashUrl: string, photographerName: string, photographerUrl: string) => void;
  currentImageUrl?: string | null; // Optional: To show the currently selected image
}

const UnsplashImageSearch: React.FC<UnsplashImageSearchProps> = ({ onImageSelect, currentImageUrl }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UnsplashImageResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleSearch = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults([]);
    setSelectedImageId(null); // Reset selection on new search

    try {
      const response = await fetch(`/api/admin/unsplash/search?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch: ${response.statusText}`);
      }
      const data: UnsplashImageResult[] = await response.json();
      setResults(data);
      if (data.length === 0) {
        setError('No images found for your query.');
      }
    } catch (err: unknown) {
      console.error("Search error:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during the search.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (image: UnsplashImageResult) => {
    setSelectedImageId(image.id);
    onImageSelect(image.urls.regular, image.links.html, image.user.name, image.user.link); // Use regular URL for saving
  };

  const handleClearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
    setSelectedImageId(null); // Also clear selection visually if needed
    // Do not call onImageSelect here, just clear the search UI
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex items-end space-x-2">
        <div className="flex-grow">
          <Label htmlFor="unsplash-search">Search Unsplash</Label>
          <Input
            id="unsplash-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., 'office desk', 'nature'"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading || !query.trim()}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
        {results.length > 0 && (
          <Button type="button" variant="ghost" onClick={handleClearSearch} disabled={isLoading}>
            Clear
          </Button>
        )}
      </form>

      {error && <p className="text-red-600">{error}</p>}

      {results.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 max-h-80 overflow-y-auto p-2 border rounded">
          {results.map((image) => (
            <div
              key={image.id}
              className={`relative aspect-square cursor-pointer rounded overflow-hidden border-2 ${selectedImageId === image.id ? 'border-blue-500 ring-2 ring-blue-500' : 'border-transparent hover:border-gray-400'}`}
              onClick={() => handleSelect(image)}
              title={`Photo by ${image.user.name} on Unsplash`}
            >
              <Image
                src={image.urls.small}
                alt={image.description}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 16vw"
                style={{ objectFit: 'cover' }}
                priority={false} // Avoid making many images priority
              />
               {/* Optional: Add photographer credit overlay */}
               <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 truncate">
                 <a href={`${image.user.link}?utm_source=quantumhive_website&utm_medium=referral`} target="_blank" rel="noopener noreferrer" className="hover:underline"> {/* Updated app name */}
                   {image.user.name}
                 </a>
               </div>
            </div>
          ))}
        </div>
      )}
       {/* Display currently selected image if provided */}
       {currentImageUrl && !results.length && !isLoading && !error && (
         <div>
           <Label>Current Featured Image</Label>
           <div className="mt-2 relative aspect-video w-full max-w-sm border rounded overflow-hidden">
             <Image
               src={currentImageUrl}
               alt="Current featured image"
               fill
               style={{ objectFit: 'cover' }}
             />
           </div>
         </div>
       )}
    </div>
  );
};

export default UnsplashImageSearch;