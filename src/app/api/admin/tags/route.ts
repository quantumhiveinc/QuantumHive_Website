// src/app/api/admin/tags/route.ts
import { NextResponse } from 'next/server'; // Keep unused NextRequest removed
import { auth } from '@/auth';
import dbConnect from '@/lib/mongoose'; // Import Mongoose connection
import Tag from '@/models/Tag'; // Import Mongoose model

// GET /api/admin/tags - Fetches all tags
export async function GET() {
    const session = await auth();
    // Allow any authenticated user to list tags.
    // This is useful for populating tag selection inputs in the admin UI.
    if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect(); // Ensure DB connection
        const tags = await Tag.find()
            .sort({ name: 'asc' }) // Mongoose sort syntax
            // Select only the fields likely needed for a tag selector UI
            .select('_id name slug'); // Use _id for Mongoose, select fields

        return NextResponse.json(tags);
    } catch (error) {
        console.error("Error fetching tags:", error);
        return NextResponse.json({ error: 'Failed to fetch tags due to a server error.' }, { status: 500 });
    }
}

// Note: Full CRUD operations (POST, PUT, DELETE) for tags are not specified
// for Phase 1 in the comprehensive plan (docs/comprehensive-blog-enhancement-plan.md).
// Tags are often created/managed implicitly through their association with blog posts
// during the post creation/update process, which will be handled in the blog post API.
// If dedicated tag management UI/API is needed later, it can be added.