// src/app/blog/page.tsx
import React from 'react'; // Keep React for JSX
import Link from 'next/link';
// import prisma from '@/lib/prisma'; // Removed Prisma import
import {
  Card,
  CardContent,
  CardDescription,
  // CardFooter, // Removed as tags are not displayed
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge"; // Removed as tags are not displayed
import Breadcrumb from '@/components/Breadcrumb'; // Import Breadcrumb
import type { Metadata } from "next"; // Import Metadata

// Define specific metadata for the blog page
export const metadata: Metadata = {
  title: "Blog | Quantum Hive",
  description: "Stay updated with the latest insights, trends, and news from the world of technology and our work at QuantumHive.",
  alternates: {
    canonical: 'https://www.quantumhive.us/blog', // Canonical URL for the blog page
  },
  openGraph: {
      title: "Quantum Hive Blog: AI & Software Development Insights",
      description: "Explore articles on AI, software development, cloud optimization, and tech trends from the Quantum Hive team.",
      url: 'https://www.quantumhive.us/blog',
      siteName: 'Quantum Hive',
      images: [
        {
          url: 'https://www.quantumhive.us/images/og-image-blog.png', // Replace with your actual blog OG image path
          width: 1200,
          height: 630,
          alt: 'Quantum Hive Blog Posts',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: "Quantum Hive Blog: AI & Software Development Insights",
      description: "Explore articles on AI, software development, cloud optimization, and tech trends.",
      creator: '@QuantumHiveInc',
      images: ['https://www.quantumhive.us/images/twitter-image-blog.png'], // Replace with your actual blog Twitter image path
    },
};


// Remove static blogPosts array

const breadcrumbItems = [{ label: 'Blog' }]; // Define breadcrumb items

// Define a basic type for the post data used in this component
interface BlogPost {
    id: number; // Or string, depending on your ID type
    slug: string;
    title: string;
    description?: string | null;
    publishedAt?: Date | null;
}

// Make the component async to fetch data
export default async function BlogIndexPage() {
  // Fetch published blog posts from the database
  // const posts = await prisma.blogPost.findMany({ // Commented out Prisma usage
  //   where: { published: true },
  //   orderBy: {
  //     publishedAt: 'desc', // Order by publish date, newest first
  //   },
  //   select: { // Select only needed fields
  //       id: true,
  //       slug: true,
  //       title: true,
  //       description: true,
  //       publishedAt: true,
  //   }
  // });

  // Placeholder data since Prisma is removed
  const posts: BlogPost[] = []; // Empty array as placeholder

  return (
    <div className="flex flex-col min-h-screen bg-[#0A0A0A] text-[#EDEDED] font-sans">
      <Breadcrumb items={breadcrumbItems} /> {/* Add Breadcrumb */}
      <main className="flex-grow container mx-auto px-4 py-16"> {/* Added flex-grow and adjusted padding */}
        <h1 className="text-4xl font-bold mb-8 text-center text-[#EDEDED]">Blog</h1> {/* Adjusted margin and color */}
        <p className="text-lg text-[#A1A1AA] mb-12 text-center max-w-2xl mx-auto"> {/* Adjusted margin and color */}
          Stay updated with the latest insights, trends, and news from the world of technology and our work at QuantumHive.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Increased gap */}
          {posts.length === 0 ? (
             <p className="text-center col-span-full text-[#A1A1AA]">No blog posts available yet. Check back soon!</p>
          ) : (
             posts.map((post) => (
                // Use dynamic slug for the href
                <Link href={`/blog/${post.slug}`} key={post.id} passHref className="block h-full">
                  {/* Applied dark theme styles and border */}
                  <Card className="h-full flex flex-col bg-[#1A1A1A] border border-[#27272A] hover:border-[#FDE047] transition-colors duration-300 cursor-pointer text-[#EDEDED]">
                    <CardHeader>
                      <CardTitle className="text-[#EDEDED]">{post.title}</CardTitle> {/* Ensure title color */}
                      {/* Format and display the publishedAt date */}
                      <CardDescription className="text-[#A1A1AA]">
                        {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Date not set'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {/* Use description from fetched post */}
                      <p className="text-[#A1A1AA]">{post.description || 'No description available.'}</p>
                    </CardContent>
                    {/* Remove CardFooter with tags for now, as tags are not in the schema */}
                    {/* <CardFooter className="flex flex-wrap gap-2 pt-4"> ... </CardFooter> */}
                  </Card>
                </Link>
             ))
          )}
        </div>
      </main>
    </div>
  );
}