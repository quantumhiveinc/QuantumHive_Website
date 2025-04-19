// src/app/api/admin/leads/export/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/mongoose'; // Import Mongoose connection
import Lead, { ILead } from '@/models/Lead'; // Import Mongoose model and interface
import { FilterQuery } from 'mongoose'; // Import FilterQuery

const ALLOWED_SORT_FIELDS = ['fullName', 'email', 'sourceFormName', 'status', 'submissionTimestamp', '_id', 'phone', 'company', 'message', 'submissionUrl', 'ipAddress', 'createdAt', 'updatedAt']; // Use _id for Mongoose

// Helper function to escape CSV fields
const escapeCsvField = (field: string | number | boolean | Date | null | undefined): string => {
    if (field === null || field === undefined) {
        return '';
    }
    const stringField = String(field);
    // Check if quoting is needed (contains comma, quote, or newline)
    if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        // Escape double quotes by doubling them and wrap in double quotes
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
};

// Helper function to generate CSV string using Mongoose ILead interface
const generateCsv = (leads: ILead[]): string => {
    if (!leads || leads.length === 0) {
        return ''; // Return empty string if no leads
    }

    // Define headers explicitly to control order and inclusion - use _id
    const headers = [
        '_id', 'fullName', 'email', 'phone', 'company', 'message',
        'sourceFormName', 'submissionUrl', 'submissionTimestamp',
        // 'ipAddress', // Assuming ipAddress is not in ILead schema
        'status', 'createdAt', 'updatedAt'
    ];

    const headerRow = headers.map(escapeCsvField).join(',');

    const dataRows = leads.map(lead => {
        return headers.map(header => {
            // Access Mongoose document properties, handle potential undefined
            let value = lead[header as keyof ILead];
            // Format dates to ISO string
            if (value instanceof Date) {
                value = value.toISOString();
            }
            return escapeCsvField(value);
        }).join(',');
    });

    return [headerRow, ...dataRows].join('\n');
};


export async function GET(request: NextRequest) {
    const session = await auth();

    // 1. Authentication & Authorization Check
    if (!session?.user /* || !session.user.isAdmin */) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(request.url);

        // 2. Parse Query Parameters (Filters & Sorting only)
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

        // 3. Build Mongoose Filter Object (Same as fetch route)
        const filter: FilterQuery<ILead> = {};
        if (filterFormName) filter.sourceFormName = filterFormName;
        if (filterStatus) filter.status = filterStatus;
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
                    const endDate = new Date(filterEndDate);
                    endDate.setDate(endDate.getDate() + 1);
                    filter.submissionTimestamp.$lt = endDate;
                } catch {
                    return NextResponse.json({ message: 'Invalid filterEndDate format. Use ISO date string.' }, { status: 400 });
                }
            }
        }
        if (searchQuery) {
            const searchRegex = { $regex: searchQuery, $options: 'i' };
            filter.$or = [
                { fullName: searchRegex },
                { email: searchRegex },
                { company: searchRegex },
            ];
        }

        // 4. Build Mongoose Sort Object (Same as fetch route)
        const sort: { [key: string]: 'asc' | 'desc' } = {
            [sortBy]: sortOrder,
        };

        // 5. Execute Mongoose Query (Fetch ALL matching leads)
        await dbConnect(); // Ensure DB connection
        const leads: ILead[] = await Lead.find(filter)
            .sort(sort)
            .exec();
            // No skip/limit for export

        // 6. Generate CSV
        const csvData = generateCsv(leads);

        // 7. Set Headers and Return Response
        const headers = new Headers();
        headers.set('Content-Type', 'text/csv; charset=utf-8');
        headers.set('Content-Disposition', `attachment; filename="leads_export_${new Date().toISOString().split('T')[0]}.csv"`); // Add date to filename

        return new NextResponse(csvData, {
            status: 200,
            headers: headers,
        });

    } catch (error) {
        console.error("Error generating lead export:", error);
        // Handle Mongoose errors
        if (error instanceof Error && error.name === 'CastError') {
            return NextResponse.json({ message: 'Invalid ID format in query during export.' }, { status: 400 });
        }
        // Generic error handling
        return NextResponse.json({ message: 'An error occurred during lead export.' }, { status: 500 });
    }
}