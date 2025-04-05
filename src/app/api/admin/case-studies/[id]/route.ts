// src/app/api/admin/case-studies/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

interface RouteParams {
  params: {
    id: string;
  };
}

// Function to generate a unique slug, checking against other case studies
async function generateUniqueSlug(title: string, currentId: number): Promise<string> {
  const slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  // Check if the slug already exists for a *different* case study
  let existingStudy = await prisma.caseStudy.findUnique({ where: { slug: uniqueSlug } });
  while (existingStudy && existingStudy.id !== currentId) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
    existingStudy = await prisma.caseStudy.findUnique({ where: { slug: uniqueSlug } });
  }
  return uniqueSlug;
}


// GET handler to fetch a single case study by ID (Admin only)
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

    const study = await prisma.caseStudy.findUnique({
      where: { id },
    });

    if (!study) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    return NextResponse.json(study);
  } catch (error) {
    console.error(`Error fetching case study ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch case study' }, { status: 500 });
  }
}

// PUT handler to update a case study by ID (Admin only)
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
    // Adapt fields as needed for CaseStudy
    const { title, description, content, published, slug: requestedSlug } = body;

    const existingStudy = await prisma.caseStudy.findUnique({ where: { id } });
    if (!existingStudy) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    let finalSlug = existingStudy.slug;

    if (title && title !== existingStudy.title) {
      finalSlug = await generateUniqueSlug(title, id);
    } else if (requestedSlug && requestedSlug !== existingStudy.slug) {
       const slugExists = await prisma.caseStudy.findUnique({ where: { slug: requestedSlug } });
       if (slugExists && slugExists.id !== id) {
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

    const updatedStudy = await prisma.caseStudy.update({
      where: { id },
      data: {
        title: title ?? existingStudy.title,
        slug: finalSlug,
        description: description ?? existingStudy.description,
        content: content ?? existingStudy.content,
        published: published ?? existingStudy.published,
        publishedAt: publishedAt,
        // Add other CaseStudy specific fields here later
      },
    });

    return NextResponse.json(updatedStudy);
  } catch (error) {
    console.error(`Error updating case study ${params.id}:`, error);
     if (error instanceof SyntaxError) {
        return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update case study' }, { status: 500 });
  }
}

// DELETE handler to delete a case study by ID (Admin only)
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

    const existingStudy = await prisma.caseStudy.findUnique({ where: { id } });
    if (!existingStudy) {
      return NextResponse.json({ error: 'Case study not found' }, { status: 404 });
    }

    await prisma.caseStudy.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Case study deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting case study ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to delete case study' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.