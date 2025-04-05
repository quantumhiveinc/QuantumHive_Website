// src/app/api/admin/categories/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify'; // Assuming you have a slugify utility

interface RouteParams {
  params: {
    id: string;
  };
}

// Function to generate a unique slug, checking against other categories
async function generateUniqueCategorySlug(name: string, currentId: number): Promise<string> {
  const slug = slugify(name);
  let uniqueSlug = slug;
  let counter = 1;
  let existingCategory = await prisma.category.findUnique({ where: { slug: uniqueSlug } });
  while (existingCategory && existingCategory.id !== currentId) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
    existingCategory = await prisma.category.findUnique({ where: { slug: uniqueSlug } });
  }
  return uniqueSlug;
}


// PUT handler to update a category by ID (Admin only)
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
    const { name, slug: requestedSlug } = body; // Only name and slug can be updated

    if (!name) {
        return NextResponse.json({ error: 'Category name cannot be empty' }, { status: 400 });
    }

    const existingCategory = await prisma.category.findUnique({ where: { id } });
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    let finalSlug = existingCategory.slug;
    // Regenerate slug if name changed, or validate if specific slug requested
    if (name && name !== existingCategory.name) {
      finalSlug = await generateUniqueCategorySlug(name, id);
    } else if (requestedSlug && requestedSlug !== existingCategory.slug) {
       const slugExists = await prisma.category.findUnique({ where: { slug: requestedSlug } });
       if (slugExists && slugExists.id !== id) {
           return NextResponse.json({ error: 'Requested slug is already in use by another category' }, { status: 409 });
       }
       finalSlug = requestedSlug;
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name: name, // Name is required, so no need for nullish coalescing
        slug: finalSlug,
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error(`Error updating category ${params.id}:`, error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
     // Handle potential unique constraint errors on name/slug
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
         return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 409 }); // Conflict
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE handler to delete a category by ID (Admin only)
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

    // Check if category exists before deleting
    const existingCategory = await prisma.category.findUnique({
        where: { id },
        include: { posts: { select: { id: true } } } // Check if any posts are using it
    });
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Optional: Prevent deletion if category is associated with posts
    // if (existingCategory.posts.length > 0) {
    //     return NextResponse.json({ error: 'Cannot delete category associated with posts' }, { status: 400 });
    // }
    // If allowing deletion, the relation table entries will be removed automatically by Prisma

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting category ${params.id}:`, error);
    // Add specific Prisma error handling if needed (e.g., foreign key constraints if not handled)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}