// src/app/api/admin/blog/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify';
import { Prisma } from '@prisma/client'; // Revert to only Prisma namespace import

// Removed unused RouteParams interface
// interface RouteParams {
//   params: {
//     id: string;
//   };
// }

// Function to generate a unique slug, checking against other posts
async function generateUniqueSlug(title: string, currentId: number): Promise<string> {
  const slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  // Check if the slug already exists for a *different* post
  let existingPost = await prisma.blogPost.findUnique({ where: { slug: uniqueSlug } });
  while (existingPost && existingPost.id !== currentId) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
    existingPost = await prisma.blogPost.findUnique({ where: { slug: uniqueSlug } });
  }
  return uniqueSlug;
}


// GET handler to fetch a single blog post by ID (Admin only)
export async function GET(
    request: NextRequest,
    { params: paramsPromise }: { params: Promise<{ id: string }> } // Type params as Promise
) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await paramsPromise; // Await the params promise
    const id = parseInt(params.id, 10); // Access id from resolved params
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // Include related data when fetching a single post
    const post = await prisma.blogPost.findUnique({
      where: { id },
      include: {
        // author: { select: { id: true, name: true } }, // Removed author include
        categories: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
        galleryImages: { select: { id: true, url: true, altText: true } }, // Include gallery images
      },
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    // Cannot access params directly here if promise awaited inside try
    console.error(`Error fetching blog post:`, error); // Log generic error
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT handler to update a blog post by ID (Admin only)
export async function PUT(
    request: NextRequest,
    { params: paramsPromise }: { params: Promise<{ id: string }> } // Type params as Promise
) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await paramsPromise; // Await the params promise
    const id = parseInt(params.id, 10); // Access id from resolved params
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    // Destructure all potential fields from the body
    const {
        title,
        description,
        contentJson,
        published,
        slug: requestedSlug,
        featuredImageUrl,
        metaTitle,
        metaDescription,
        youtubeUrl,
        // authorId, // Removed authorId
        categoryIds, // Array of numbers
        tagNames, // Array of strings
        galleryImages, // Array of objects: [{ url: "...", altText: "..." }]
    } = body;

    // Fetch the existing post to compare
    // Fetch the existing post *with* its current relations for comparison/update
    const existingPost = await prisma.blogPost.findUnique({
        where: { id },
        include: { categories: true, tags: true, galleryImages: true } // Include relations needed for update logic
    });
    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    let finalSlug = existingPost.slug;

    // Regenerate slug only if the title has changed or if a specific slug was requested
    if (title && title !== existingPost.title) {
      finalSlug = await generateUniqueSlug(title, id);
    } else if (requestedSlug && requestedSlug !== existingPost.slug) {
       // If a specific slug is requested and it's different, validate its uniqueness
       const slugExists = await prisma.blogPost.findUnique({ where: { slug: requestedSlug } });
       if (slugExists && slugExists.id !== id) {
           return NextResponse.json({ error: 'Requested slug is already in use' }, { status: 409 }); // 409 Conflict
       }
       finalSlug = requestedSlug;
    }


    // Determine the publishedAt date
    let publishedAt = existingPost.publishedAt;
    if (published === true && !existingPost.published) {
      publishedAt = new Date(); // Set publish date if transitioning to published
    } else if (published === false) {
      publishedAt = null; // Clear publish date if unpublishing
    }

    // Prepare updates for relations
    const connectOrCreateTags = tagNames && Array.isArray(tagNames)
      ? await Promise.all(tagNames.map(async (name: string) => {
          const slug = slugify(name.trim());
          return prisma.tag.upsert({
            where: { slug },
            update: {},
            create: { name: name.trim(), slug },
          });
        }))
      : [];

    const categoryConnections = categoryIds && Array.isArray(categoryIds)
        ? categoryIds.map((catId: number) => ({ id: Number(catId) }))
        : [];

    // --- Prepare Base Update Data (excluding gallery images) ---
    // Remove explicit type annotation as a workaround for TS error
    const updateData = {
        title: title ?? existingPost.title,
        slug: finalSlug,
        description: description ?? existingPost.description,
        contentJson: contentJson ?? existingPost.contentJson,
        published: published ?? existingPost.published,
        publishedAt: publishedAt,
        featuredImageUrl: featuredImageUrl !== undefined ? featuredImageUrl : existingPost.featuredImageUrl, // Handle null/empty string if needed
        metaTitle: metaTitle !== undefined ? metaTitle : existingPost.metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : existingPost.metaDescription,
        youtubeUrl: youtubeUrl !== undefined ? youtubeUrl : existingPost.youtubeUrl,
        // Removed author update logic
        // author: authorId === null ...
        // Categories: Replace existing connections with the new set if provided
        categories: categoryIds !== undefined ? { set: categoryConnections } : undefined,
        // Tags: Replace existing connections with the new set if provided
        tags: tagNames !== undefined ? { set: connectOrCreateTags.map(tag => ({ id: tag.id })) } : undefined,
    };

    // --- Use a transaction for atomicity, especially with gallery updates ---
    const transactionSteps: Prisma.PrismaPromise<unknown>[] = []; // Use unknown instead of any

    // 1. Update the main post data (excluding gallery images for now)
    transactionSteps.push(
        prisma.blogPost.update({
            where: { id },
            data: updateData,
        })
    );

    // 2. Handle Gallery Image Updates (if galleryImages array is provided)
    // Strategy: Delete existing images for this post, then create new ones.
    if (galleryImages !== undefined && Array.isArray(galleryImages)) {
        // Delete existing images
        transactionSteps.push(prisma.image.deleteMany({ where: { blogPostId: id } }));

        // Create new images if the array is not empty
        if (galleryImages.length > 0) {
            transactionSteps.push(
                prisma.image.createMany({
                    data: galleryImages.map((img: { url: string; altText?: string }) => ({
                        url: img.url,
                        altText: img.altText,
                        blogPostId: id, // Link to the current post
                    })),
                })
            );
        }
    }

    // Execute the transaction
    await prisma.$transaction(transactionSteps);

     // Fetch the final updated post with all includes to return to the client
     const finalUpdatedPost = await prisma.blogPost.findUnique({
       where: { id },
       include: {
           // author: true, // Removed author include
           categories: true,
           tags: true,
           galleryImages: true,
        }
     });

    if (!finalUpdatedPost) {
        // Should not happen if transaction succeeded, but good practice to check
        return NextResponse.json({ error: 'Failed to retrieve updated post after transaction.' }, { status: 500 });
    }

    return NextResponse.json(finalUpdatedPost);

  } catch (error) {
    // Cannot access params directly here if promise awaited inside try
    console.error(`Error updating blog post:`, error); // Log generic error
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
     // Type guard to check if error is an object with a 'code' property (like Prisma errors)
     if (typeof error === 'object' && error !== null && 'code' in error) {
        const prismaError = error as { code: string; meta?: unknown }; // Type assertion after check
        // Handle specific Prisma errors
        if (prismaError.code === 'P2003') { // Foreign key constraint failed
            // Determine which field caused the error if possible (e.g., check error.meta.field_name)
            const field = (prismaError.meta as { field_name?: string })?.field_name;
            // if (field?.includes('authorId')) return NextResponse.json({ error: 'Invalid Author ID provided.' }, { status: 400 }); // Removed author check
            if (field?.includes('categories')) return NextResponse.json({ error: 'Invalid Category ID provided.' }, { status: 400 });
            return NextResponse.json({ error: 'Invalid related ID provided.' }, { status: 400 });
        }
         if (prismaError.code === 'P2002') { // Unique constraint failed
            return NextResponse.json({ error: 'Slug conflict, please try changing the title slightly.' }, { status: 409 });
        }
         if (prismaError.code === 'P2025') { // Record to update/delete not found
             return NextResponse.json({ error: 'Blog post not found during update.' }, { status: 404 });
         }
    }
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE handler to delete a blog post by ID (Admin only)
export async function DELETE(
    request: NextRequest,
    { params: paramsPromise }: { params: Promise<{ id: string }> } // Type params as Promise
) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const params = await paramsPromise; // Await the params promise
    const id = parseInt(params.id, 10); // Access id from resolved params
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // Check if post exists before deleting
    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Blog post deleted successfully' }, { status: 200 }); // Or 204 No Content
  } catch (error) {
    // Cannot access params directly here if promise awaited inside try
    console.error(`Error deleting blog post:`, error); // Log generic error
    // Add specific Prisma error handling if needed
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.