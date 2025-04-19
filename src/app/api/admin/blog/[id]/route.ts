// src/app/api/admin/blog/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import { slugify } from '@/lib/slugify';
import Blog from '@/models/Blog'; // Removed IBlog import
import Category from '@/models/Category';
// import Tag from '@/models/Tag'; // Removed Tag import
import Image, { IImage } from '@/models/Image'; // Keep IImage if used
import dbConnect from '@/lib/mongoose'; // Import Mongoose connection

// Function to generate a unique slug, checking against other posts
async function generateUniqueSlug(title: string, currentId: string): Promise<string> {
  const baseSlug = slugify(title);
  let uniqueSlug = baseSlug;
  let counter = 1;

  await dbConnect(); // Ensure DB connection
  // Check if the slug already exists for a *different* post using Mongoose
  let existingPost = await Blog.findOne({ slug: uniqueSlug, _id: { $ne: currentId } }); // Use Mongoose findOne and $ne
  while (existingPost) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
    existingPost = await Blog.findOne({ slug: uniqueSlug, _id: { $ne: currentId } });
    // Safety break
    if (counter > 100) {
        console.error(`Failed to generate unique blog slug for "${title}" (excluding ID ${currentId}) after 100 attempts.`);
        throw new Error(`Could not generate unique slug for blog post ${title}`);
    }
  }
  return uniqueSlug;
}


