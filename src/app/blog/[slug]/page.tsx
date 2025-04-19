// src/app/blog/[slug]/page.tsx
import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import type { Metadata } from 'next';
import Image from 'next/image'; // For Featured Image
import Link from 'next/link'; // For Category/Tag links
import { JSONContent } from '@tiptap/react'; // Import JSONContent for type assertion
// We'll need client components for rendering JSON content and the gallery slider
import RenderTiptapContent from '../../../components/RenderTiptapContent'; // Assume this component exists/will be created
import GallerySlider from '../../../components/GallerySlider'; // Assume this component exists/will be created
import YouTubeEmbed from '../../../components/YouTubeEmbed'; // Assume this component exists/will be created
// import AuthorInfo, { type Author } from '../../../components/AuthorInfo'; // Removed AuthorInfo import

interface BlogPostPageProps {
  // Update params to be a Promise as expected by Next.js 15+ for Server Components
  params: Promise<{
    slug: string;
  }>;
}

// Function to fetch a single blog post by slug
async function getPost(slug: string) {
  // Fetch post and include all necessary related data
  const post = await prisma.blogPost.findUnique({
    where: { slug: slug, published: true },
    include: {
      // author: true, // Removed author include
      categories: { select: { id: true, name: true, slug: true } }, // Select needed fields
      tags: { select: { id: true, name: true, slug: true } },       // Select needed fields
      galleryImages: { select: { id: true, url: true, altText: true } }, // Select needed fields
    },
  });

  if (!post) {
    notFound(); // Trigger 404 if post not found or not published
  }
  return post;
}

// Generate dynamic metadata based on the post
export async function generateMetadata(
  { params: paramsPromise }: BlogPostPageProps // Rename to avoid conflict after awaiting
  // _parent: ResolvingMetadata // Removed unused parent parameter
): Promise<Metadata> {
  const params = await paramsPromise; // Await the params promise
  const slug = params.slug; // Access slug from resolved params
  // Fetch post including fields needed for metadata
  const post = await prisma.blogPost.findUnique({
      where: { slug },
      select: { // Select only necessary fields for metadata
          title: true,
          description: true,
          slug: true,
          publishedAt: true,
          updatedAt: true,
          featuredImageUrl: true,
          metaTitle: true,
          metaDescription: true,
          // author: { select: { name: true } } // Removed author selection
      }
  });

  if (!post) {
    // Optionally return default metadata or handle not found case
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  // Optionally merge with parent metadata
  // const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.metaTitle || `${post.title} | Quantum Hive Blog`, // Use Meta Title if available
    description: post.metaDescription || post.description || 'Read this blog post from Quantum Hive.', // Use Meta Description, fallback to post description
    alternates: {
      canonical: `https://www.quantumhive.us/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle || post.title, // Use Meta Title if available
      description: post.metaDescription || post.description || undefined, // Use Meta Description if available
      url: `https://www.quantumhive.us/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      // authors: post.author ? [post.author.name] : undefined, // Removed author metadata
      images: post.featuredImageUrl ? [ // Use featured image if available
        {
          url: post.featuredImageUrl,
          // width: 1200, // Optional: Add dimensions if known
          // height: 630,
          alt: post.title,
        }
      ] : undefined, // Or provide a default OG image URL
    },
    twitter: {
       card: post.featuredImageUrl ? 'summary_large_image' : 'summary', // Use large image card if image exists
       title: post.metaTitle || post.title,
       description: post.metaDescription || post.description || undefined,
       images: post.featuredImageUrl ? [post.featuredImageUrl] : undefined, // Use featured image if available
       creator: '@QuantumHiveInc', // TODO: Potentially use author's Twitter handle from Author model
    }
    // Add other metadata like author, tags etc. if available
  };
}

// Generate static paths for published posts at build time
export async function generateStaticParams() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { slug: true }, // Only select the slug
  });

  // Add explicit type for 'post' parameter
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

// The page component itself (Server Component)
export default async function BlogPostPage({ params: paramsPromise }: BlogPostPageProps) { // Rename to avoid conflict
  const params = await paramsPromise; // Await the params promise
  const post = await getPost(params.slug); // Use resolved params

  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: post.title }, // Current page title
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans">
      <Breadcrumb items={breadcrumbItems} />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <article className="max-w-4xl mx-auto"> {/* Use max-width for better control */}
          {/* Featured Image */}
          {post.featuredImageUrl && (
            <div className="mb-8 aspect-video relative w-full overflow-hidden rounded-lg">
              <Image
                src={post.featuredImageUrl}
                alt={post.title}
                fill
                style={{ objectFit: 'cover' }} // Maintain cover behavior with fill
                priority // Prioritize loading the main image
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#EDEDED] mb-4">{post.title}</h1>
             {/* Categories and Tags */}
             <div className="flex flex-wrap gap-2 mb-4 text-sm">
                 {/* Add explicit type for 'category' parameter */}
                {post.categories.map((category: { id: number; name: string; slug: string }) => (
                    <Link key={category.id} href={`/blog/category/${category.slug}`} className="bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors">
                        {category.name}
                    </Link>
                ))}
                 {/* Add explicit type for 'tag' parameter */}
                 {post.tags.map((tag: { id: number; name: string; slug: string }) => (
                    <Link key={tag.id} href={`/blog/tag/${tag.slug}`} className="bg-secondary/10 text-secondary px-2 py-1 rounded hover:bg-secondary/20 transition-colors">
                        #{tag.name}
                    </Link>
                ))}
            </div>
            {/* Date */}
            <div className="flex items-center space-x-4 text-sm text-[#A1A1AA]">
               {/* Removed AuthorInfo component */}
               {/* {post.author && <AuthorInfo author={post.author as Author} />} */}
               {/* {post.publishedAt && (
                 <span>&middot;</span> // Separator - No longer needed if only date is shown
               )} */}
               {post.publishedAt && (
                 <time dateTime={post.publishedAt.toISOString()}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                 </time>
               )}
            </div>
             {post.description && (
                <p className="mt-6 text-lg text-[#A1A1AA] italic border-l-4 border-primary pl-4">{post.description}</p>
             )}
          </header>

          {/* Render the main content */}
          {/* Render TipTap JSON Content */}
          <div className="prose prose-invert lg:prose-xl mt-8">
            {post.contentJson ? (
                 // Assert type as JSONContent, assuming valid data from DB
                 <RenderTiptapContent content={post.contentJson as JSONContent} />
             ) : (
                 <p>No content available.</p>
             )}
          </div>

          {/* Render YouTube Embed */}
          {post.youtubeUrl && (
            <div className="mt-8">
                <YouTubeEmbed url={post.youtubeUrl} />
            </div>
          )}

           {/* Render Image Gallery Slider */}
           {post.galleryImages && post.galleryImages.length > 0 && (
             <div className="mt-12">
                <h2 className="text-2xl font-semibold mb-4">Image Gallery</h2>
                <GallerySlider images={post.galleryImages} />
             </div>
           )}

        </article>
      </main>
    </div>
  );
}