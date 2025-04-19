// src/app/api/admin/categories/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { slugify } from '@/lib/slugify';

// GET /api/admin/categories - Fetches all categories
export async function GET() {
    const session = await auth();
    // Allow any authenticated user to list categories. Adjust if needed.
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' }, // Order alphabetically
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: 'Failed to fetch categories due to a server error.' }, { status: 500 });
    }
}

// POST /api/admin/categories - Creates a new category
export async function POST(request: NextRequest) {
    const session = await auth();
    // Only ADMINs can create categories
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Admin role required' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name } = body;

        // Validate name
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return NextResponse.json({ error: 'Category name is required and cannot be empty.' }, { status: 400 });
        }

        const trimmedName = name.trim();
        // Generate a unique slug based on the name
        const slug = await generateUniqueCategorySlug(trimmedName);

        // Create the category in the database
        const newCategory = await prisma.category.create({
            data: {
                name: trimmedName,
                slug,
            },
        });

        console.log(`[API] Category created: ${newCategory.name} (ID: ${newCategory.id})`);
        return NextResponse.json(newCategory, { status: 201 }); // 201 Created

    } catch (error: unknown) {
        console.error("Error creating category:", error);
        // Handle unique constraint violations (for name or slug)
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002' && 'meta' in error && typeof error.meta === 'object' && error.meta !== null && 'target' in error.meta && Array.isArray(error.meta.target) && (error.meta.target.includes('slug') || error.meta.target.includes('name'))) {
             // Provide a user-friendly message for unique constraint errors
             return NextResponse.json({ error: 'A category with this name or a similar generated identifier already exists.' }, { status: 409 }); // 409 Conflict
        }
        // Handle other potential errors
        return NextResponse.json({ error: 'Failed to create category due to a server error.' }, { status: 500 });
    }
}

/**
 * Helper function to generate a unique slug for a category.
 * Appends '-1', '-2', etc., if the initial slug is already taken.
 * @param name The category name.
 * @returns A unique slug string.
 */
async function generateUniqueCategorySlug(name: string): Promise<string> {
    const baseSlug = slugify(name); // Use the imported slugify function
    let potentialSlug = baseSlug;
    let counter = 1;

    // Check if the generated slug already exists
    while (await prisma.category.findUnique({ where: { slug: potentialSlug } })) {
        // If it exists, append a counter and check again
        potentialSlug = `${baseSlug}-${counter}`;
        counter++;
        // Safety break to prevent infinite loops
        if (counter > 100) {
            console.error(`Failed to generate unique category slug for "${name}" after 100 attempts.`);
            throw new Error(`Could not generate unique slug for category ${name}`);
        }
    }
    return potentialSlug;
}