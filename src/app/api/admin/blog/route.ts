// src/app/api/admin/blog/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify';
import { Prisma } from '@prisma/client'; // Import Prisma types if needed for error handling or complex types

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
    const {
      title,
      description,
      contentJson, // Renamed from content
      published,
      featuredImageUrl,
      metaTitle,
      metaDescription,
      youtubeUrl,
      authorId, // Expecting the ID of the selected author
      categoryIds, // Expecting an array of category IDs: [1, 2, ...]
      tagNames, // Expecting an array of tag names: ["Tech", "Next.js", ...]
      galleryImages, // Expecting an array of objects: [{ url: "...", altText: "..." }, ...]
    } = body;

    // Basic validation
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const slug = await generateUniqueSlug(title);

    // Prepare data for related models
    const connectOrCreateTags = tagNames && Array.isArray(tagNames)
      ? await Promise.all(tagNames.map(async (name: string) => {
          const slug = slugify(name.trim());
          return prisma.tag.upsert({
            where: { slug },
            update: {}, // No update needed if found
            create: { name: name.trim(), slug },
          });
        }))
      : [];

    const connectCategories = categoryIds && Array.isArray(categoryIds)
      ? categoryIds.map((id: number) => ({ id: Number(id) })) // Ensure IDs are numbers
      : [];

    const createGalleryImages = galleryImages && Array.isArray(galleryImages)
      ? galleryImages.map((img: { url: string; altText?: string }) => ({
          url: img.url,
          altText: img.altText,
        }))
      : [];


    const newPostData: Prisma.BlogPostCreateInput = {
        title,
        slug,
        description,
        contentJson, // Use the new field
        published: published ?? false,
        publishedAt: published ? new Date() : null,
        featuredImageUrl,
        metaTitle,
        metaDescription,
        youtubeUrl,
        author: authorId ? { connect: { id: Number(authorId) } } : undefined, // Connect author if ID provided
        categories: { connect: connectCategories }, // Connect categories
        tags: { connect: connectOrCreateTags.map(tag => ({ id: tag.id })) }, // Connect existing/new tags
        galleryImages: { create: createGalleryImages }, // Create gallery images
    };


    const newPost = await prisma.blogPost.create({
      data: newPostData,
      include: { // Include related data in the response
          author: true,
          categories: true,
          tags: true,
          galleryImages: true,
      }
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle specific Prisma errors, e.g., foreign key constraint violation if authorId is invalid
      if (error.code === 'P2003') { // Foreign key constraint failed
          return NextResponse.json({ error: 'Invalid author or category ID provided.' }, { status: 400 });
      }
       if (error.code === 'P2002') { // Unique constraint failed (likely slug, should be rare with generation logic)
          return NextResponse.json({ error: 'Slug conflict, please try changing the title slightly.' }, { status: 409 });
      }
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
    // Include related data when listing posts for the admin view
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        author: { select: { id: true, name: true } }, // Select only needed author fields
        categories: { select: { id: true, name: true } }, // Select only needed category fields
        tags: { select: { id: true, name: true } }, // Select only needed tag fields
      }
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.