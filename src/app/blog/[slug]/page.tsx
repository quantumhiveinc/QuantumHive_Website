// src/app/blog/[slug]/page.tsx
import React from 'react';
import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Breadcrumb from '@/components/Breadcrumb';
import type { Metadata } from 'next'; // Removed unused ResolvingMetadata
// Consider using a Markdown renderer like react-markdown or mdx-bundler
// import ReactMarkdown from 'react-markdown';

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Function to fetch a single blog post by slug
async function getPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: slug, published: true }, // Only fetch published posts
  });

  if (!post) {
    notFound(); // Trigger 404 if post not found or not published
  }
  return post;
}

// Generate dynamic metadata based on the post
export async function generateMetadata(
  { params }: BlogPostPageProps
  // _parent: ResolvingMetadata // Removed unused parent parameter
): Promise<Metadata> {
  const slug = params.slug;
  const post = await prisma.blogPost.findUnique({ where: { slug } }); // Fetch even if not published for metadata

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
    title: `${post.title} | Quantum Hive Blog`,
    description: post.description || 'Read this blog post from Quantum Hive.', // Fallback description
    alternates: {
      canonical: `https://www.quantumhive.us/blog/${post.slug}`, // Use actual domain
    },
    openGraph: {
      title: post.title,
      description: post.description || undefined,
      url: `https://www.quantumhive.us/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      // Add images if you have a featured image field
      // images: [
      //   {
      //     url: post.featuredImageUrl || 'https://www.quantumhive.us/images/og-default.png',
      //     width: 1200,
      //     height: 630,
      //     alt: post.title,
      //   },
      //   ...previousImages,
      // ],
    },
    twitter: {
       card: 'summary_large_image',
       title: post.title,
       description: post.description || undefined,
       // images: [post.featuredImageUrl || 'https://www.quantumhive.us/images/twitter-default.png'],
       creator: '@QuantumHiveInc', // Or fetch author handle if available
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

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// The page component itself (Server Component)
export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug);

  const breadcrumbItems = [
    { label: 'Blog', href: '/blog' },
    { label: post.title }, // Current page title
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans">
      <Breadcrumb items={breadcrumbItems} />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <article className="prose prose-invert lg:prose-xl mx-auto"> {/* Basic styling with Tailwind Typography */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#EDEDED] mb-2">{post.title}</h1>
            {post.publishedAt && (
              <p className="text-sm text-[#A1A1AA]">
                Published on {new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            )}
             {post.description && (
                <p className="mt-4 text-lg text-[#A1A1AA]">{post.description}</p>
             )}
          </header>

          {/* Render the main content */}
          {/* Basic rendering - replace with Markdown renderer if needed */}
          <div className="whitespace-pre-wrap"> {/* Preserve whitespace and newlines */}
            {post.content || 'No content available.'}
          </div>

          {/* Example using react-markdown (install it first: npm install react-markdown) */}
          {/*
          <ReactMarkdown className="prose prose-invert lg:prose-xl">
            {post.content || ''}
          </ReactMarkdown>
          */}

        </article>
      </main>
    </div>
  );
}