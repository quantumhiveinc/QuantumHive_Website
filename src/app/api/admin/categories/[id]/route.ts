// src/app/api/admin/categories/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client'; // Import Prisma namespace
import { slugify } from '@/lib/slugify';

interface RouteContext {
    params: {
        id: string;
    };
}

// GET /api/admin/categories/[id] - Fetches a single category by ID
export async function GET(request: NextRequest, { params }: RouteContext) {
    const session = await auth();
    // Allow any authenticated user to fetch category details. Adjust if needed.
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const categoryId = parseInt(params.id, 10);
    if (isNaN(categoryId)) {
        return NextResponse.json({ error: 'Invalid category ID format.' }, { status: 400 });
    }

    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        console.error(`Error fetching category ${categoryId}:`, error);
        return NextResponse.json({ error: 'Failed to fetch category due to a server error.' }, { status: 500 });
    }
}

// PUT /api/admin/categories/[id] - Updates an existing category
export async function PUT(request: NextRequest, { params }: RouteContext) {
    const session = await auth();
    // Only ADMINs can update categories
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Admin role required.' }, { status: 403 });
    }

    const categoryId = parseInt(params.id, 10);
    if (isNaN(categoryId)) {
        return NextResponse.json({ error: 'Invalid category ID format.' }, { status: 400 });
    }

    try {
        const body = await request.json();
        const { name }: { name?: string } = body; // Only name can be updated for a category

        // Validate name if provided
        if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
            return NextResponse.json({ error: 'Category name cannot be empty if provided.' }, { status: 400 });
        }

        // Check if category exists before attempting update
        const existingCategory = await prisma.category.findUnique({ where: { id: categoryId } });
        if (!existingCategory) {
            return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
        }

        // Prepare update data - only update if name is provided and different
        const dataToUpdate: Prisma.CategoryUpdateInput = {};
        let slug = existingCategory.slug; // Keep existing slug by default

        if (name !== undefined && name.trim() !== existingCategory.name) {
            const trimmedName = name.trim();
            dataToUpdate.name = trimmedName;
            // Generate new unique slug only if name actually changed
            slug = await generateUniqueCategorySlug(trimmedName, categoryId); // Exclude self
            dataToUpdate.slug = slug;
        }

        // If no data fields were provided for update (i.e., name wasn't provided or was the same), return existing data
        if (Object.keys(dataToUpdate).length === 0) {
             return NextResponse.json(existingCategory, { status: 200 }); // 200 OK - Nothing changed
        }

        // Perform the update
        const updatedCategory = await prisma.category.update({
            where: { id: categoryId },
            data: dataToUpdate,
        });

        console.log(`[API] Category updated: ${updatedCategory.name} (ID: ${updatedCategory.id})`);
        return NextResponse.json(updatedCategory); // 200 OK with updated data

    } catch (error: unknown) {
        console.error(`Error updating category ${categoryId}:`, error);
        // Handle unique constraint violations (for name or slug)
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002' && 'meta' in error && typeof error.meta === 'object' && error.meta !== null && 'target' in error.meta && Array.isArray(error.meta.target) && (error.meta.target.includes('slug') || error.meta.target.includes('name'))) {
             return NextResponse.json({ error: 'A category with this name or a similar generated identifier already exists.' }, { status: 409 }); // 409 Conflict
        }
        // Handle other potential errors
        return NextResponse.json({ error: 'Failed to update category due to a server error.' }, { status: 500 });
    }
}

// DELETE /api/admin/categories/[id] - Deletes a category
export async function DELETE(request: NextRequest, { params }: RouteContext) {
    const session = await auth();
    // Only ADMINs can delete categories
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Admin role required.' }, { status: 403 });
    }

    const categoryId = parseInt(params.id, 10);
    if (isNaN(categoryId)) {
        return NextResponse.json({ error: 'Invalid category ID format.' }, { status: 400 });
    }

    try {
        // Use transaction to ensure category exists before delete and handle potential errors gracefully
        const deletedCategory = await prisma.$transaction(async (tx) => {
             const category = await tx.category.findUnique({
                 where: { id: categoryId },
                 select: { name: true } // Only select necessary field for logging
             });
             if (!category) {
                 // Throw a specific error to be caught outside the transaction
                 throw new Error('CategoryNotFound');
             }
             // Deleting a category automatically disconnects it from related BlogPosts
             // because Prisma manages the implicit many-to-many relation table.
             await tx.category.delete({ where: { id: categoryId } });
             return category; // Return the name for logging purposes
        });


        console.log(`[API] Category deleted: ${deletedCategory.name} (ID: ${categoryId})`);
        // Return 204 No Content for successful deletion as per HTTP standards
        return new NextResponse(null, { status: 204 });

    } catch (error: unknown) {
        console.error(`Error deleting category ${categoryId}:`, error);
        // Catch the specific error thrown from the transaction
        if (error instanceof Error && error.message === 'CategoryNotFound') {
            return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
        }
        // Handle other potential errors (e.g., database connection issues)
        return NextResponse.json({ error: 'Failed to delete category due to a server error.' }, { status: 500 });
    }
}

/**
 * Helper function to generate a unique slug for a category, excluding the current category's ID.
 * Appends '-1', '-2', etc., if the initial slug is already taken by *another* category.
 * @param name The category name.
 * @param excludeCategoryId The ID of the category being updated (to exclude from the uniqueness check).
 * @returns A unique slug string.
 */
async function generateUniqueCategorySlug(name: string, excludeCategoryId: number): Promise<string> {
    const baseSlug = slugify(name); // Use the imported slugify function
    let potentialSlug = baseSlug;
    let counter = 1;

    // Check if the generated slug already exists for a *different* category
    while (await prisma.category.findFirst({
        where: {
            slug: potentialSlug,
            id: { not: excludeCategoryId } // Exclude the current category from the check
        }
     })) {
        // If it exists, append a counter and check again
        potentialSlug = `${baseSlug}-${counter}`;
        counter++;
        // Safety break to prevent infinite loops in extreme edge cases
        if (counter > 100) {
            console.error(`Failed to generate unique category slug for "${name}" (excluding ID ${excludeCategoryId}) after 100 attempts.`);
            throw new Error(`Could not generate unique slug for category ${name}`);
        }
    }
    return potentialSlug;
}