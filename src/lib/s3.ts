import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "crypto";

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.AWS_S3_BUCKET_NAME;

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  // In a real app, consider more robust error handling or logging
  // For now, we throw to prevent startup if config is missing
  throw new Error("Missing required AWS S3 environment variables (AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET_NAME)");
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

interface PresignedUrlOptions {
  fileName: string;
  fileType: string;
  // Optional: Add ACL, CacheControl, Metadata etc. if needed
  // acl?: 'private' | 'public-read' | 'public-read-write' | 'authenticated-read' | 'aws-exec-read' | 'bucket-owner-read' | 'bucket-owner-full-control';
  // cacheControl?: string;
}

interface PresignedUrlResult {
  uploadUrl: string;
  key: string; // The final key (path) in the S3 bucket
  publicUrl: string; // The public URL after upload (assuming public access or constructing based on bucket policy)
}

/**
 * Generates a presigned URL for uploading a file directly to S3 via PUT request.
 * Ensures unique filenames using UUID.
 * @param options - Options including original fileName and fileType.
 * @returns An object containing the presigned upload URL, the unique object key, and the public URL.
 */
export async function generatePresignedPutUrl(
  options: PresignedUrlOptions
): Promise<PresignedUrlResult> {
  const { fileName, fileType } = options;

  // Sanitize filename (optional, but recommended)
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');

  // Generate a unique key for the S3 object
  const uniqueKey = `uploads/${randomUUID()}-${sanitizedFileName}`; // Store in an 'uploads' folder

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: uniqueKey,
    ContentType: fileType,
    // ACL: options.acl || 'public-read', // Example: Default to public-read if needed, adjust based on security requirements
    // CacheControl: options.cacheControl || 'max-age=31536000', // Example: Cache for 1 year
  });

  try {
    // Generate the presigned URL (expires in 1 hour by default, adjustable)
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Construct the public URL. Adjust if your bucket isn't configured for direct public access.
    const publicUrl = `https://${bucketName}.s3.${region}.amazonaws.com/${uniqueKey}`;

    return { uploadUrl, key: uniqueKey, publicUrl };
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    // Consider more specific error handling or logging
    throw new Error("Could not generate presigned URL for S3 upload.");
  }
}

// Optionally export the client if direct S3 operations are needed elsewhere
export { s3Client };