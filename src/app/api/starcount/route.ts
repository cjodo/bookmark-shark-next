
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Prisma client

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
	const bookmarkId = params.get("bookmarkId");

  if (!bookmarkId) {
    return NextResponse.json({ message: "bookmarkId is required" }, { status: 400 });
  }

  const bookmarkIdInt = parseInt(bookmarkId);

  // Validate that the IDs are numbers
  if (isNaN(bookmarkIdInt) ) {
    return NextResponse.json({ message: "Invalid bookmarkId or userId" }, { status: 400 });
  }

  try {
    // Fetch the count of stars for the given bookmark
    const starCount = await prisma.star.count({
      where: {
        bookmarkId: bookmarkIdInt,
      },
    });


    return NextResponse.json({
      starCount,
    });
  } catch (error) {
    console.error("Error fetching star count:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

