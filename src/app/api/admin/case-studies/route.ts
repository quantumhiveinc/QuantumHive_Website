// src/app/api/admin/case-studies/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

// Function to generate a unique slug for a case study
async function generateUniqueSlug(title: string): Promise<string> {
  const slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  // Check if the slug already exists
  while (await prisma.caseStudy.findUnique({ where: { slug: uniqueSlug } })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

// POST handler to create a new case study (Admin only)
export async function POST(request: NextRequest) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    // Adapt fields as needed for CaseStudy (e.g., clientName, results)
    const { title, description, content, published } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const slug = await generateUniqueSlug(title);

    const newCaseStudy = await prisma.caseStudy.create({
      data: {
        title,
        slug,
        description,
        content,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
        // Add other CaseStudy specific fields here later
      },
    });

    return NextResponse.json(newCaseStudy, { status: 201 });
  } catch (error) {
    console.error("Error creating case study:", error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create case study' }, { status: 500 });
  }
}

// GET handler to list all case studies (Admin only)
export async function GET() { // Removed unused _request parameter
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const studies = await prisma.caseStudy.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(studies);
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.