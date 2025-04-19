// src/app/api/admin/authors/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // Import Prisma namespace from the client package
import { slugify } from '@/lib/slugify'; // Needed for potential slug updates

interface RouteContext {
    params: {
        id: string;
    };
}

// GET /api/admin/authors/[id] - Fetches a single author by ID
export async function GET(request: NextRequest, { params }: RouteContext) {
    const session = await auth();
    // Allow any authenticated user to fetch author details
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authorId = parseInt(params.id, 10);
    if (isNaN(authorId)) {
        return NextResponse.json({ error: 'Invalid author ID format' }, { status: 400 });
    }

    try {
        const author = await prisma.author.findUnique({
            where: { id: authorId },
        });

        if (!author) {
            return NextResponse.json({ error: 'Author not found' }, { status: 404 });
        }

        return NextResponse.json(author);
    } catch (error) {
        console.error(`Error fetching author ${authorId}:`, error);
        return NextResponse.json({ error: 'Failed to fetch author due to a server error' }, { status: 500 });
    }
}

// PUT /api/admin/authors/[id] - Updates an existing author
export async function PUT(request: NextRequest, { params }: RouteContext) {
    const session = await auth();
    // Only ADMINs can update authors
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const authorId = parseInt(params.id, 10);
    if (isNaN(authorId)) {
        return NextResponse.json({ error: 'Invalid author ID format' }, { status: 400 });
    }

    try {
        const body = await request.json();
        // Explicitly define the expected structure for clarity and type safety
        const { name, bio, profileImageUrl, socialMediaLinks }: { // Use Prisma.InputJsonValue for socialMediaLinks
            name?: string;
            bio?: string | null;
            profileImageUrl?: string | null;
            socialMediaLinks?: Prisma.InputJsonValue | null;
        } = body;

        // Validate required fields for update
        if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
            return NextResponse.json({ error: 'Author name cannot be empty if provided' }, { status: 400 });
        }

        // Check if author exists before attempting update
        const existingAuthor = await prisma.author.findUnique({ where: { id: authorId } });
        if (!existingAuthor) {
            return NextResponse.json({ error: 'Author not found' }, { status: 404 });
        }

        // Prepare data for update, only including fields that were actually provided
        const dataToUpdate: Prisma.AuthorUpdateInput = {}; // Use Prisma.AuthorUpdateInput type
        let slug = existingAuthor.slug;

        if (name !== undefined && name.trim() !== existingAuthor.name) {
            const trimmedName = name.trim();
            dataToUpdate.name = trimmedName;
            // Generate a new unique slug only if the name actually changes
            slug = await generateUniqueSlug(trimmedName, authorId); // Pass authorId to exclude self during check
            dataToUpdate.slug = slug;
        }
        // Allow explicitly setting fields to null or updating them
        if (bio !== undefined) dataToUpdate.bio = bio;
        if (profileImageUrl !== undefined) dataToUpdate.profileImageUrl = profileImageUrl;
        if (socialMediaLinks !== undefined) {
            // If input is null, set to DbNull; otherwise, use the provided JSON value
            dataToUpdate.socialMediaLinks = socialMediaLinks === null ? Prisma.DbNull : socialMediaLinks;
        }

        // If no data fields were provided for update, return early or return existing data
        if (Object.keys(dataToUpdate).length === 0) {
             return NextResponse.json(existingAuthor, { status: 200 }); // Nothing to update
        }


        const updatedAuthor = await prisma.author.update({
            where: { id: authorId },
            data: dataToUpdate,
        });

        console.log(`[API] Author updated: ${updatedAuthor.name} (ID: ${updatedAuthor.id})`);
        return NextResponse.json(updatedAuthor);

    } catch (error: unknown) {
        console.error(`Error updating author ${authorId}:`, error);
         // Handle potential unique constraint violation for slug
         if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002' && 'meta' in error && typeof error.meta === 'object' && error.meta !== null && 'target' in error.meta && Array.isArray(error.meta.target) && error.meta.target.includes('slug')) {
             return NextResponse.json({ error: 'Failed to generate a unique identifier (slug) for the updated author name. Please try a slightly different name.' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Failed to update author due to a server error' }, { status: 500 });
    }
}

// DELETE /api/admin/authors/[id] - Deletes an author
export async function DELETE(request: NextRequest, { params }: RouteContext) {
    const session = await auth();
    // Only ADMINs can delete authors
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    const authorId = parseInt(params.id, 10);
    if (isNaN(authorId)) {
        return NextResponse.json({ error: 'Invalid author ID format' }, { status: 400 });
    }

    try {
        // Use transaction to ensure author exists before attempting delete
        const deletedAuthor = await prisma.$transaction(async (tx) => {
            const author = await tx.author.findUnique({
                where: { id: authorId },
                select: { name: true } // Select only needed field
            });
            if (!author) {
                // Throw an error that can be caught outside the transaction
                throw new Error('AuthorNotFound');
            }
            await tx.author.delete({ where: { id: authorId } });
            return author; // Return the author data for logging
        });


        // Note: The relation in BlogPost model uses `onDelete: SetNull`,
        // so deleting an author will automatically set the authorId on related posts to null.

        console.log(`[API] Author deleted: ${deletedAuthor.name} (ID: ${authorId})`);
        // Return 204 No Content for successful deletion as there's no body content
        return new NextResponse(null, { status: 204 });

    } catch (error: unknown) {
        console.error(`Error deleting author ${authorId}:`, error);
        // Handle the specific 'AuthorNotFound' error from the transaction
        if (error instanceof Error && error.message === 'AuthorNotFound') {
            return NextResponse.json({ error: 'Author not found' }, { status: 404 });
        }
        // Handle other potential errors (e.g., database connection issues)
        return NextResponse.json({ error: 'Failed to delete author due to a server error' }, { status: 500 });
    }
}


/**
 * Helper function to generate a unique slug for an author, excluding the current author's ID.
 * Appends '-1', '-2', etc., if the initial slug is already taken by *another* author.
 * @param name The author's name.
 * @param excludeAuthorId The ID of the author being updated (to exclude from the uniqueness check).
 * @returns A unique slug string.
 */
async function generateUniqueSlug(name: string, excludeAuthorId: number): Promise<string> {
    const baseSlug = slugify(name); // Use the imported slugify function
    let potentialSlug = baseSlug;
    let counter = 1;

    // Check if the generated slug already exists for a *different* author
    while (await prisma.author.findFirst({
        where: {
            slug: potentialSlug,
            id: { not: excludeAuthorId } // Exclude the current author from the check
        }
     })) {
        // If it exists, append a counter and check again
        potentialSlug = `${baseSlug}-${counter}`;
        counter++;
        // Safety break to prevent infinite loops
        if (counter > 100) {
            console.error(`Failed to generate unique slug for "${name}" (excluding ID ${excludeAuthorId}) after 100 attempts.`);
            throw new Error(`Could not generate unique slug for ${name}`);
        }
    }
    return potentialSlug;
}