// src/app/api/admin/case-studies/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import dbConnect from '@/lib/mongoose'; // Import Mongoose connection
import CaseStudy from '@/models/CaseStudy'; // Import Mongoose model
import { slugify } from '@/lib/slugify';

// Function to generate a unique slug for a case study
async function generateUniqueSlug(title: string): Promise<string> {
  const slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  await dbConnect(); // Ensure DB connection
  // Check if the slug already exists using Mongoose
  while (await CaseStudy.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
    // Safety break
    if (counter > 100) {
        console.error(`Failed to generate unique case study slug for "${title}" after 100 attempts.`);
        throw new Error(`Could not generate unique slug for case study ${title}`);
    }
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

    await dbConnect(); // Ensure DB connection
    const newCaseStudy = await CaseStudy.create({
      // data: { // Mongoose doesn't use 'data' wrapper
        title,
        slug,
        description,
        content,
        published: published ?? false,
        publishedAt: published ? new Date() : null,
        // Add other CaseStudy specific fields here later
      // }, // Mongoose doesn't use 'data' wrapper
    });

    return NextResponse.json(newCaseStudy, { status: 201 });
  } catch (error) {
    console.error("Error creating case study:", error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    // Handle Mongoose specific errors
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
        const keyPattern = (error as { keyPattern?: Record<string, number> }).keyPattern;
        if (keyPattern && keyPattern.slug) {
            return NextResponse.json({ error: 'Slug conflict, please try changing the title slightly.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'A unique field constraint was violated.' }, { status: 409 });
    }
    if (error instanceof Error && error.name === 'ValidationError') {
        return NextResponse.json({ error: `Validation failed: ${error.message}` }, { status: 400 });
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
    await dbConnect(); // Ensure DB connection
    const studies = await CaseStudy.find()
      .sort({ createdAt: 'desc' }); // Mongoose sort syntax

    return NextResponse.json(studies);
  } catch (error) {
    console.error("Error fetching case studies:", error);
    return NextResponse.json({ error: 'Failed to fetch case studies' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.