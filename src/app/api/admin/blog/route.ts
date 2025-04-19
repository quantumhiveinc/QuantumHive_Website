// src/app/api/admin/blog/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Import from the central auth config file
import { slugify } from '@/lib/slugify';
import Blog from '@/models/Blog'; // Removed IBlog import
import Category from '@/models/Category';
import Image, { IImage } from '@/models/Image'; // Keep IImage if used
import dbConnect from '@/lib/mongoose';

// Function to generate a unique slug for a blog post
async function generateUniqueSlug(title: string): Promise<string> {
  const slug = slugify(title);
  let uniqueSlug = slug;
  let counter = 1;

  // Check if the slug already exists
  await dbConnect();
  while (await Blog.findOne({ slug: uniqueSlug })) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }
  return uniqueSlug;
}

// POST handler to create a new blog post (Admin only)
export async function POST(request: NextRequest) {
  const session = await auth(); // Use the auth() helper

  // Check if user is authenticated and has ADMIN role
  // Check if user is authenticated and is an ADMIN
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      contentJson, // Renamed from content
      published,
      featuredImageUrl,
      metaTitle,
      metaDescription,
      youtubeUrl,
      // authorId, // Removed authorId
      categoryIds, // Expecting an array of category IDs: [1, 2, ...]
      galleryImages, // Expecting an array of objects: [{ url: "...", altText: "..." }, ...]
    } = body;

    // Basic validation
    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const slug = await generateUniqueSlug(title);

    // Prepare data for related models - Removed commented Tag logic

    // Prepare category IDs
    const categoryIdsArray = categoryIds && Array.isArray(categoryIds)
      ? categoryIds.map(id => String(id)) // Ensure IDs are strings for MongoDB
      : [];

    // Prepare tag IDs - Removed commented Tag logic


    // Create the blog post with the new schema structure
    const newPostData = {
      title,
      slug,
      description,
      contentJson,
      published: published ?? false,
      publishedAt: published ? new Date() : null,
      featuredImageUrl,
      metaTitle,
      metaDescription,
      youtubeUrl,
      // Store category IDs directly
      categoryIds: categoryIdsArray,
      // tagIds: tagIdsArray, // Removed Tag logic
    };


    await dbConnect();
    // Create the blog post - Type inference works
    const newPost = await Blog.create(newPostData);

    // Create gallery images if provided
    if (galleryImages && Array.isArray(galleryImages) && galleryImages.length > 0) {
      await Promise.all(galleryImages.map(async (img) => {
        const newImage = new Image({
          url: img.url,
          altText: img.altText || null,
          blogPostId: newPost._id,
          isGalleryImage: true
        });
        await newImage.save();
      }));
    }

    // Fetch the complete post with related data - Type inference works
    const createdPost = await Blog.findById(newPost._id); // Populate might not be needed if IDs are sufficient for response

    if (!createdPost) {
      return NextResponse.json({ error: 'Failed to retrieve created post' }, { status: 500 });
    }

    // Fetch gallery images
    const createdGalleryImages = await Image.find({
      blogPostId: newPost._id,
      isGalleryImage: true
    });

    // Fetch categories and tags
    const categories = createdPost.categoryIds.length > 0
      ? await Category.find({ _id: { $in: createdPost.categoryIds } })
      : [];

    // const tags = createdPost.tagIds.length > 0 // Removed Tag logic
    //   ? await Tag.find({ _id: { $in: createdPost.tagIds } })
    //   : [];

    // Transform the response to include categories
    const transformedPost = {
      ...createdPost.toObject(),
      galleryImages: createdGalleryImages,
      categories,
      // tags // Removed Tag logic
    };

    return NextResponse.json(transformedPost, { status: 201 });
  } catch (error) {
    console.error("Error creating blog post:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
    }
    // Handle Mongoose specific errors
    if (error instanceof Error && error.name === 'CastError') {
        return NextResponse.json({ error: 'Invalid ID format provided for Category.' }, { status: 400 });
    }
    // Handle Mongoose unique constraint errors (e.g., for slug)
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
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
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

// GET handler to list all blog posts (Admin only)
export async function GET() { // Removed unused _request parameter
  const session = await auth(); // Use the auth() helper

  // Check if user is authenticated and has ADMIN role
  // Check if user is authenticated and is an ADMIN
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // TODO: Add pagination, sorting, filtering later if needed for admin
    // Include related data when listing posts for the admin view
    await dbConnect();
    // Type inference works
    const posts = await Blog.find()
      .sort({ createdAt: 'desc' }) // Mongoose uses 'desc' or -1
      .exec();

  // Transform posts to include categories
  const transformedPosts = await Promise.all(posts.map(async (post) => { // Removed IBlog type
    // Fetch gallery images
    const galleryImages: IImage[] = await Image.find({ // Keep IImage if used elsewhere
      blogPostId: post._id,
      isGalleryImage: true
    });

      // Fetch categories and tags
      const categories = post.categoryIds.length > 0
        ? await Category.find({ _id: { $in: post.categoryIds } })
        : [];

      // const tags = post.tagIds.length > 0 // Removed Tag logic
      //   ? await Tag.find({ _id: { $in: post.tagIds } })
      //   : [];

      return {
        ...post.toObject(),
        galleryImages,
        categories,
      };
    }));

    return NextResponse.json(transformedPosts);
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// Authentication and authorization checks are now implemented above.