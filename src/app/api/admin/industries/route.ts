// src/app/api/admin/industries/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

// Function to generate a unique slug for an industry
async function generateUniqueSlug(title: string): Promise<string> {
  const slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  // Check if the slug already exists
  // Note: Industry titles themselves are also marked unique in the schema
  while (await prisma.industry.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

// POST handler to create a new industry (Admin only)
export async function POST(request: NextRequest) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    // Adapt fields as needed for Industry
    const { title, description, content, published } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Check if title already exists (since it's unique)
    const existingIndustry = await prisma.industry.findUnique({ where: { title } });
    if (existingIndustry) {
        return NextResponse.json({ error: 'Industry with this title already exists' }, { status: 409 }); // 409 Conflict
    }

    const slug = await generateUniqueSlug(title);

    const newIndustry = await prisma.industry.create({
      data: {
        title,
        slug,
        description,
        content,
        published: published ?? false,
        // Industries might not have a 'publishedAt' concept, adjust schema if needed
      },
    });

    return NextResponse.json(newIndustry, { status: 201 });
  } catch (error) {
    console.error("Error creating industry:", error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    // Handle potential unique constraint violation on title if race condition occurs
    // (though the initial check reduces likelihood)
    return NextResponse.json({ error: 'Failed to create industry' }, { status: 500 });
  }
}

// GET handler to list all industries (Admin only)
export async function GET() { // Removed unused _request parameter
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const industries = await prisma.industry.findMany({
      orderBy: {
        title: 'asc', // Default sort alphabetically by title
      },
    });
    return NextResponse.json(industries);
  } catch (error) {
    console.error("Error fetching industries:", error);
    return NextResponse.json({ error: 'Failed to fetch industries' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.