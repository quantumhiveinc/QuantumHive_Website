// src/app/api/admin/blog/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

// Function to generate a unique slug for a blog post
async function generateUniqueSlug(title: string): Promise<string> {
  const slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  // Check if the slug already exists
  while (await prisma.blogPost.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

// POST handler to create a new blog post (Admin only)
export async function POST(request: NextRequest) {
  const session = await auth(); // Use the auth() helper

  // Check if user is authenticated and has ADMIN role
  // Check if user is authenticated and is an ADMIN
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, description, content, published } = body;

    // Basic validation
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const slug = await generateUniqueSlug(title);

    const newPost = await prisma.blogPost.create({
      data: {
        title,
        slug,
        description,
        content,
        published: published ?? false, // Default to false if not provided
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    // Consider more specific error handling based on error type
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

// GET handler to list all blog posts (Admin only)
export async function GET() { // Removed unused _request parameter
  const session = await auth(); // Use the auth() helper

  // Check if user is authenticated and has ADMIN role
  // Check if user is authenticated and is an ADMIN
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // TODO: Add pagination, sorting, filtering later if needed for admin
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        createdAt: 'desc', // Default sort by newest
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.