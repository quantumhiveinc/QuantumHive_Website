// src/app/api/admin/industries/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import { slugify } from '@/lib/slugify';
import Industry from '@/models/Industry';
import dbConnect from '@/lib/mongoose';
// import Industry from '@/models/Industry'; // Removed duplicate import

// Removed unused RouteParams interface
// interface RouteParams {
//   params: {
//     id: string;
//   };
// }

// Function to generate a unique slug, checking against other industries
async function generateUniqueSlug(title: string, currentId: string): Promise<string> {
  const slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  // Check if the slug already exists for a *different* industry
  await dbConnect();
  let existingIndustry = await Industry.findOne({ slug: uniqueSlug });
  while (existingIndustry && existingIndustry._id.toString() !== currentId) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
    existingIndustry = await Industry.findOne({ slug: uniqueSlug });
  }
  return uniqueSlug;
}


// GET handler to fetch a single industry by ID (Admin only)
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
    const industry = await Industry.findById(id);

    if (!industry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    return NextResponse.json(industry);
  } catch (error) {
    // Cannot access params directly here if promise awaited inside try - Now we can access params.id
    console.error(`Error fetching industry:`, error); // Log generic error
    // Handle Mongoose CastError for invalid ID format
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ error: 'Invalid industry ID format.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to fetch industry' }, { status: 500 });
  }
}

// PUT handler to update an industry by ID (Admin only)
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
    // Adapt fields as needed for Industry
    const { title, description, content, published, slug: requestedSlug } = body;

    await dbConnect();
    const existingIndustry = await Industry.findById(id);
    if (!existingIndustry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    let finalSlug = existingIndustry.slug;
    let finalTitle = existingIndustry.title;

    // Handle title changes (must remain unique)
    if (title && title !== existingIndustry.title) {
        const titleExists = await Industry.findOne({ title });
        if (titleExists && titleExists._id.toString() !== id) {
            return NextResponse.json({ error: 'Industry with this title already exists' }, { status: 409 });
        }
        finalTitle = title;
        // Regenerate slug if title changes, unless a specific slug was also requested
        if (!requestedSlug || slugify(title) === requestedSlug) {
             finalSlug = await generateUniqueSlug(title, id);
        }
    }

    // Handle requested slug changes (must remain unique)
    if (requestedSlug && requestedSlug !== existingIndustry.slug) {
       const slugExists = await Industry.findOne({ slug: requestedSlug });
       if (slugExists && slugExists._id.toString() !== id) {
           return NextResponse.json({ error: 'Requested slug is already in use' }, { status: 409 });
       }
       finalSlug = requestedSlug;
    } else if (title && title !== existingIndustry.title && !requestedSlug) {
        // If title changed and no slug requested, ensure slug is regenerated
        finalSlug = await generateUniqueSlug(finalTitle, id);
    }


    const updatedIndustry = await Industry.findByIdAndUpdate(
      id,
      {
        title: finalTitle,
        slug: finalSlug,
        description: description ?? existingIndustry.description,
        content: content ?? existingIndustry.content,
        published: published ?? existingIndustry.published,
        // Adjust other fields as needed
      },
      { new: true } // Return the updated document
    );

    return NextResponse.json(updatedIndustry);
  } catch (error) {
    // Cannot access params directly here if promise awaited inside try - Now we can access params.id
    console.error(`Error updating industry:`, error); // Log generic error
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    // Handle Mongoose specific errors
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ error: 'Invalid ID format provided.' }, { status: 400 });
    }
    // Handle Mongoose unique constraint errors (e.g., for slug or title)
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
        const keyPattern = (error as { keyPattern?: Record<string, number> }).keyPattern;
        if (keyPattern && keyPattern.slug) {
            return NextResponse.json({ error: 'Slug conflict, please try changing the title slightly.' }, { status: 409 });
        }
        if (keyPattern && keyPattern.title) {
            return NextResponse.json({ error: 'An industry with this title already exists.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'A unique field constraint was violated.' }, { status: 409 });
    }
    if (error instanceof Error && error.name === 'ValidationError') {
        return NextResponse.json({ error: `Validation failed: ${error.message}` }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update industry' }, { status: 500 });
  }
}

// DELETE handler to delete an industry by ID (Admin only)
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
    const existingIndustry = await Industry.findById(id);
    if (!existingIndustry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    await Industry.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Industry deleted successfully' }, { status: 200 });
  } catch (error) {
    // Cannot access params directly here if promise awaited inside try - Now we can access params.id
    console.error(`Error deleting industry:`, error); // Log generic error
    // Handle Mongoose CastError for invalid ID format
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ error: 'Invalid industry ID format.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to delete industry' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.