// GET handler to fetch a single blog post by ID (Admin only)
export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // Directly type the context param
) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Await the params promise here, before the try block, so id is available in catch
  const resolvedParams = await context.params;
  const id = resolvedParams.id; // Access id via resolvedParams.id

  try {
    await dbConnect(); // Ensure DB connection

    // Fetch the post using Mongoose - Type inference will work here
    const post = await Blog.findById(id);

    if (!post) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Fetch gallery images using Mongoose
    const galleryImages: IImage[] = await Image.find({
      blogPostId: id,
      isGalleryImage: true
    }).select('id url altText'); // Select specific fields

    // Fetch categories using Mongoose
    const categories = post.categoryIds && post.categoryIds.length > 0
      ? await Category.find({ _id: { $in: post.categoryIds } }).select('id name')
      : [];

    // Fetch tags using Mongoose - Removed Tag logic
    // const tags = post.tagIds && post.tagIds.length > 0
    //   ? await Tag.find({ _id: { $in: post.tagIds } }).select('id name')
    //   : [];

    // Transform the response using Mongoose document's toObject()
    const transformedPost = {
      ...post.toObject(), // Convert Mongoose document to plain object
      galleryImages,
      categories,
      // tags // Removed Tag logic
    };


    return NextResponse.json(transformedPost);
  } catch (error) {
    console.error(`Error fetching blog post with ID ${id}:`, error); // Log generic error with ID using resolved id
    // Handle Mongoose CastError for invalid ID format
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ error: 'Invalid blog post ID format.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT handler to update a blog post by ID (Admin only)
export async function PUT(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // Directly type the context param
) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Await the params promise here, before the try block, so id is available in catch
  const resolvedParams = await context.params;
  const id = resolvedParams.id; // Access id via resolvedParams.id

  try {
    const body = await request.json();
    // Destructure all potential fields from the body
    const {
        title,
        description,
        contentJson,
        published,
        slug: requestedSlug,
        featuredImageUrl,
        metaTitle,
        metaDescription,
        youtubeUrl,
        // authorId, // Removed authorId
        categoryIds, // Array of strings (ObjectIds)
        // tagNames, // Array of strings - Removed Tag logic
        galleryImages, // Array of objects: [{ url: "...", altText: "..." }]
    } = body;

    // Fetch the existing post to compare
    await dbConnect(); // Ensure DB connection

    // Fetch the existing post using Mongoose - Type inference works
    const existingPost = await Blog.findById(id);

    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    let finalSlug = existingPost.slug;

    // Regenerate slug only if the title has changed or if a specific slug was requested
    if (title && title !== existingPost.title) {
      finalSlug = await generateUniqueSlug(title, id); // Use resolved id
    } else if (requestedSlug && requestedSlug !== existingPost.slug) {
       // If a specific slug is requested and it's different, validate its uniqueness using Mongoose
       const slugExists = await Blog.findOne({ slug: requestedSlug, _id: { $ne: id } });
       if (slugExists) {
           return NextResponse.json({ error: 'Requested slug is already in use by another post' }, { status: 409 }); // 409 Conflict
       }
       finalSlug = requestedSlug;
    }


    // Determine the publishedAt date
    let publishedAt = existingPost.publishedAt;
    if (published === true && !existingPost.published) {
      publishedAt = new Date(); // Set publish date if transitioning to published
    } else if (published === false) {
      publishedAt = null; // Clear publish date if unpublishing
    }

    // Prepare updates for relations - Removed Tag logic
    // Handle tags - create or find them first
    // const connectOrCreateTags = tagNames && Array.isArray(tagNames)
    //   ? await Promise.all(tagNames.map(async (name: string) => {
    //       const tagName = name.trim();
    //       const tagSlug = slugify(tagName);
    //       // Find or create tag using Mongoose
    //       let tag = await Tag.findOne({ slug: tagSlug });
    //       if (!tag) {
    //         tag = await Tag.create({ name: tagName, slug: tagSlug });
    //       }
    //       return tag;
    //     }))
    //   : [];

    // We'll use categoryIds directly when creating the relations

    // --- Prepare Base Update Data including category and tag IDs ---
    const updateData = {
        title: title ?? existingPost.title,
        slug: finalSlug,
        description: description ?? existingPost.description,
        contentJson: contentJson ?? existingPost.contentJson,
        published: published ?? existingPost.published,
        publishedAt: publishedAt,
        featuredImageUrl: featuredImageUrl !== undefined ? featuredImageUrl : existingPost.featuredImageUrl, // Handle null/empty string if needed
        metaTitle: metaTitle !== undefined ? metaTitle : existingPost.metaTitle,
        metaDescription: metaDescription !== undefined ? metaDescription : existingPost.metaDescription,
        youtubeUrl: youtubeUrl !== undefined ? youtubeUrl : existingPost.youtubeUrl,
        // Update category IDs if provided
        categoryIds: categoryIds !== undefined
            ? (Array.isArray(categoryIds) ? categoryIds : [])
            : existingPost.categoryIds,
        // Update tag IDs if provided - Removed Tag logic
        // tagIds: tagNames !== undefined
        //     ? connectOrCreateTags.map((tag: Tag) => tag.id) // Add explicit type Tag
        //     : existingPost.tagIds,
    };

    // --- Update using Mongoose ---

    // 1. Update the main post data
    const updatedPost = await Blog.findByIdAndUpdate(id, updateData, { new: true }); // {new: true} returns the updated document

    if (!updatedPost) {
        // Should not happen if findById worked earlier, but good practice
        return NextResponse.json({ error: 'Blog post not found during update.' }, { status: 404 });
    }

    // 2. Handle Gallery Image Updates (if galleryImages array is provided)
    if (galleryImages !== undefined && Array.isArray(galleryImages)) {
        // Delete existing gallery images for this post
        await Image.deleteMany({ blogPostId: id, isGalleryImage: true });

        // Create new images if the array is not empty
        if (galleryImages.length > 0) {
            const imageDocsToCreate = galleryImages.map(img => ({
                url: img.url,
                altText: img.altText || null,
                blogPostId: id,
                isGalleryImage: true
            }));
            await Image.insertMany(imageDocsToCreate);
        }
    }

     // Fetch the final updated post data again to populate relations if needed,
     // or construct the response manually if updateData is sufficient.
     // For simplicity here, we'll re-fetch to ensure consistency.

     const finalUpdatedPostData = await Blog.findById(id);

     if (!finalUpdatedPostData) {
        return NextResponse.json({ error: 'Failed to retrieve updated post after update.' }, { status: 500 });
     }

     // Fetch updated gallery images
     const updatedGalleryImages = await Image.find({
        blogPostId: id,
        isGalleryImage: true
     }).select('id url altText');

     // Fetch updated categories and tags
     const updatedCategories = finalUpdatedPostData.categoryIds && finalUpdatedPostData.categoryIds.length > 0
        ? await Category.find({ _id: { $in: finalUpdatedPostData.categoryIds } }).select('id name')
        : [];

    // const updatedTags = finalUpdatedPostData.tagIds && finalUpdatedPostData.tagIds.length > 0 // Removed Tag logic
    //    ? await Tag.find({ _id: { $in: finalUpdatedPostData.tagIds } }).select('id name')
    //    : [];

    // Transform the response
     const transformedFinalPost = {
       ...finalUpdatedPostData.toObject(),
       galleryImages: updatedGalleryImages,
       categories: updatedCategories,
       // tags: updatedTags // Removed Tag logic
     };


    return NextResponse.json(transformedFinalPost);

  } catch (error) {
    console.error(`Error updating blog post with ID ${id}:`, error); // Log generic error with ID using resolved id
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
     // Handle Mongoose specific errors
     if (error instanceof Error && error.name === 'CastError') {
         return NextResponse.json({ error: 'Invalid ID format provided for related data (Category or Tag).' }, { status: 400 });
     }
     // Handle Mongoose unique constraint errors (e.g., for slug)
     if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
         // Check which key caused the error (e.g., slug)
         const keyPattern = (error as { keyPattern?: Record<string, number> }).keyPattern;
         if (keyPattern && keyPattern.slug) {
             return NextResponse.json({ error: 'Slug conflict, please try changing the title slightly.' }, { status: 409 });
         }
         return NextResponse.json({ error: 'A unique field constraint was violated.' }, { status: 409 });
     }
     if (error instanceof Error && error.name === 'ValidationError') {
         // Extract specific validation messages if needed
         return NextResponse.json({ error: `Validation failed: ${error.message}` }, { status: 400 });
     }
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE handler to delete a blog post by ID (Admin only)
export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> } // Directly type the context param
) {
  const session = await auth(); // Use the auth() helper
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Await the params promise here, before the try block, so id is available in catch
  const resolvedParams = await context.params;
  const id = resolvedParams.id; // Access id via resolvedParams.id

  try {
    await dbConnect(); // Ensure DB connection

    // Check if post exists before deleting using Mongoose
    const existingPost = await Blog.findById(id);
    if (!existingPost) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    // Delete the blog post
    await Blog.findByIdAndDelete(id);

    // Also delete associated images (featured and gallery)
    await Image.deleteMany({ blogPostId: id });

    // Return 204 No Content for successful deletion
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error(`Error deleting blog post with ID ${id}:`, error); // Log generic error with ID using resolved id
    // Handle Mongoose CastError for invalid ID format
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ error: 'Invalid blog post ID format.' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.