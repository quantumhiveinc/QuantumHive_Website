// src/app/api/admin/industries/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import dbConnect from '@/lib/mongoose'; // Import Mongoose connection
import Industry from '@/models/Industry'; // Import Mongoose model
import { slugify } from '@/lib/slugify';

// Function to generate a unique slug for an industry
async function generateUniqueSlug(title: string): Promise<string> {
  const slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  await dbConnect(); // Ensure DB connection
  // Check if the slug already exists using Mongoose
  while (await Industry.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
    // Safety break
    if (counter > 100) {
        console.error(`Failed to generate unique industry slug for "${title}" after 100 attempts.`);
        throw new Error(`Could not generate unique slug for industry ${title}`);
    }
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

    await dbConnect(); // Ensure DB connection
    // Check if title already exists (since it's unique) using Mongoose
    const existingIndustry = await Industry.findOne({ title });
    if (existingIndustry) {
        return NextResponse.json({ error: 'Industry with this title already exists' }, { status: 409 }); // 409 Conflict
    }

    const slug = await generateUniqueSlug(title);

    const newIndustry = await Industry.create({
      // data: { // Mongoose doesn't use 'data' wrapper
        title,
        slug,
        description,
        content,
        published: published ?? false,
        // Industries might not have a 'publishedAt' concept, adjust schema if needed
      // }, // Mongoose doesn't use 'data' wrapper
    });

    return NextResponse.json(newIndustry, { status: 201 });
  } catch (error) {
    console.error("Error creating industry:", error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    // Handle Mongoose specific errors
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
        const keyPattern = (error as { keyPattern?: Record<string, number> }).keyPattern;
        if (keyPattern && keyPattern.slug) {
            return NextResponse.json({ error: 'Slug conflict, please try changing the title slightly.' }, { status: 409 });
        }
        if (keyPattern && keyPattern.title) {
             // This case might be caught by the initial check, but handle race conditions
            return NextResponse.json({ error: 'An industry with this title already exists.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'A unique field constraint was violated.' }, { status: 409 });
    }
    if (error instanceof Error && error.name === 'ValidationError') {
        return NextResponse.json({ error: `Validation failed: ${error.message}` }, { status: 400 });
    }
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
    await dbConnect(); // Ensure DB connection
    const industries = await Industry.find()
      .sort({ title: 'asc' }); // Mongoose sort syntax

    return NextResponse.json(industries);
  } catch (error) {
    console.error("Error fetching industries:", error);
    return NextResponse.json({ error: 'Failed to fetch industries' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.