// src/app/api/admin/leads/route.ts
import { NextResponse, NextRequest } from 'next/server';
// Ensure Prisma types are imported correctly
import { Prisma } from '@prisma/client';
import { auth } from '@/auth'; // Assuming auth setup in src/auth.ts
// Ensure prisma instance is imported correctly
import prisma from '@/lib/prisma'; // Assuming shared prisma client

const ALLOWED_SORT_FIELDS = ['fullName', 'email', 'sourceFormName', 'status', 'submissionTimestamp'];

export async function GET(request: NextRequest) {
    const session = await auth();

    // 1. Authentication & Authorization Check
    // Adjust this check based on your actual auth setup (e.g., checking for a specific role)
    if (!session?.user /* || !session.user.isAdmin */) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);

        // 2. Parse Query Parameters
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const sortBy = searchParams.get('sortBy') || 'submissionTimestamp';
        const sortOrder = searchParams.get('sortOrder') || 'desc';
        const filterFormName = searchParams.get('filterFormName');
        const filterStatus = searchParams.get('filterStatus');
        const filterStartDate = searchParams.get('filterStartDate');
        const filterEndDate = searchParams.get('filterEndDate');
        const searchQuery = searchParams.get('searchQuery');

        // Validate sortBy
        if (!ALLOWED_SORT_FIELDS.includes(sortBy)) {
            return NextResponse.json({ message: `Invalid sortBy parameter. Allowed fields: ${ALLOWED_SORT_FIELDS.join(', ')}` }, { status: 400 });
        }
        // Validate sortOrder
        if (sortOrder !== 'asc' && sortOrder !== 'desc') {
            return NextResponse.json({ message: 'Invalid sortOrder parameter. Use "asc" or "desc".' }, { status: 400 });
        }

        // 3. Build Prisma Where Clause
        // 3. Build Prisma Where Clause - Restore explicit type
        const where: Prisma.LeadWhereInput = {};

        if (filterFormName) {
            where.sourceFormName = filterFormName;
        }
        if (filterStatus) {
            where.status = filterStatus;
        }
        if (filterStartDate || filterEndDate) {
            where.submissionTimestamp = {};
            if (filterStartDate) {
                try {
                    where.submissionTimestamp.gte = new Date(filterStartDate);
                } catch { // Keep unused variable removed
                    return NextResponse.json({ message: 'Invalid filterStartDate format. Use ISO date string.' }, { status: 400 });
                }
            }
            if (filterEndDate) {
                 try {
                    // Add 1 day to make the end date inclusive
                    const endDate = new Date(filterEndDate);
                    endDate.setDate(endDate.getDate() + 1);
                    where.submissionTimestamp.lt = endDate;
                } catch { // Keep unused variable removed
                    return NextResponse.json({ message: 'Invalid filterEndDate format. Use ISO date string.' }, { status: 400 });
                }
            }
        }
        if (searchQuery) {
            where.OR = [
                { fullName: { contains: searchQuery, mode: 'insensitive' } },
                { email: { contains: searchQuery, mode: 'insensitive' } },
                { company: { contains: searchQuery, mode: 'insensitive' } },
            ];
        }

        // 4. Build Prisma OrderBy Clause - Restore explicit type
        const orderBy: Prisma.LeadOrderByWithRelationInput = {
            [sortBy]: sortOrder,
        };

        // 5. Calculate Pagination
        const skip = (page - 1) * limit;
        const take = limit;

        // 6. Execute Prisma Queries (Fetch Leads + Count)
        const [leads, totalCount] = await prisma.$transaction([
            prisma.lead.findMany({
                where,
                orderBy,
                skip,
                take,
            }),
            prisma.lead.count({ where }),
        ]);

        // 7. Calculate Total Pages
        const totalPages = Math.ceil(totalCount / limit);

        // 8. Return Response
        return NextResponse.json({
            leads,
            totalCount,
            currentPage: page,
            totalPages,
        });

    } catch (error) {
        console.error("Error fetching leads:", error);
        // Log the specific error for debugging
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
             // Handle known Prisma errors specifically if needed
             return NextResponse.json({ message: 'Database error occurred.', error: error.message }, { status: 500 });
        } else if (error instanceof Error) {
             return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
        } else {
             return NextResponse.json({ message: 'An unknown error occurred.' }, { status: 500 });
        }
    }
}

// POST handler for creating new leads
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Basic validation (adjust based on your actual requirements)
        const {
            fullName,
            email,
            phone,
            company,
            message, // Optional based on form logic
            // companySize, // Removed as it's not used
            sourceFormName,
            submissionUrl
        } = body;

        if (!fullName || !email || !sourceFormName || !submissionUrl || !phone || !company) {
             // Added phone and company to required fields based on form
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
       }

       // Validate phone number format (simple example)
       const phoneRegex = /^[+\-\(\)\s\d]{10,20}$/; // Allows digits, +, -, (), spaces, 10-20 chars
       if (!phoneRegex.test(phone)) {
           return NextResponse.json({ message: 'Invalid phone number format' }, { status: 400 });
       }

       // More specific validation (e.g., email format) can be added here

        // Create lead in database
        const newLead = await prisma.lead.create({
            data: {
                fullName,
                email,
                phone,
                company,
                message: message ?? null, // Use null if undefined
                // companySize: companySize ?? null, // Removed as it's not in the Prisma schema
                sourceFormName,
                submissionUrl,
                status: 'New', // Default status
                // submissionTimestamp is handled by Prisma's default @default(now())
            },
        });

        return NextResponse.json(newLead, { status: 201 }); // 201 Created

    } catch (error) {
        console.error("Error creating lead:", error);

        if (error instanceof SyntaxError) { // Handle JSON parsing errors
             return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
        } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
            // Handle specific Prisma errors (e.g., unique constraint violation)
            if (error.code === 'P2002') { // Unique constraint failed
                 return NextResponse.json({ message: 'Lead with this email/phone might already exist.' }, { status: 409 }); // 409 Conflict
            }
            return NextResponse.json({ message: 'Database error occurred.', error: error.message }, { status: 500 });
        } else if (error instanceof Error) {
             return NextResponse.json({ message: 'An unexpected error occurred.', error: error.message }, { status: 500 });
        } else {
             return NextResponse.json({ message: 'An unknown error occurred.' }, { status: 500 });
        }
    }
}