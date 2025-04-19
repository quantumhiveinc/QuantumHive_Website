// src/app/api/admin/upload/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { generatePresignedPutUrl } from '@/lib/s3'; // Import the new function

export async function POST(request: NextRequest) {
    const session = await auth();
    // Ensure user is authenticated and is an ADMIN
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // Parse the request body to get fileName and fileType
        const body = await request.json();
        const { fileName, fileType } = body;

        // Validate input
        if (!fileName || typeof fileName !== 'string' || !fileType || typeof fileType !== 'string') {
            return NextResponse.json({ error: 'Missing or invalid fileName or fileType in request body' }, { status: 400 });
        }

        console.log(`[Upload API - Presign] Received request for: Name=${fileName}, Type=${fileType}`);

        // Generate the presigned URL using the utility function from s3.ts
        // This function handles interaction with AWS SDK and environment variables
        const presignedResult = await generatePresignedPutUrl({ fileName, fileType });

        console.log(`[Upload API - Presign] Generated URL: ${presignedResult.uploadUrl}, Key: ${presignedResult.key}, Public URL: ${presignedResult.publicUrl}`);

        // Return the presigned URL, the unique key assigned in S3, and the final public URL
        return NextResponse.json(presignedResult, { status: 200 });

    } catch (error) {
        console.error("Error generating presigned URL:", error);

        let errorMessage = 'Failed to generate presigned URL';
        const statusCode = 500;

        if (error instanceof Error) {
            errorMessage = error.message;
            // Check if the error is specifically due to missing environment variables from s3.ts
            if (errorMessage.includes("Missing required AWS S3 environment variables")) {
                 errorMessage = 'Server configuration error: Missing AWS S3 credentials.';
                 // Keep statusCode 500 as it's a server-side issue
            }
        }

        // Return a generic error message to the client, log the details server-side
        return NextResponse.json({ error: 'Failed to process upload request.', details: errorMessage }, { status: statusCode });
    }
}