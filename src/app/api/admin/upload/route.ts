// src/app/api/admin/upload/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from 'crypto'; // For generating unique filenames

// Ensure required environment variables are set
if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION || !process.env.S3_BUCKET_NAME) {
    console.error("Error: Missing required AWS S3 environment variables.");
    // Optionally throw an error during build/startup in a real app
}

const s3Client = new S3Client({
    region: process.env.AWS_REGION!,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME!;

export async function POST(request: NextRequest) {
    const session = await auth();
    if (!session?.user || session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Generate a unique filename to prevent overwrites
        const fileExtension = file.name.split('.').pop();
        const uniqueFilename = `${randomUUID()}.${fileExtension}`;

        // Read file content into a buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Prepare the command for S3 upload
        const command = new PutObjectCommand({
            Bucket: BUCKET_NAME,
            Key: uniqueFilename, // Use the unique filename as the key
            Body: buffer,
            ContentType: file.type,
            ACL: 'public-read', // Make the file publicly accessible (adjust if needed)
        });

        // Upload the file to S3
        await s3Client.send(command);

        // Construct the public URL of the uploaded file
        // Note: URL format might vary slightly based on region and bucket settings
        const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uniqueFilename}`;

        return NextResponse.json({ success: true, url: fileUrl }, { status: 201 });

    } catch (error) {
        console.error("Error uploading file to S3:", error);
        // Provide a more specific error message if possible
        let errorMessage = 'Failed to upload file';
        if (error instanceof Error) {
            errorMessage = error.message;
        }
        return NextResponse.json({ error: 'Failed to upload file', details: errorMessage }, { status: 500 });
    }
}