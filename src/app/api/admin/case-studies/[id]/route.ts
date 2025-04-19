// src/app/api/admin/case-studies/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import dbConnect from '@/lib/mongoose';
import { slugify } from '@/lib/slugify';
import CaseStudy from '@/models/CaseStudy';

// Function to generate a unique slug, checking against other case studies
async function generateUniqueSlug(title: string, currentId: string): Promise<string> {
  const slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  // Check if the slug already exists for a *different* case study
  await dbConnect();
  let existingStudy = await CaseStudy.findOne({ slug: uniqueSlug });
  while (existingStudy && existingStudy._id.toString() !== currentId) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
    existingStudy = await CaseStudy.findOne({ slug: uniqueSlug });
  }
  return uniqueSlug;
}


// GET handler to fetch a single case study by ID (Admin only)
export async function GET(
    request: NextRequest, // Keep request parameter
    { params }: { params: Promise<{ id: string }> } // Correctly typed params
) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params; // Await the params promise
    const id = resolvedParams.id; // Use the ID as a string for MongoDB

    await dbConnect();
    const study = await CaseStudy.findById(id);

    if (!study) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    return NextResponse.json(study);
  } catch (error) {
    // Cannot access params directly here if promise awaited inside try - Now we can access params.id
    console.error(`Error fetching case study with ID ${(await params).id}:`, error); // Log generic error with ID
    // Handle Mongoose CastError for invalid ID format
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ error: 'Invalid case study ID format.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to fetch case study' }, { status: 500 });
  }
}

// PUT handler to update a case study by ID (Admin only)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Correctly typed params
) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params; // Await the params promise
    const id = resolvedParams.id; // Use the ID as a string for MongoDB

    const body = await request.json();
    // Adapt fields as needed for CaseStudy
    const { title, description, content, published, slug: requestedSlug } = body;

    await dbConnect();
    const existingStudy = await CaseStudy.findById(id);
    if (!existingStudy) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    let finalSlug = existingStudy.slug;

    if (title && title !== existingStudy.title) {
      finalSlug = await generateUniqueSlug(title, id);
    } else if (requestedSlug && requestedSlug !== existingStudy.slug) {
       const slugExists = await CaseStudy.findOne({ slug: requestedSlug });
       if (slugExists && slugExists._id.toString() !== id) {
           return NextResponse.json({ error: 'Requested slug is already in use' }, { status: 409 });
       }
       finalSlug = requestedSlug;
    }

    let publishedAt = existingStudy.publishedAt;
    if (published === true && !existingStudy.published) {
      publishedAt = new Date();
    } else if (published === false) {
      publishedAt = null;
    }

    const updatedStudy = await CaseStudy.findByIdAndUpdate(
      id,
      {
        title: title ?? existingStudy.title,
        slug: finalSlug,
        description: description ?? existingStudy.description,
        content: content ?? existingStudy.content,
        published: published ?? existingStudy.published,
        publishedAt: publishedAt,
        // Add other CaseStudy specific fields here later
      },
      { new: true } // Return the updated document
    );

    return NextResponse.json(updatedStudy);
  } catch (error) {
    // Cannot access params directly here if promise awaited inside try - Now we can access params.id
    console.error(`Error updating case study with ID ${(await params).id}:`, error); // Log generic error with ID
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
     // Handle Mongoose specific errors
     if (error instanceof Error && error.name === 'CastError') {
         return NextResponse.json({ error: 'Invalid ID format provided.' }, { status: 400 });
     }
     // Handle Mongoose unique constraint errors (e.g., for slug)
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
    return NextResponse.json({ error: 'Failed to update case study' }, { status: 500 });
  }
}

// DELETE handler to delete a case study by ID (Admin only)
export async function DELETE(
    request: NextRequest, // Keep request parameter
    { params }: { params: Promise<{ id: string }> } // Correctly typed params
) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const resolvedParams = await params; // Await the params promise
    const id = resolvedParams.id; // Use the ID as a string for MongoDB

    await dbConnect();
    const existingStudy = await CaseStudy.findById(id);
    if (!existingStudy) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    await CaseStudy.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Case study deleted successfully' }, { status: 200 });
  } catch (error) {
    // Cannot access params directly here if promise awaited inside try - Now we can access params.id
    console.error(`Error deleting case study with ID ${(await params).id}:`, error); // Log generic error with ID
    // Handle Mongoose CastError for invalid ID format
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ error: 'Invalid case study ID format.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to delete case study' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.