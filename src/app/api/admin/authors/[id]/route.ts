// src/app/api/admin/authors/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify'; // Assuming you have a slugify utility

interface RouteParams {
  params: {
    id: string;
  };
}

// Function to generate a unique slug, checking against other authors
async function generateUniqueAuthorSlug(name: string, currentId: number): Promise<string> {
  const slug = slugify(name);
  let uniqueSlug = slug;
  let counter = 1;
  let existingAuthor = await prisma.author.findUnique({ where: { slug: uniqueSlug } });
  while (existingAuthor && existingAuthor.id !== currentId) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
    existingAuthor = await prisma.author.findUnique({ where: { slug: uniqueSlug } });
  }
  return uniqueSlug;
}

// GET handler to fetch a single author by ID (Admin only)
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const author = await prisma.author.findUnique({
      where: { id },
    });

    if (!author) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    return NextResponse.json(author);
  } catch (error) {
    console.error(`Error fetching author ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch author' }, { status: 500 });
  }
}

// PUT handler to update an author by ID (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    const { name, bio, profileImageUrl, socialMediaLinks, slug: requestedSlug } = body;

    const existingAuthor = await prisma.author.findUnique({ where: { id } });
    if (!existingAuthor) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    let finalSlug = existingAuthor.slug;
    if (name && name !== existingAuthor.name) {
      finalSlug = await generateUniqueAuthorSlug(name, id);
    } else if (requestedSlug && requestedSlug !== existingAuthor.slug) {
       const slugExists = await prisma.author.findUnique({ where: { slug: requestedSlug } });
       if (slugExists && slugExists.id !== id) {
           return NextResponse.json({ error: 'Requested slug is already in use by another author' }, { status: 409 });
       }
       finalSlug = requestedSlug;
    }


    const updatedAuthor = await prisma.author.update({
      where: { id },
      data: {
        name: name ?? existingAuthor.name,
        slug: finalSlug,
        bio: bio ?? existingAuthor.bio,
        profileImageUrl: profileImageUrl ?? existingAuthor.profileImageUrl,
        socialMediaLinks: socialMediaLinks ?? existingAuthor.socialMediaLinks,
      },
    });

    return NextResponse.json(updatedAuthor);
  } catch (error) {
    console.error(`Error updating author ${params.id}:`, error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    // Add specific Prisma error handling if needed
    return NextResponse.json({ error: 'Failed to update author' }, { status: 500 });
  }
}

// DELETE handler to delete an author by ID (Admin only)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    // Check if author exists before deleting
    const existingAuthor = await prisma.author.findUnique({ where: { id } });
    if (!existingAuthor) {
      return NextResponse.json({ error: 'Author not found' }, { status: 404 });
    }

    // Note: The schema sets onDelete: SetNull for the author relation on BlogPost.
    // So, deleting an author will set the authorId to null on their posts.
    await prisma.author.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Author deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting author ${params.id}:`, error);
    // Add specific Prisma error handling if needed
    return NextResponse.json({ error: 'Failed to delete author' }, { status: 500 });
  }
}