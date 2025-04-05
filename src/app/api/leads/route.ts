import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma'; // Assuming default export from src/lib/prisma.ts

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

    // --- Create Lead Record ---
    const newLead = await prisma.lead.create({
      data: {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(), // Store email in lowercase
        phone: phone?.toString().trim() || null, // Ensure phone is string or null
        company: company?.toString().trim() || null,
        message: message?.toString().trim() || null,
        sourceFormName: sourceFormName.trim(),
        submissionUrl: submissionUrl?.toString().trim() || null,
        ipAddress: ipAddress,
        // submissionTimestamp and status have defaults in schema
      },
    });

    // --- Success Response ---
    return NextResponse.json({ message: 'Lead submitted successfully.', lead: newLead }, { status: 201 });

  } catch (error: unknown) {
    console.error('Lead submission error:', error);

    // Handle potential Prisma errors (needs type checking for safety)
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      // Check if meta exists and is an object before accessing target
      if ('meta' in error && typeof error.meta === 'object' && error.meta !== null && 'target' in error.meta) {
        // Ensure target is an array or string before calling includes
        const target = error.meta.target;
        if ((Array.isArray(target) || typeof target === 'string') && target.includes('email')) {
          // Specific error for duplicate email
          return NextResponse.json({ error: 'This email address has already been submitted.' }, { status: 409 }); // 409 Conflict
        }
      }
      // Handle other Prisma P2002 errors if needed, or fall through to generic error
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON format in request body.' }, { status: 400 });
    }

    // Generic server error
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}