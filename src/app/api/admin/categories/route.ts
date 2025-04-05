// src/app/api/admin/categories/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify'; // Assuming you have a slugify utility

// Function to generate a unique slug for a category
async function generateUniqueCategorySlug(name: string): Promise<string> {
  const slug = slugify(name);
  let uniqueSlug = slug;
  let counter = 1;
  while (await prisma.category.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

// GET handler to list all categories (Admin only)
export async function GET() {
  const session = await auth();
  // Allow authenticated users (not just admins) to fetch categories for selection in the editor?
  // Or keep it admin-only for now? Let's keep it admin-only for consistency.
  if (!session?.user || session.user.role !== 'ADMIN') {
     // If needed for non-admins later, adjust this check or create a separate public endpoint
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST handler to create a new category (Admin only)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = await generateUniqueCategorySlug(name);

    const newCategory = await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    // Handle potential unique constraint errors on name/slug
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
         return NextResponse.json({ error: 'Category name or slug already exists' }, { status: 409 }); // Conflict
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}