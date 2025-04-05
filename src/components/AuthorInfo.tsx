// src/components/AuthorInfo.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// Import icons for social media if desired (e.g., from lucide-react)
// import { Twitter, Linkedin } from 'lucide-react';

// Define Author type (ideally import from Prisma types or shared types)
export interface Author { // Add export keyword
    id: number;
    name: string;
    slug: string; // Assuming slug exists for author page link
    bio?: string | null;
    profileImageUrl?: string | null;
    socialMediaLinks?: { [key: string]: string } | null; // e.g., { twitter: '...', linkedin: '...' }
}

interface AuthorInfoProps {
    author: Author;
    className?: string;
}

const AuthorInfo: React.FC<AuthorInfoProps> = ({ author, className = "" }) => {
    if (!author) return null;

    const socialLinks = author.socialMediaLinks || {};

    return (
        <div className={`flex items-center space-x-4 ${className}`}>
            {/* Author Image */}
            {author.profileImageUrl ? (
                <Link href={`/author/${author.slug}`} passHref>
                    <a className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                        <Image
                            src={author.profileImageUrl}
                            alt={author.name}
                            layout="fill"
                            objectFit="cover"
                        />
                    </a>
                </Link>
            ) : (
                // Placeholder if no image
                <Link href={`/author/${author.slug}`} passHref>
                    <a className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        {/* Display initials or a generic icon */}
                        <span>{author.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
                    </a>
                </Link>
            )}

            {/* Author Name and Bio */}
            <div className="flex-grow">
                <Link href={`/author/${author.slug}`} passHref>
                    <a className="text-sm font-medium text-[#EDEDED] hover:underline">{author.name}</a>
                </Link>
                {author.bio && (
                    <p className="mt-1 text-xs text-[#A1A1AA] line-clamp-2">{author.bio}</p>
                )}
                 {/* Optional: Social Links */}
                 {Object.keys(socialLinks).length > 0 && (
                    <div className="mt-1 flex space-x-2">
                        {socialLinks.twitter && (
                            <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label={`${author.name} on Twitter`} className="text-[#A1A1AA] hover:text-[#EDEDED]">
                                {/* <Twitter size={16} /> */}
                                <svg /* Replace with actual Twitter icon */ width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M22.46 6c-.77.35-1.6.58-2.46.67.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                            </a>
                        )}
                         {socialLinks.linkedin && (
                            <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${author.name} on LinkedIn`} className="text-[#A1A1AA] hover:text-[#EDEDED]">
                                {/* <Linkedin size={16} /> */}
                                <svg /* Replace with actual LinkedIn icon */ width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-3.06v8.37h3.06v-4.93c0-.81.61-1.48 1.48-1.48s1.48.67 1.48 1.48v4.93h3.06M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                            </a>
                        )}
                        {/* Add other social icons */}
                    </div>
                 )}
            </div>
        </div>
    );
};

export default AuthorInfo;