import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Prisma client

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
	const bookmarkId = params.get("bookmarkId");
	const userId = params.get("userId");

  // Ensure bookmarkId and userId are provided in the query params
  if (!bookmarkId || !userId) {
    return NextResponse.json({ message: "bookmarkId and userId are required" }, { status: 400 });
  }

  const bookmarkIdInt = parseInt(bookmarkId);
  const userIdInt = parseInt(userId);

  // Validate that the IDs are numbers
  if (isNaN(bookmarkIdInt) || isNaN(userIdInt)) {
    return NextResponse.json({ message: "Invalid bookmarkId or userId" }, { status: 400 });
  }

  try {
    // Fetch the count of stars for the given bookmark
    const starCount = await prisma.star.count({
      where: {
        bookmarkId: bookmarkIdInt,
      },
    });

    // Fetch if the current user has starred the bookmark
    const hasStarred = await prisma.star.findUnique({
      where: {
        userId_bookmarkId: {
          userId: userIdInt,
          bookmarkId: bookmarkIdInt,
        },
      },
    });

    return NextResponse.json({
      starCount,
      hasStarred: hasStarred ? true : false,
    });
  } catch (error) {
    console.error("Error fetching star count:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

