// src/app/api/admin/industries/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

interface RouteParams {
  params: {
    id: string;
  };
}

// Function to generate a unique slug, checking against other industries
async function generateUniqueSlug(title: string, currentId: number): Promise<string> {
  const slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  // Check if the slug already exists for a *different* industry
  let existingIndustry = await prisma.industry.findUnique({ where: { slug: uniqueSlug } });
  while (existingIndustry && existingIndustry.id !== currentId) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
    existingIndustry = await prisma.industry.findUnique({ where: { slug: uniqueSlug } });
  }
  return uniqueSlug;
}


// GET handler to fetch a single industry by ID (Admin only)
export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const industry = await prisma.industry.findUnique({
      where: { id },
    });

    if (!industry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    return NextResponse.json(industry);
  } catch (error) {
    console.error(`Error fetching industry ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch industry' }, { status: 500 });
  }
}

// PUT handler to update an industry by ID (Admin only)
export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const body = await request.json();
    // Adapt fields as needed for Industry
    const { title, description, content, published, slug: requestedSlug } = body;

    const existingIndustry = await prisma.industry.findUnique({ where: { id } });
    if (!existingIndustry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    let finalSlug = existingIndustry.slug;
    let finalTitle = existingIndustry.title;

    // Handle title changes (must remain unique)
    if (title && title !== existingIndustry.title) {
        const titleExists = await prisma.industry.findUnique({ where: { title } });
        if (titleExists && titleExists.id !== id) {
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
       const slugExists = await prisma.industry.findUnique({ where: { slug: requestedSlug } });
       if (slugExists && slugExists.id !== id) {
           return NextResponse.json({ error: 'Requested slug is already in use' }, { status: 409 });
       }
       finalSlug = requestedSlug;
    } else if (title && title !== existingIndustry.title && !requestedSlug) {
        // If title changed and no slug requested, ensure slug is regenerated
        finalSlug = await generateUniqueSlug(finalTitle, id);
    }


    const updatedIndustry = await prisma.industry.update({
      where: { id },
      data: {
        title: finalTitle,
        slug: finalSlug,
        description: description ?? existingIndustry.description,
        content: content ?? existingIndustry.content,
        published: published ?? existingIndustry.published,
        // Adjust other fields as needed
      },
    });

    return NextResponse.json(updatedIndustry);
  } catch (error) {
    console.error(`Error updating industry ${params.id}:`, error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    // Handle potential unique constraint violations (title, slug)
    return NextResponse.json({ error: 'Failed to update industry' }, { status: 500 });
  }
}

// DELETE handler to delete an industry by ID (Admin only)
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID format' }, { status: 400 });
    }

    const existingIndustry = await prisma.industry.findUnique({ where: { id } });
    if (!existingIndustry) {
      return NextResponse.json({ error: 'Industry not found' }, { status: 404 });
    }

    await prisma.industry.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Industry deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting industry ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete industry' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.