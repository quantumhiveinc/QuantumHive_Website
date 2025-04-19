// src/app/api/admin/leads/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth'; // Assuming auth setup in src/auth.ts
import dbConnect from '@/lib/mongoose'; // Import Mongoose connection
import Lead, { ILead } from '@/models/Lead'; // Restore ILead import
import { FilterQuery } from 'mongoose'; // Restore FilterQuery import

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

        // 3. Build Mongoose Filter Object
        const filter: FilterQuery<ILead> = {}; // Restore FilterQuery type

        if (filterFormName) {
            filter.sourceFormName = filterFormName;
        }
        if (filterStatus) {
            filter.status = filterStatus;
        }
        if (filterStartDate || filterEndDate) {
            filter.submissionTimestamp = {};
            if (filterStartDate) {
                try {
                    filter.submissionTimestamp.$gte = new Date(filterStartDate);
                } catch {
                    return NextResponse.json({ message: 'Invalid filterStartDate format. Use ISO date string.' }, { status: 400 });
                }
            }
            if (filterEndDate) {
                 try {
                    // Add 1 day to make the end date inclusive
                    const endDate = new Date(filterEndDate);
                    endDate.setDate(endDate.getDate() + 1);
                    filter.submissionTimestamp.$lt = endDate;
                } catch {
                    return NextResponse.json({ message: 'Invalid filterEndDate format. Use ISO date string.' }, { status: 400 });
                }
            }
        }
        if (searchQuery) {
            const searchRegex = { $regex: searchQuery, $options: 'i' }; // Case-insensitive regex
            filter.$or = [
                { fullName: searchRegex },
                { email: searchRegex },
                { company: searchRegex },
            ];
        }

        // 4. Build Mongoose Sort Object
        const sort: { [key: string]: 'asc' | 'desc' } = {
            [sortBy]: sortOrder,
        };

        // 5. Calculate Pagination
        const skip = (page - 1) * limit;

        // 6. Execute Mongoose Queries (Fetch Leads + Count)
        await dbConnect(); // Ensure DB connection
        const [leads, totalCount] = await Promise.all([
            Lead.find(filter)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .exec(),
            Lead.countDocuments(filter).exec(),
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
        // Handle Mongoose errors
        if (error instanceof Error && error.name === 'CastError') {
            return NextResponse.json({ message: 'Invalid ID format in query.' }, { status: 400 });
        }
        // Generic error handling
        return NextResponse.json({ message: 'An error occurred while fetching leads.' }, { status: 500 });
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

        await dbConnect(); // Ensure DB connection
        // Create lead in database using Mongoose
        const newLead = await Lead.create({
            // data: { // Mongoose doesn't use 'data' wrapper
                fullName,
                email,
                phone,
                company,
                message: message ?? null, // Use null if undefined
                // companySize: companySize ?? null, // Removed as it's not in the Prisma schema
                sourceFormName,
                submissionUrl,
                status: 'New', // Default status
                // submissionTimestamp is handled by Mongoose schema's default
            // }, // Mongoose doesn't use 'data' wrapper
        });

        return NextResponse.json(newLead, { status: 201 }); // 201 Created

    } catch (error) {
        console.error("Error creating lead:", error);

        if (error instanceof SyntaxError) { // Handle JSON parsing errors
             return NextResponse.json({ message: 'Invalid JSON payload' }, { status: 400 });
        }
        // Handle Mongoose specific errors
        if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
            // Unique constraint violation (likely email if schema defines it)
            return NextResponse.json({ message: 'Lead with this email might already exist.' }, { status: 409 }); // 409 Conflict
        }
        if (error instanceof Error && error.name === 'ValidationError') {
            // Extract specific validation messages if needed
            return NextResponse.json({ message: `Validation failed: ${error.message}` }, { status: 400 });
        }
        // Generic error handling
        return NextResponse.json({ message: 'An error occurred while creating the lead.' }, { status: 500 });
    }
}