// src/app/api/admin/categories/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { slugify } from '@/lib/slugify';
import Category from '@/models/Category';
import dbConnect from '@/lib/mongoose';

// GET /api/admin/categories/[id] - Fetches a single category by ID
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Correctly typed params
) {
    const session = await auth();
    // Allow any authenticated user to fetch category details. Adjust if needed.
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await the params promise here, before the try block, so categoryId is available in catch
    const resolvedParams = await params;
    const categoryId = resolvedParams.id; // Use the ID as a string for MongoDB

    try {
        await dbConnect();
        const category = await Category.findById(categoryId);

        if (!category) {
            return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        // Cannot access categoryId directly here if promise awaited inside try
        console.error(`Error fetching category:`, error); // Log generic error
        return NextResponse.json({ error: 'Failed to fetch category due to a server error.' }, { status: 500 });
    }
}

// PUT /api/admin/categories/[id] - Updates an existing category
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Correctly typed params
) {
    const session = await auth();
    // Only ADMINs can update categories
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Admin role required.' }, { status: 403 });
    }

    // Await the params promise here, before the try block, so categoryId is available in catch
    const resolvedParams = await params;
    const categoryId = resolvedParams.id; // Use the ID as a string for MongoDB

    try {
        const body = await request.json();
        const { name }: { name?: string } = body; // Only name can be updated for a category

        // Validate name if provided
        if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
            return NextResponse.json({ error: 'Category name cannot be empty if provided.' }, { status: 400 });
        }

        await dbConnect();
        // Check if category exists before attempting update
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
        }

        // Prepare update data - only update if name is provided and different
        const dataToUpdate: { name?: string; slug?: string } = {};
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
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, dataToUpdate, { new: true });

        console.log(`[API] Category updated: ${updatedCategory.name} (ID: ${updatedCategory._id})`);
        return NextResponse.json(updatedCategory); // 200 OK with updated data

   } catch (error: unknown) {
       console.error(`Error updating category with ID ${categoryId}:`, error); // Log generic error, include ID if possible
       // Handle unique constraint violations (for name or slug) - More robust check
       if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000 && 'keyPattern' in error && typeof error.keyPattern === 'object' && error.keyPattern !== null && ('slug' in error.keyPattern || 'name' in error.keyPattern)) {
           return NextResponse.json({ error: 'A category with this name or a similar generated identifier already exists.' }, { status: 409 }); // 409 Conflict
       }
       // Handle other potential errors
       return NextResponse.json({ error: 'Failed to update category due to a server error.' }, { status: 500 });
   }
}

// DELETE /api/admin/categories/[id] - Deletes a category
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> } // Correctly typed params
) {
    const session = await auth();
    // Only ADMINs can delete categories
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized: Admin role required.' }, { status: 403 });
    }

    // Await the params promise here, before the try block, so categoryId is available in catch
    const resolvedParams = await params;
    const categoryId = resolvedParams.id; // Use the ID as a string for MongoDB

    try {
        await dbConnect();
        // Use transaction to ensure category exists before delete and handle potential errors gracefully
        const existingCategory = await Category.findById(categoryId);
        if (!existingCategory) {
            return NextResponse.json({ error: 'Category not found.' }, { status: 404 });
        }

        // Deleting a category automatically disconnects it from related BlogPosts
        await Category.findByIdAndDelete(categoryId);

        console.log(`[API] Category deleted: ${existingCategory.name} (ID: ${categoryId})`);
        // Return 204 No Content for successful deletion as per HTTP standards
        return new NextResponse(null, { status: 204 });

    } catch (error: unknown) {
        console.error(`Error deleting category with ID ${categoryId}:`, error); // Log generic error, include ID if possible
        // Catch the specific error thrown from the transaction - More robust check
        if (typeof error === 'object' && error !== null && 'name' in error && error.name === 'CastError' && 'kind' in error && error.kind === 'ObjectId') {
          return NextResponse.json({ error: 'Invalid category ID format or category not found.' }, { status: 404 }); // More specific error message
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
async function generateUniqueCategorySlug(name: string, excludeCategoryId: string): Promise<string> {
    const baseSlug = slugify(name); // Use the imported slugify function
    let potentialSlug = baseSlug;
    let counter = 1;

    await dbConnect();
    // Check if the generated slug already exists for a *different* category
    while (await Category.findOne({
        slug: potentialSlug,
        _id: { $ne: excludeCategoryId } // Exclude the current category from the check
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