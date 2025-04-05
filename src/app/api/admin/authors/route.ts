// src/app/api/admin/authors/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify'; // Assuming you have a slugify utility

// Function to generate a unique slug for an author
async function generateUniqueAuthorSlug(name: string): Promise<string> {
  const slug = slugify(name);
  let uniqueSlug = slug;
  let counter = 1;
  while (await prisma.author.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

// GET handler to list all authors (Admin only)
export async function GET() {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const authors = await prisma.author.findMany({
      orderBy: { name: 'asc' }, // Order alphabetically by name
    });
    return NextResponse.json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    return NextResponse.json({ error: 'Failed to fetch authors' }, { status: 500 });
  }
}

// POST handler to create a new author (Admin only)
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, bio, profileImageUrl, socialMediaLinks } = body;

    if (!name) {
      return NextResponse.json({ error: 'Author name is required' }, { status: 400 });
    }

    const slug = await generateUniqueAuthorSlug(name);

    const newAuthor = await prisma.author.create({
      data: {
        name,
        slug,
        bio,
        profileImageUrl,
        socialMediaLinks, // Prisma expects JSON compatible type or null
      },
    });

    return NextResponse.json(newAuthor, { status: 201 });
  } catch (error) {
    console.error("Error creating author:", error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    // Add specific Prisma error handling if needed (e.g., unique constraint violation on slug if generation logic fails somehow)
    return NextResponse.json({ error: 'Failed to create author' }, { status: 500 });
  }
}