// src/app/api/admin/authors/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify'; // Assuming slugify utility exists

// GET /api/admin/authors - Fetches all authors
export async function GET() { // Remove unused parameter
    const session = await auth();
    // Allow read access for any authenticated user. Adjust if only ADMINs should list.
    if (!session?.user) {
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

// POST /api/admin/authors - Creates a new author
export async function POST(request: NextRequest) {
    const session = await auth();
    // Only ADMINs can create authors
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 }); // Use 403 Forbidden
    }

    try {
        const body = await request.json();
        // Basic validation
        const { name, bio, profileImageUrl, socialMediaLinks } = body;

        if (!name || typeof name !== 'string' || name.trim() === '') {
            return NextResponse.json({ error: 'Author name is required and cannot be empty' }, { status: 400 });
        }

        // Generate a unique slug for the author
        const slug = await generateUniqueSlug(name.trim());

        const newAuthor = await prisma.author.create({
            data: {
                name: name.trim(),
                slug,
                bio: bio || null, // Ensure null if empty string or undefined
                profileImageUrl: profileImageUrl || null,
                socialMediaLinks: socialMediaLinks || undefined, // Prisma handles Json? correctly
            },
        });

        console.log(`[API] Author created: ${newAuthor.name} (ID: ${newAuthor.id})`);
        return NextResponse.json(newAuthor, { status: 201 }); // 201 Created

    } catch (error: unknown) { // Use unknown instead of any
        console.error("Error creating author:", error);
        // Handle potential unique constraint violation for slug (rare due to helper, but possible race condition)
        // Type check before accessing properties
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002' && 'meta' in error && typeof error.meta === 'object' && error.meta !== null && 'target' in error.meta && Array.isArray(error.meta.target) && error.meta.target.includes('slug')) {
             return NextResponse.json({ error: 'Failed to generate a unique identifier (slug) for the author name. Please try a slightly different name.' }, { status: 409 }); // 409 Conflict
        }
        // Handle other potential Prisma errors or general errors
        return NextResponse.json({ error: 'Failed to create author due to a server error.' }, { status: 500 });
    }
}


/**
 * Helper function to generate a unique slug for an author.
 * Appends '-1', '-2', etc., if the initial slug is already taken.
 * @param name The author's name.
 * @returns A unique slug string.
 */
async function generateUniqueSlug(name: string): Promise<string> {
    const baseSlug = slugify(name); // Use the imported slugify function
    let potentialSlug = baseSlug;
    let counter = 1;

    // Check if the generated slug already exists
    while (await prisma.author.findUnique({ where: { slug: potentialSlug } })) {
        // If it exists, append a counter and check again
        potentialSlug = `${baseSlug}-${counter}`;
        counter++;
        // Safety break to prevent infinite loops in extreme edge cases
        if (counter > 100) {
            console.error(`Failed to generate unique slug for "${name}" after 100 attempts.`);
            throw new Error(`Could not generate unique slug for ${name}`);
        }
    }
    return potentialSlug;
}