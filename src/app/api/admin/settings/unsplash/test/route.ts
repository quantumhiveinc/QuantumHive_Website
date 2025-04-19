import { NextResponse } from 'next/server';
import { auth } from '@/auth';
// Decryption logic is now centralized in @/lib/encryption
// Import it if/when needed for fetching keys from DB:
// import { decrypt, DecryptionError } from '@/lib/encryption';


export async function POST(request: Request) {
    const session = await auth();

    // 1. Authentication Check
    if (!session || !session.user) { // TODO: Add role check if needed
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { accessKey } = body; // Only accessKey is needed for this test

        if (!accessKey) {
            // TODO: Optionally fetch saved keys from DB if not provided in body
            // This would require implementing the GET handler in the main settings route first
            // and calling decrypt() on the fetched values.
            // For now, we require the key in the body for testing.
            return NextResponse.json({ error: 'Access Key is required in the request body for testing.' }, { status: 400 });
        }

        // --- Unsplash API Test Call ---
        // Use the provided keys to make a simple request to Unsplash API, e.g., get user profile
        // IMPORTANT: The 'Authorization' header format is specific to Unsplash API v1
        const testUrl = 'https://api.unsplash.com/photos/random'; // Changed endpoint
        const headers = {
            'Authorization': `Client-ID ${accessKey}`, // Use Access Key for Client-ID auth
            'Accept-Version': 'v1'
        };

        console.log(`Testing Unsplash connection to ${testUrl} with Access Key: ${accessKey.substring(0, 5)}...`);

        const unsplashResponse = await fetch(testUrl, { headers });

        console.log(`Unsplash API response status: ${unsplashResponse.status}`);

        if (unsplashResponse.ok) {
            // const data = await unsplashResponse.json(); // Optionally check data
            return NextResponse.json({ success: true, message: 'Connection successful!' }, { status: 200 });
        } else {
            const errorData = await unsplashResponse.text();
            console.error('Unsplash API Error:', errorData);
            let errorMessage = `Unsplash API returned status ${unsplashResponse.status}.`;
            if (unsplashResponse.status === 401) {
                errorMessage = 'Authentication failed. Check your Access Key.';
            } else if (unsplashResponse.status === 403) {
                 errorMessage = 'Permission denied. Check API key permissions or rate limits.';
            }
            // Consider parsing errorData if it's JSON for more specific messages
            return NextResponse.json({ success: false, error: errorMessage }, { status: 400 }); // Return 400 to indicate client-side key issue
        }
        // --- End Unsplash API Test Call ---

    } catch (error: unknown) {
        console.error('Failed to test Unsplash connection:', error);
        if (error instanceof SyntaxError) { // JSON parsing error
            return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
        }
        // Add handling for potential future DecryptionErrors if fetching from DB
        // if (error instanceof DecryptionError) {
        //     return NextResponse.json({ error: `Decryption failed: ${error.message}` }, { status: 500 });
        // }
        const message = error instanceof Error ? error.message : String(error);
        return NextResponse.json({ error: `Internal Server Error during test: ${message}` }, { status: 500 });
    }
}