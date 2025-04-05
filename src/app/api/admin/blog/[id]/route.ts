// src/app/api/admin/blog/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

interface RouteParams {
  params: {
    id: string;
  };
}

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
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error(`Error fetching blog post ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT handler to update a blog post by ID (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, content, published, slug: requestedSlug } = body;

    // Fetch the existing post to compare
    const existingPost = await prisma.blogPost.findUnique({ where: { id } });
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

    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        title: title ?? existingPost.title, // Use new title or keep existing
        slug: finalSlug,
        description: description ?? existingPost.description,
        content: content ?? existingPost.content,
        published: published ?? existingPost.published,
        publishedAt: publishedAt,
        // updatedAt is handled automatically by @updatedAt directive
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error(`Error updating blog post ${params.id}:`, error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    // Add specific Prisma error handling if needed (e.g., unique constraint violation)
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE handler to delete a blog post by ID (Admin only)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
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
    console.error(`Error deleting blog post ${params.id}:`, error);
    // Add specific Prisma error handling if needed
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.