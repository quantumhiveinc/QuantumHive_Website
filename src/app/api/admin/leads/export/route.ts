// src/app/api/admin/leads/export/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { Prisma, Lead } from '@prisma/client'; // Import Lead type
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

const ALLOWED_SORT_FIELDS = ['fullName', 'email', 'sourceFormName', 'status', 'submissionTimestamp', 'id', 'phone', 'company', 'message', 'submissionUrl', 'ipAddress', 'createdAt', 'updatedAt']; // Add all relevant fields

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

// Helper function to generate CSV string
const generateCsv = (leads: Lead[]): string => {
    if (!leads || leads.length === 0) {
        return ''; // Return empty string if no leads
    }

    // Define headers explicitly to control order and inclusion
    const headers = [
        'id', 'fullName', 'email', 'phone', 'company', 'message',
        'sourceFormName', 'submissionUrl', 'submissionTimestamp',
        'ipAddress', 'status', 'createdAt', 'updatedAt'
    ];

    const headerRow = headers.map(escapeCsvField).join(',');

    const dataRows = leads.map(lead => {
        return headers.map(header => {
            let value = lead[header as keyof Lead];
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

        // 3. Build Prisma Where Clause (Same as fetch route)
        const where: Prisma.LeadWhereInput = {};
        if (filterFormName) where.sourceFormName = filterFormName;
        if (filterStatus) where.status = filterStatus;
        if (filterStartDate || filterEndDate) {
            where.submissionTimestamp = {};
            if (filterStartDate) {
                try {
                    where.submissionTimestamp.gte = new Date(filterStartDate);
                } catch {
                    return NextResponse.json({ message: 'Invalid filterStartDate format. Use ISO date string.' }, { status: 400 });
                }
            }
            if (filterEndDate) {
                 try {
                    const endDate = new Date(filterEndDate);
                    endDate.setDate(endDate.getDate() + 1);
                    where.submissionTimestamp.lt = endDate;
                } catch {
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

        // 4. Build Prisma OrderBy Clause (Same as fetch route)
        const orderBy: Prisma.LeadOrderByWithRelationInput = {
            [sortBy]: sortOrder,
        };

        // 5. Execute Prisma Query (Fetch ALL matching leads)
        const leads = await prisma.lead.findMany({
            where,
            orderBy,
            // No skip/take for export
        });

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
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
             return NextResponse.json({ message: 'Database error occurred during export.', error: error.message }, { status: 500 });
        } else if (error instanceof Error) {
             return NextResponse.json({ message: 'An unexpected error occurred during export.', error: error.message }, { status: 500 });
        } else {
             return NextResponse.json({ message: 'An unknown error occurred during export.' }, { status: 500 });
        }
    }
}