
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { bookmarkId: string, userId: string } }) {
	const { bookmarkId, userId } = params;

	if (!bookmarkId || !userId || isNaN(Number(bookmarkId)) || isNaN(Number(userId))) {
		return NextResponse.json({ message: "Invalid bookmarkId or userId" }, { status: 400 });
	}

	try {
		const starred = await prisma.star.findUnique({
			where: {
				userId_bookmarkId: {
					userId: Number(userId),
					bookmarkId: Number(bookmarkId),
				}
			},
		});

		return NextResponse.json({ starred: Boolean(starred) });
	} catch (error) {
		console.error("Error checking if user starred bookmark:", error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}


export async function POST(req: NextRequest, { params }: { params: { bookmarkId: string, userId: string } }) {
	const { bookmarkId, userId } = params;

	if (!bookmarkId || !userId || isNaN(Number(bookmarkId)) || isNaN(Number(userId))) {
		return NextResponse.json({ message: "Invalid bookmarkId or userId" }, { status: 400 });
	}

	try {
		// Check if the user has already starred the bookmark using the compound unique key
		const existingStar = await prisma.star.findUnique({
			where: {
				userId_bookmarkId: {
					userId: Number(userId),
					bookmarkId: Number(bookmarkId),
				},
			},
		});

		if (existingStar) {
			return NextResponse.json({ message: "Bookmark already starred" }, { status: 400 });
		}

		// Create a new star entry for this bookmark and user
		await prisma.star.create({
			data: {
				bookmarkId: Number(bookmarkId),
				userId: Number(userId),
			},
		});

		return NextResponse.json({ message: "Bookmark starred successfully" });
	} catch (error) {
		console.error("Error starring bookmark:", error);
		return NextResponse.json({ message: "Internal server error" }, { status: 500 });
	}
}
