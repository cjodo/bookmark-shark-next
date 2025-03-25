import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const bookmarkId = searchParams.get('bookmarkId');
  const userId = searchParams.get('userId');

  // Validate inputs
  if (!bookmarkId || !userId) {
    return NextResponse.json({ error: 'Bookmark ID and User ID are required' }, { status: 400 });
  }

  try {
    // Delete the star record
    await prisma.star.delete({
      where: {
        userId_bookmarkId: {
          bookmarkId: parseInt(bookmarkId, 10),
          userId: parseInt(userId, 10),
        },
      },
    });

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to unstar bookmark' }, { status: 500 });
  }
}

