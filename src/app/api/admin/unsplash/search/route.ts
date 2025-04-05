// src/app/api/admin/unsplash/search/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import { decrypt, DecryptionError } from '@/lib/encryption'; // Import decrypt and error type

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user) {
   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 }

 let unsplashAccessKey: string | null = null;
const prismaConnected = true; // Flag for finally block

try { // Outer try block for the entire operation including Prisma disconnect

  // --- Fetch and Decrypt Key ---
  try {
    const setting = await prisma.setting.findUnique({ // Corrected: lowercase 'setting'
      where: { key: 'unsplash_access_key' },
    });

    if (!setting || !setting.value) {
      console.error('Unsplash Access Key not found in database settings.');
      return NextResponse.json({ error: 'Unsplash integration is not configured (key missing in DB).' }, { status: 500 });
    }

    // Decrypt the key
    try {
      unsplashAccessKey = decrypt(setting.value);
    } catch (decryptionError: unknown) {
      console.error('Failed to decrypt Unsplash Access Key:', decryptionError);
      if (decryptionError instanceof DecryptionError) {
        return NextResponse.json({ error: `Failed to decrypt Unsplash key: ${decryptionError.message}` }, { status: 500 });
      }
      return NextResponse.json({ error: 'Failed to process Unsplash configuration.' }, { status: 500 });
    }

    if (!unsplashAccessKey) {
      // Should be caught by decrypt error handling, but as a safeguard
      console.error('Decrypted Unsplash Access Key is empty.');
      return NextResponse.json({ error: 'Unsplash configuration is invalid.' }, { status: 500 });
    }
  } catch (dbError: unknown) {
    console.error('Error fetching/processing Unsplash key from DB:', dbError);
    // Avoid returning specific Prisma errors to the client
    return NextResponse.json({ error: 'Failed to retrieve Unsplash configuration.' }, { status: 500 });
  }
  // --- End Fetch and Decrypt Key ---

  // --- Proceed with Unsplash API Call ---
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
  }


 const perPage = 20; // Number of results per page
 const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${perPage}&client_id=${unsplashAccessKey}`;

  // The Unsplash API call is now directly within the main try block
    const unsplashResponse = await fetch(url, {
      headers: {
        'Accept-Version': 'v1',
      },
    });

    if (!unsplashResponse.ok) {
      const errorData = await unsplashResponse.json();
      console.error('Unsplash API error:', errorData);
      return NextResponse.json({ error: `Unsplash API error: ${unsplashResponse.statusText}` }, { status: unsplashResponse.status });
    }

    const data = await unsplashResponse.json();

    // Define a type for the expected image structure from Unsplash API
    interface UnsplashImage {
      id: string;
      alt_description?: string;
      description?: string;
      urls: {
        small: string;
        regular: string;
      };
      user: {
        name: string;
        links: {
          html: string;
        };
      };
      links: {
        html: string;
      };
    }

    // We only need specific fields for the frontend
    const simplifiedResults = data.results.map((img: UnsplashImage) => ({
      id: img.id,
      description: img.alt_description || img.description || 'Unsplash Image',
      urls: {
        small: img.urls.small,
        regular: img.urls.regular,
      },
      user: {
        name: img.user.name,
        link: img.user.links.html,
      },
      links: {
        html: img.links.html, // Link back to the image on Unsplash
      }
    }));

    return NextResponse.json(simplifiedResults);

  // --- End Unsplash API Call ---

} catch (error: unknown) { // Outer catch for general errors
  console.error('Error in Unsplash search route:', error);
  // Handle specific Prisma errors if necessary, otherwise generic error
  return NextResponse.json({ error: 'Failed to process Unsplash search request' }, { status: 500 });
} finally { // Outer finally
  if (prismaConnected) {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Failed to disconnect Prisma in Unsplash search:", disconnectError);
    }
  }
}
}