import { NextResponse, NextRequest } from 'next/server';
import dbConnect from '@/lib/mongoose'; // Import Mongoose connection
import Lead from '@/models/Lead'; // Import Mongoose model

// Basic email validation regex (adjust as needed for robustness)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fullName,
      email,
      phone,
      company,
      message,
      sourceFormName,
      submissionUrl,
    } = body;

    // Attempt to get IP address from headers
    const ipAddress = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'Unknown'; // request.ip is not available in NextRequest

    // --- Data Validation ---
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      return NextResponse.json({ error: 'Full name is required.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || email.trim() === '') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }
    if (!sourceFormName || typeof sourceFormName !== 'string' || sourceFormName.trim() === '') {
        return NextResponse.json({ error: 'Source form name is required.' }, { status: 400 });
    }

    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
    }

    await dbConnect(); // Ensure DB connection
    // --- Create Lead Record ---
    const newLead = await Lead.create({
      // data: { // Mongoose doesn't use 'data' wrapper
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(), // Store email in lowercase
        phone: phone?.toString().trim() || null, // Ensure phone is string or null
        company: company?.toString().trim() || null,
        message: message?.toString().trim() || null,
        sourceFormName: sourceFormName.trim(),
        submissionUrl: submissionUrl?.toString().trim() || null,
        ipAddress: ipAddress,
        // submissionTimestamp and status have defaults in Mongoose schema
      // }, // Mongoose doesn't use 'data' wrapper
    });

    // --- Success Response ---
    return NextResponse.json({ message: 'Lead submitted successfully.', lead: newLead }, { status: 201 });

  } catch (error: unknown) {
    console.error('Lead submission error:', error);

    // Handle Mongoose specific errors
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
        // Unique constraint violation (likely email if schema defines it)
        // Check keyPattern if more specific error needed: const keyPattern = (error as any).keyPattern;
        return NextResponse.json({ error: 'This email address might already be submitted.' }, { status: 409 }); // 409 Conflict
    }
    if (error instanceof Error && error.name === 'ValidationError') {
        // Extract specific validation messages if needed
        return NextResponse.json({ error: `Validation failed: ${error.message}` }, { status: 400 });
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON format in request body.' }, { status: 400 });
    }

    // Generic server error
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}