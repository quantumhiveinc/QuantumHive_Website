// src/app/api/admin/tags/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

// GET handler to list all tags (Admin only - or adjust if needed for editor suggestions)
export async function GET() {
  const session = await auth();
  // Keep admin-only for now, can be adjusted if non-admins need direct access
  if (!session?.user || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' }, // Order alphabetically
    });
    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
  }
}

// No POST, PUT, DELETE needed here as tags are managed via blog post updates